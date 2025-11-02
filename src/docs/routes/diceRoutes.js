export default {
  '/api/dice/roll': {
    post: {
      summary: 'Testar rolagem de dados (RF20)',
      tags: ['🎲 Dados'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['command'],
              properties: {
                command: {
                  type: 'string',
                  examples: ['/roll 1d20', '/roll 2d6+3', '/roll 1d8-1'],
                  description: 'Comando de rolagem de dados'
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
              schema: { $ref: '#/components/schemas/DiceRollResponse' }
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