export default {
  '/api/campaigns/export/{campaignId}': {
    get: {
      summary: 'Exportar campanha em JSON (RF26)',
      tags: ['📦 Import/Export'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'campaignId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da campanha'
      }],
      responses: {
        200: {
          description: 'Arquivo JSON da campanha',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CampaignExportResponse' }
            }
          },
          headers: {
            'Content-Disposition': {
              description: 'Nome do arquivo para download',
              schema: { type: 'string' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/campaigns/import': {
    post: {
      summary: 'Importar campanha de JSON (RF27)',
      tags: ['📦 Import/Export'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'system'],
              properties: {
                name: {
                  type: 'string',
                  maxLength: 100,
                  description: 'Nome da campanha'
                },
                system: {
                  type: 'string',
                  maxLength: 50,
                  description: 'Sistema de RPG'
                },
                description: {
                  type: 'string',
                  maxLength: 1000,
                  description: 'Descrição da campanha'
                },
                scenes: {
                  type: 'array',
                  description: 'Cenas da campanha',
                  items: { type: 'object' }
                },
                notes: {
                  type: 'array',
                  description: 'Notas da campanha',
                  items: { type: 'object' }
                },
                backgroundMusic: {
                  type: 'array',
                  description: 'Músicas de fundo',
                  items: { type: 'object' }
                },
                soundEffects: {
                  type: 'array',
                  description: 'Efeitos sonoros',
                  items: { type: 'object' }
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Campanha importada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      system: { type: 'string' },
                      description: { type: 'string' },
                      masterId: { type: 'integer' },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  }
};