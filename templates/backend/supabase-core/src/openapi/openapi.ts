import { env } from '../core/env.js';

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: '{{appName}} Backend API',
    version: '0.1.0'
  },
  servers: [
    {
      url: env.PUBLIC_API_URL
    }
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    responses: {
      ValidationError: {
        description: 'Request validation failed'
      },
      Unauthorized: {
        description: 'Authentication required'
      },
      Forbidden: {
        description: 'Admin privileges required'
      }
    }
  },
  paths: {
    '/health': {
      get: {
        security: [],
        responses: {
          '200': {
            description: 'Process is alive'
          }
        }
      }
    },
    '/ready': {
      get: {
        security: [],
        responses: {
          '200': {
            description: 'Backend dependencies are configured'
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        security: [],
        responses: {
          '201': {
            description: 'Registered user'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        security: [],
        responses: {
          '200': {
            description: 'JWT token'
          }
        }
      }
    }
  }
};
