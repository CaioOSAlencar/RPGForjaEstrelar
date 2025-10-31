// Configuração Swagger principal para importar rotas e schemas

// Importar documentação de autenticação
import authRegister from '../routes/auth/authRegister.js';
import authLogin from '../routes/auth/authLogin.js';
import authUpdateProfile from '../routes/auth/authUpdateProfile.js';
import authSchemas from '../schemas/auth/authSchemas.js';

// Importar documentação de campanhas
import campaignRoutes from '../routes/campaigns/campaignRoutes.js';
import campaignSchemas from '../schemas/campaigns/campaignSchemas.js';

// Importar documentação de cenas
import sceneRoutes from '../routes/scenes/sceneRoutes.js';
import sceneSchemas from '../schemas/scenes/sceneSchemas.js';

// Importar documentação de tokens
import tokenRoutes from '../routes/tokens/tokenRoutes.js';
import tokenSchemas from '../schemas/tokens/tokenSchemas.js';

// Importar documentação de chat
import chatRoutes from '../routes/chat/chatRoutes.js';
import chatSchemas from '../schemas/chat/chatSchemas.js';



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
      },
      // RF07, RF08, RF09, RF10, RF43 - Campanhas e Convites
      { 
        name: '🏰 Campanhas', 
        description: 'RF07, RF08, RF09, RF10, RF43 - Criar campanhas, convites, gerenciamento de jogadores'
      },
      // RF11, RF12, RF45 - Cenas e Mapas
      { 
        name: '🗺️ Cenas', 
        description: 'RF11, RF12, RF45 - Criar cenas, upload de mapas, configurações de grid'
      },
      // RF13, RF14, RF15 - Tokens e Tempo Real
      { 
        name: '🎭 Tokens', 
        description: 'RF13, RF14, RF15 - Upload, gerenciamento, movimentação, rotação e redimensionamento de tokens'
      },
      // RF23, RF20 - Chat e Dados
      { 
        name: '💬 Chat', 
        description: 'RF23, RF20 - Chat em tempo real com timestamp, nome do usuário e rolagem de dados'
      }
    ],
    paths: {
      ...authRegister,
      ...authLogin,
      ...authUpdateProfile,
      ...campaignRoutes,
      ...sceneRoutes,
      ...tokenRoutes,
      ...chatRoutes
    },
    components: {
      schemas: {
        ...authSchemas,
        ...campaignSchemas,
        ...sceneSchemas,
        ...tokenSchemas,
        ...chatSchemas
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