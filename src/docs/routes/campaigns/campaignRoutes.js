const campaignRoutes = {
  '/campaigns': {
    post: {
      tags: ['🏰 Campanhas'],
      summary: 'Criar nova campanha',
      description: 'Permite ao usuário criar uma nova campanha de RPG (RF07)',
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateCampaignRequest'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Campanha criada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateCampaignResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Token de acesso requerido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        403: {
          description: 'Token inválido ou expirado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    },
    get: {
      tags: ['🏰 Campanhas'],
      summary: 'Listar campanhas do usuário',
      description: 'Lista todas as campanhas onde o usuário é mestre ou jogador (RF10)',
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'Campanhas listadas com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ListCampaignsResponse'
              }
            }
          }
        },
        401: {
          description: 'Token de acesso requerido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        403: {
          description: 'Token inválido ou expirado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  }
};

export default campaignRoutes;