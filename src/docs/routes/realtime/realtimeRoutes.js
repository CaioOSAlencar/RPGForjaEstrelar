export default {
  '/api/realtime/tokens/{tokenId}/move': {
    put: {
      summary: 'Mover token em tempo real',
      tags: ['Tokens'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'tokenId',
        required: true,
        schema: { type: 'string' },
        description: 'ID do token'
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['x', 'y'],
              properties: {
                x: {
                  type: 'number',
                  description: 'Posição X no mapa'
                },
                y: {
                  type: 'number', 
                  description: 'Posição Y no mapa'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Token movido com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' }
            }
          }
        },
        403: {
          description: 'Sem permissão para mover token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  }
};