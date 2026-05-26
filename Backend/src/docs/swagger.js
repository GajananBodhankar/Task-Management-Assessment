const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'JWT-secured task management API built with Express and MongoDB.',
  },
  servers: [{ url: 'http://localhost:5000/api' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Create a user account',
        responses: { 201: { description: 'Account created' }, 409: { description: 'Duplicate email' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login and receive a JWT',
        responses: { 200: { description: 'Authenticated' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Read current user',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Current user' } },
      },
    },
    '/tasks': {
      get: {
        summary: 'List current user tasks with filters, search, and pagination',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'completed'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'number' } },
          { name: 'limit', in: 'query', schema: { type: 'number' } },
        ],
        responses: { 200: { description: 'Task list' } },
      },
      post: {
        summary: 'Create a task',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Task created' } },
      },
    },
    '/tasks/{id}': {
      patch: {
        summary: 'Update a task',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Task updated' }, 404: { description: 'Task not found' } },
      },
      delete: {
        summary: 'Delete a task',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Task deleted' } },
      },
    },
    '/tasks/admin/all': {
      get: {
        summary: 'Admin-only list of all users tasks',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'All task list' }, 403: { description: 'Forbidden' } },
      },
    },
  },
};

module.exports = swaggerDocument;
