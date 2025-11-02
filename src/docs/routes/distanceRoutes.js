export default {
  '/api/distance/measure': {
    post: {
      summary: 'Medir distância entre tokens (RF25)',
      tags: ['📏 Distância'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token1Id', 'token2Id'],
              properties: {
                token1Id: {
                  type: 'string',
                  description: 'ID do primeiro token'
                },
                token2Id: {
                  type: 'string', 
                  description: 'ID do segundo token'
                },
                unitType: {
                  type: 'string',
                  enum: ['feet', 'meters', 'squares'],
                  default: 'feet',
                  description: 'Unidade de medida'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Distância calculada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DistanceMeasurement' }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  }
};