export default {
  '/api/scenes': {
    post: {
      summary: 'Criar nova cena (RF11)',
      tags: ['🗺️ Cenas'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['name', 'campaignId'],
              properties: {
                name: {
                  type: 'string',
                  description: 'Nome da cena'
                },
                campaignId: {
                  type: 'string',
                  description: 'ID da campanha'
                },
                backgroundImage: {
                  type: 'string',
                  format: 'binary',
                  description: 'Imagem de fundo da cena'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Cena criada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SceneResponse' }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/scenes/campaign/{campaignId}': {
    get: {
      summary: 'Listar cenas da campanha',
      tags: ['🗺️ Cenas'],
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
          description: 'Lista de cenas da campanha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SceneResponse' }
                  }
                }
              }
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
  '/api/scenes/{sceneId}': {
    get: {
      summary: 'Obter detalhes da cena',
      tags: ['🗺️ Cenas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sceneId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da cena'
      }],
      responses: {
        200: {
          description: 'Detalhes da cena',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SceneResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    put: {
      summary: 'Atualizar configurações da cena (RF12)',
      tags: ['🗺️ Cenas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sceneId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da cena'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nome da cena'
                },
                gridSize: {
                  type: 'integer',
                  minimum: 10,
                  maximum: 200,
                  description: 'Tamanho do grid em pixels'
                },
                gridColor: {
                  type: 'string',
                  pattern: '^#[0-9A-F]{6}$',
                  description: 'Cor do grid em hexadecimal'
                },
                snapToGrid: {
                  type: 'boolean',
                  description: 'Ativar snap to grid'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Cena atualizada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SceneResponse' }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    delete: {
      summary: 'Deletar cena (RF45)',
      tags: ['🗺️ Cenas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sceneId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da cena'
      }],
      responses: {
        200: {
          description: 'Cena deletada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  }
};