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

// Importar documentação de distância
import distanceRoutes from '../routes/distanceRoutes.js';
import distanceSchemas from '../schemas/distanceSchemas.js';

// Importar documentação de fichas
import characterSheetRoutes from '../routes/characterSheetRoutes.js';
import characterSheetSchemas from '../schemas/characterSheetSchemas.js';

// Importar documentação de dados
import diceRoutes from '../routes/diceRoutes.js';
import diceSchemas from '../schemas/diceSchemas.js';

// Importar documentação de realtime
import realtimeRoutes from '../routes/realtimeRoutes.js';

// Importar documentação de notas
import noteRoutes from '../routes/noteRoutes.js';
import noteSchemas from '../schemas/noteSchemas.js';

// Importar documentação de macros
import diceMacroRoutes from '../routes/diceMacroRoutes.js';
import diceMacroSchemas from '../schemas/diceMacroSchemas.js';

// Importar documentação de música
import musicRoutes from '../routes/musicRoutes.js';
import musicSchemas from '../schemas/musicSchemas.js';

// Importar documentação de import/export
import campaignExportRoutes from '../routes/campaignExportRoutes.js';
import campaignExportSchemas from '../schemas/campaignExportSchemas.js';



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
      // RF23, RF20, RF21, RF22, RF24 - Chat e Dados
      { 
        name: '💬 Chat', 
        description: 'RF23, RF20, RF21, RF22, RF24 - Chat em tempo real, rolagens públicas/privadas, histórico, emotes'
      },
      // RF25 - Medição de Distância
      { 
        name: '📏 Distância', 
        description: 'RF25 - Medir distância entre tokens baseado no grid'
      },
      // RF18, RF19 - Fichas de Personagem
      { 
        name: '📋 Fichas', 
        description: 'RF18, RF19 - Criar fichas com atributos JSON, rolar dados da ficha'
      },
      // RF20 - Rolagem de Dados
      { 
        name: '🎲 Dados', 
        description: 'RF20 - Testar rolagem de dados com comandos /roll'
      },
      // RF38, RF39, RF40 - Notas e Journal
      { 
        name: '📝 Notas', 
        description: 'RF38, RF39, RF40 - Criar notas com Markdown, handouts e busca'
      },
      // RF35 - Macros de Rolagem
      { 
        name: '🎲 Macros', 
        description: 'RF35 - Salvar macros de rolagem na ficha'
      },
      // RF28, RF41 - Música de Fundo
      { 
        name: '🎵 Música', 
        description: 'RF28, RF41 - Upload e controle de música de fundo, playlists'
      },
      // RF42 - Efeitos Sonoros
      { 
        name: '🔊 Efeitos', 
        description: 'RF42 - Efeitos sonoros rápidos'
      },
      // RF26, RF27 - Import/Export
      { 
        name: '📦 Import/Export', 
        description: 'RF26, RF27 - Exportar e importar campanhas em JSON'
      }
    ],
    paths: {
      ...authRegister,
      ...authLogin,
      ...authUpdateProfile,
      ...campaignRoutes,
      ...sceneRoutes,
      ...tokenRoutes,
      ...chatRoutes,
      ...distanceRoutes,
      ...characterSheetRoutes,
      ...diceRoutes,
      ...realtimeRoutes,
      ...noteRoutes,
      ...diceMacroRoutes,
      ...musicRoutes,
      ...campaignExportRoutes
    },
    components: {
      schemas: {
        ...authSchemas,
        ...campaignSchemas,
        ...sceneSchemas,
        ...tokenSchemas,
        ...chatSchemas,
        ...distanceSchemas,
        ...characterSheetSchemas,
        ...diceSchemas,
        ...noteSchemas,
        ...diceMacroSchemas,
        ...musicSchemas,
        ...campaignExportSchemas,
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operação realizada com sucesso' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Erro na operação' },
            errors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Detalhes do erro']
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        BadRequest: {
          description: 'Dados inválidos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        Unauthorized: {
          description: 'Token inválido ou ausente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        Forbidden: {
          description: 'Sem permissão para esta ação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        InternalError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  apis: [] // Não precisamos de arquivos adicionais pois já temos tudo definido
});

export default getSwaggerOptions;