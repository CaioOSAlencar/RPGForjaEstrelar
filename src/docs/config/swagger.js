// Configuração Swagger principal para importar rotas e schemas

// Importar documentação de autenticação
import authRegister from '../routes/auth/authRegister.js';
import authSchemas from '../schemas/auth/authSchemas.js';

const getSwaggerOptions = () => ({
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🎲 RPG Forja Estrelar API',
      version: '1.0.0',
      description: 'API para sistema de RPG online gratuito com todos os requisitos funcionais implementados.'
    },
    servers: [
      { 
        url: process.env.SWAGGER_DEV_URL || 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      // RF01, RF02, RF03, RF04, RF05, RF06 - Autenticação e Usuários
      { 
        name: '🔐 Autenticação', 
        description: 'RF01, RF02, RF03, RF04, RF05, RF06 - Cadastro, login, JWT, validações e edição de perfil'
      }
    ],
    paths: {
      ...authRegister
    },
    components: {
      schemas: {
        ...authSchemas
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [] // Não precisamos de arquivos adicionais pois já temos tudo definido
});

export default getSwaggerOptions;