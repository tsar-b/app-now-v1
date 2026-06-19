import { mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { loadConfig } from '../lib/config.js';
import { log } from '../lib/logger.js';

export async function createBackendBlueprint() {
  const config = await loadConfig();
  const outputDir = process.env.APPNOW_BACKEND_BLUEPRINT_DIR ?? './docs/generated';
  await mkdir(outputDir, { recursive: true });

  const blueprint = renderBlueprint(config);
  const openApi = renderOpenApiStarter(config);

  await writeFile(join(outputDir, 'backend-blueprint.md'), blueprint, 'utf8');
  await writeFile(join(outputDir, 'openapi-starter.json'), `${JSON.stringify(openApi, null, 2)}\n`, 'utf8');

  log.info(`Backend blueprint written to ${outputDir}`);
}

function renderBlueprint(config) {
  const collections = config.collections.map((collection) => {
    const table = collection.supabaseTable ?? collection.name;
    const fields = Object.keys(collection.mapping ?? {});

    return [
      `### ${titleCase(collection.name)}`,
      '',
      `- Source: \`${collection.sourcePath ?? collection.name}\``,
      `- Supabase table: \`${table}\``,
      `- Approval mode: \`${collection.approval?.mode ?? 'default'}\``,
      `- Primary key: \`${collection.primaryKey ?? 'id'}\``,
      `- Required fields: ${formatList(collection.requiredFields ?? [])}`,
      `- Mapped fields: ${formatList(fields)}`,
      '',
      '| Surface | Endpoint | Notes |',
      '| --- | --- | --- |',
      `| Public list | \`GET /api/${collection.name}\` | Only expose if RLS policy allows anonymous reads. |`,
      `| Auth list | \`GET /api/${collection.name}/mine\` | Scope by \`auth.uid()\` or JWT subject. |`,
      `| Admin list | \`GET /api/admin/${table}\` | Uses service role through backend only. |`,
      `| Admin update | \`PATCH /api/admin/${table}/:id\` | Validate writable fields before update. |`,
      ''
    ].join('\n');
  });

  return `# AppNow Backend Blueprint

Generated from \`${relative(process.cwd(), config.paths.configPath)}\`.

## Architecture Defaults

- Supabase/Postgres is the primary application database.
- MongoDB is a legacy/source connector, not the core runtime database.
- Service role access stays server-side only.
- Every exposed Supabase table starts with RLS enabled.
- Express routes validate params, query, and body before controllers.
- Mutation endpoints should support \`Idempotency-Key\` once real payments, bookings, or orders exist.
- OpenAPI is emitted early so frontend and backend can work from one contract.
- SHC-derived modules are extracted as contracts: auth, admin CRUD, initialize, request workflow, Kakao address.

## Runtime Modules

- \`core\`: env parsing, security middleware, logging, error handling, HTTP server.
- \`db\`: Supabase anon/admin clients and future typed repositories.
- \`middleware\`: auth, admin authorization, validation, idempotency, request context.
- \`modules/auth\`: register, login, provider boundaries.
- \`modules/users\`: profile and user-owned data.
- \`modules/adminCrud\`: controlled admin table access.
- \`modules/bookings\`: SHC-derived booking workflow template.
- \`modules/requests\`: generalized service-booking/request workflow.
- \`modules/appInitialize\`: versioned app bootstrap payload for frontend shells.
- \`modules/integrations\`: Kakao and future provider APIs.
- \`templates/backend/mongo-legacy\`: migration and source comparison only.

## Collections

${collections.join('\n')}
## Build Order

1. Generate Supabase tables with \`npm run db:automation\`.
2. Run generated RLS SQL before exposing tables through REST.
3. Generate this blueprint with \`npm run backend:blueprint\`.
4. Create typed Zod schemas for each collection's write surface.
5. Add request workflow tables and slot constraints for service-booking apps.
6. Add OpenAPI paths as routes become real.
7. Add tests around auth, RLS-sensitive reads, admin writes, and idempotent mutations.

## Done Means

- \`/health\`, \`/ready\`, and \`/openapi.json\` respond.
- \`/api/app/initialize\` returns a versioned bootstrap payload.
- Auth, admin, and user-owned routes are separated.
- No route spreads arbitrary request bodies into database writes.
- Admin lists are paginated and filtered server-side.
- Request booking has a database-level unique active slot constraint.
- Logs include request IDs and do not print secrets.
- App-specific policies are documented beside generated SQL.
`;
}

function renderOpenApiStarter(config) {
  const paths = {
    '/health': {
      get: {
        security: [],
        responses: {
          200: {
            description: 'Process is alive'
          }
        }
      }
    },
    '/ready': {
      get: {
        security: [],
        responses: {
          200: {
            description: 'Backend dependencies are configured'
          }
        }
      }
    },
    '/api/app/initialize': {
      get: {
        security: [],
        responses: {
          200: {
            description: 'Versioned app bootstrap payload'
          }
        }
      }
    },
    '/api/requests': {
      post: {
        tags: ['requests'],
        summary: 'Create service request',
        responses: {
          201: {
            description: 'Created request'
          },
          409: {
            description: 'Time slot is unavailable'
          }
        }
      }
    },
    '/api/requests/history': {
      get: {
        tags: ['requests'],
        summary: 'Current user request history',
        responses: {
          200: {
            description: 'Request history'
          }
        }
      }
    }
  };

  for (const collection of config.collections) {
    const table = collection.supabaseTable ?? collection.name;
    paths[`/api/admin/${table}`] = {
      get: {
        tags: ['admin'],
        summary: `List ${table}`,
        responses: {
          200: {
            description: `Rows from ${table}`
          }
        }
      }
    };
    paths[`/api/admin/${table}/{id}`] = {
      patch: {
        tags: ['admin'],
        summary: `Update ${table}`,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: `Updated ${table} row`
          }
        }
      },
      delete: {
        tags: ['admin'],
        summary: `Delete ${table}`,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Delete confirmation'
          }
        }
      }
    };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'AppNow Generated Backend API',
      version: '0.1.0'
    },
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    paths
  };
}

function formatList(values) {
  if (!values.length) return '`none`';
  return values.map((value) => `\`${value}\``).join(', ');
}

function titleCase(value) {
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
