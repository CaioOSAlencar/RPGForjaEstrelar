export default {
  '/api/notes': {
    post: {
      summary: 'Criar nota com Markdown (RF38)',
      tags: ['📝 Notas'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'campaignId'],
              properties: {
                title: {
                  type: 'string',
                  maxLength: 200,
                  description: 'Título da nota'
                },
                content: {
                  type: 'string',
                  maxLength: 10000,
                  description: 'Conteúdo em Markdown'
                },
                campaignId: {
                  type: 'string',
                  description: 'ID da campanha'
                },
                isHandout: {
                  type: 'boolean',
                  default: false,
                  description: 'Se é um handout para jogadores'
                },
                recipients: {
                  type: 'string',
                  description: 'IDs dos destinatários (separados por vírgula)'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Nota criada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NoteResponse' }
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
  '/api/notes/campaign/{campaignId}': {
    get: {
      summary: 'Listar notas da campanha (RF39)',
      tags: ['📝 Notas'],
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
          description: 'Lista de notas da campanha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/NoteResponse' }
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
  '/api/notes/campaign/{campaignId}/search': {
    get: {
      summary: 'Buscar notas (RF40)',
      tags: ['📝 Notas'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'campaignId',
          required: true,
          schema: { type: 'string' },
          description: 'ID da campanha'
        },
        {
          in: 'query',
          name: 'q',
          required: true,
          schema: { type: 'string', minLength: 2 },
          description: 'Termo de busca'
        }
      ],
      responses: {
        200: {
          description: 'Resultados da busca',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/NoteResponse' }
                  }
                }
              }
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
  '/api/notes/{noteId}': {
    get: {
      summary: 'Buscar nota por ID',
      tags: ['📝 Notas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'noteId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da nota'
      }],
      responses: {
        200: {
          description: 'Nota encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NoteResponse' }
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
      summary: 'Atualizar nota',
      tags: ['📝 Notas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'noteId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da nota'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string', maxLength: 200 },
                content: { type: 'string', maxLength: 10000 },
                isHandout: { type: 'boolean' },
                recipients: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Nota atualizada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NoteResponse' }
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
      summary: 'Deletar nota',
      tags: ['📝 Notas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'noteId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da nota'
      }],
      responses: {
        200: {
          description: 'Nota deletada com sucesso',
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