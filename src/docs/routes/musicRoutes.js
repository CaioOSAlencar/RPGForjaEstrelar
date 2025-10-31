export default {
  '/api/music/background': {
    post: {
      summary: 'Adicionar música de fundo (RF28)',
      tags: ['🎵 Música'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'url', 'campaignId'],
              properties: {
                name: {
                  type: 'string',
                  maxLength: 100,
                  description: 'Nome da música'
                },
                url: {
                  type: 'string',
                  maxLength: 500,
                  description: 'URL do arquivo de áudio'
                },
                campaignId: {
                  type: 'string',
                  description: 'ID da campanha'
                },
                volume: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1,
                  default: 0.7,
                  description: 'Volume da música'
                },
                isLooping: {
                  type: 'boolean',
                  default: true,
                  description: 'Se a música deve repetir'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Música adicionada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MusicResponse' }
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
  '/api/music/background/campaign/{campaignId}': {
    get: {
      summary: 'Listar músicas da campanha (RF41)',
      tags: ['🎵 Música'],
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
          description: 'Lista de músicas da campanha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/MusicResponse' }
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
  '/api/music/background/{musicId}': {
    put: {
      summary: 'Atualizar música',
      tags: ['🎵 Música'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'musicId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da música'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', maxLength: 100 },
                url: { type: 'string', maxLength: 500 },
                volume: { type: 'number', minimum: 0, maximum: 1 },
                isLooping: { type: 'boolean' },
                isPlaying: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Música atualizada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MusicResponse' }
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
      summary: 'Deletar música',
      tags: ['🎵 Música'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'musicId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da música'
      }],
      responses: {
        200: {
          description: 'Música deletada com sucesso',
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
  },
  '/api/music/effects': {
    post: {
      summary: 'Adicionar efeito sonoro (RF42)',
      tags: ['🔊 Efeitos'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'url', 'campaignId'],
              properties: {
                name: {
                  type: 'string',
                  maxLength: 100,
                  description: 'Nome do efeito sonoro'
                },
                url: {
                  type: 'string',
                  maxLength: 500,
                  description: 'URL do arquivo de áudio'
                },
                campaignId: {
                  type: 'string',
                  description: 'ID da campanha'
                },
                volume: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1,
                  default: 1.0,
                  description: 'Volume do efeito'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Efeito sonoro adicionado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SoundEffectResponse' }
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
  '/api/music/effects/campaign/{campaignId}': {
    get: {
      summary: 'Listar efeitos sonoros da campanha',
      tags: ['🔊 Efeitos'],
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
          description: 'Lista de efeitos sonoros da campanha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SoundEffectResponse' }
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
  '/api/music/effects/{effectId}': {
    delete: {
      summary: 'Deletar efeito sonoro',
      tags: ['🔊 Efeitos'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'effectId',
        required: true,
        schema: { type: 'string' },
        description: 'ID do efeito sonoro'
      }],
      responses: {
        200: {
          description: 'Efeito sonoro deletado com sucesso',
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