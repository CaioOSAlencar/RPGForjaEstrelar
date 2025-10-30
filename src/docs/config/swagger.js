export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🎲 RPG Forja Estrelar API',
      version: '1.0.0',
      description: 'API para sistema de RPG online gratuito',
      contact: {
        name: 'CaioOSAlencar',
        email: 'contato@rpgforjaestrelar.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/docs/routes/*.js']
};