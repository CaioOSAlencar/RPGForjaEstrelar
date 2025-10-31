export default {
  '/api/realtime/tokens/{tokenId}/move': {
    put: {
      summary: 'Mover token em tempo real (RF14)',
      tags: ['🎭 Tokens'],
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
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/realtime/tokens/{tokenId}/rotate': {
    put: {
      summary: 'Rotacionar token (RF15)',
      tags: ['🎭 Tokens'],
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
              required: ['rotation'],
              properties: {
                rotation: {
                  type: 'number',
                  minimum: 0,
                  maximum: 360,
                  description: 'Ângulo de rotação em graus'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Token rotacionado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' }
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
  '/api/realtime/tokens/{tokenId}/resize': {
    put: {
      summary: 'Redimensionar token (RF15)',
      tags: ['🎭 Tokens'],
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
              required: ['scale'],
              properties: {
                scale: {
                  type: 'number',
                  minimum: 0.1,
                  maximum: 5.0,
                  description: 'Escala do token (1.0 = tamanho original)'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Token redimensionado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' }
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