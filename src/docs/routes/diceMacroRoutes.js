export default {
  '/api/dice-macros': {
    post: {
      summary: 'Criar macro de rolagem (RF35)',
      tags: ['🎲 Macros'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'expression', 'characterSheetId'],
              properties: {
                name: {
                  type: 'string',
                  maxLength: 100,
                  description: 'Nome da macro'
                },
                expression: {
                  type: 'string',
                  maxLength: 200,
                  examples: ['1d20+STR', '2d6+DEX', '1d8+CON'],
                  description: 'Expressão de dados'
                },
                description: {
                  type: 'string',
                  maxLength: 500,
                  description: 'Descrição da macro'
                },
                characterSheetId: {
                  type: 'string',
                  description: 'ID da ficha de personagem'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Macro criada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DiceMacroResponse' }
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
  '/api/dice-macros/sheet/{sheetId}': {
    get: {
      summary: 'Listar macros da ficha',
      tags: ['🎲 Macros'],
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
          description: 'Lista de macros da ficha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/DiceMacroResponse' }
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
  '/api/dice-macros/{macroId}': {
    put: {
      summary: 'Atualizar macro',
      tags: ['🎲 Macros'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'macroId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da macro'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', maxLength: 100 },
                expression: { type: 'string', maxLength: 200 },
                description: { type: 'string', maxLength: 500 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Macro atualizada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DiceMacroResponse' }
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
      summary: 'Deletar macro',
      tags: ['🎲 Macros'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'macroId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da macro'
      }],
      responses: {
        200: {
          description: 'Macro deletada com sucesso',
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