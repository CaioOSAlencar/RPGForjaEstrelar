export default {
  '/api/character-sheets': {
    post: {
      summary: 'Criar ficha de personagem (RF18)',
      tags: ['📋 Fichas'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'campaignId', 'data'],
              properties: {
                name: {
                  type: 'string',
                  maxLength: 100,
                  description: 'Nome do personagem'
                },
                class: {
                  type: 'string',
                  maxLength: 50,
                  description: 'Classe do personagem'
                },
                level: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 20,
                  default: 1,
                  description: 'Nível do personagem'
                },
                campaignId: {
                  type: 'string',
                  description: 'ID da campanha'
                },
                data: {
                  type: 'string',
                  description: 'Dados da ficha em JSON (attributes, skills, inventory)'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Ficha criada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CharacterSheetResponse' }
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
  '/api/character-sheets/campaign/{campaignId}': {
    get: {
      summary: 'Listar fichas da campanha',
      tags: ['📋 Fichas'],
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
          description: 'Lista de fichas da campanha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CharacterSheetResponse' }
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
  '/api/character-sheets/{sheetId}': {
    get: {
      summary: 'Buscar ficha por ID',
      tags: ['📋 Fichas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sheetId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da ficha'
      }],
      responses: {
        200: {
          description: 'Ficha encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CharacterSheetResponse' }
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
      summary: 'Atualizar ficha',
      tags: ['📋 Fichas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sheetId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da ficha'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', maxLength: 100 },
                class: { type: 'string', maxLength: 50 },
                level: { type: 'integer', minimum: 1, maximum: 20 },
                data: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Ficha atualizada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CharacterSheetResponse' }
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
      summary: 'Deletar ficha',
      tags: ['📋 Fichas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sheetId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da ficha'
      }],
      responses: {
        200: {
          description: 'Ficha deletada com sucesso',
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
  '/api/character-sheets/{sheetId}/roll': {
    post: {
      summary: 'Rolar dados da ficha (RF19)',
      tags: ['📋 Fichas'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sheetId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da ficha'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['expression'],
              properties: {
                expression: {
                  type: 'string',
                  examples: ['1d20+STR', '2d6+DEX', '1d8+CON'],
                  description: 'Expressão de dados com atributo'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Dados rolados com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SheetDiceRollResponse' }
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
  }
};