import { log } from '../lib/logger.js';
import { getSourceKind } from '../connectors/source.js';

export async function checkProject(config) {
  log.info(`Config: ${config.paths.configPath}`);
  log.info(`Output: ${config.paths.outputDir}`);
  log.info(`Collections: ${config.collections.map((item) => item.name).join(', ')}`);

  const sourceKind = getSourceKind(config);
  log.info(`Source kind: ${sourceKind}`);

  if (sourceKind === 'mongodb') {
    reportEnv(config.source?.uriEnv ?? 'MONGO_URI', true);
    reportEnv('MONGO_DATABASE', false);
  } else {
    const sourceBaseUrlEnv = config.source?.baseUrlEnv ?? 'MONGO_API_BASE_URL';
    reportEnv(sourceBaseUrlEnv, true);
    reportEnv(config.source?.tokenEnv ?? 'MONGO_API_TOKEN', false);
  }

  reportEnv('SUPABASE_URL', false);
  reportEnv('SUPABASE_SERVICE_ROLE_KEY', false);

  for (const collection of config.collections) {
    if (!collection.name) throw new Error('Every collection needs a name.');
    if (!collection.sourcePath) throw new Error(`${collection.name} needs sourcePath.`);
    if (!collection.supabaseTable) throw new Error(`${collection.name} needs supabaseTable.`);
  }

  log.info(`Dry run: ${config.runtime.dryRun}`);
  log.info('Project check complete.');
}

function reportEnv(name, required) {
  const hasValue = Boolean(process.env[name]);
  if (required && !hasValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  log.info(`${name}: ${hasValue ? 'set' : 'not set'}`);
}
