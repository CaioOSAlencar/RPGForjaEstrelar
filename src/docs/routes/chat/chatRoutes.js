export default {
  '/api/chat': {
    post: {
      summary: 'Enviar mensagem no chat (RF23)',
      tags: ['💬 Chat'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content', 'campaignId'],
              properties: {
                content: {
                  type: 'string',
                  maxLength: 1000,
                  description: 'Conteúdo da mensagem ou comando de dados',
                  examples: [
                    'Olá pessoal!',
                    '/roll 1d20+5',
                    '/w gm 1d20+3'
                  ]
                },
                campaignId: {
                  type: 'string',
                  description: 'ID da campanha'
                },
                sceneId: {
                  type: 'string',
                  description: 'ID da cena (opcional)'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Mensagem enviada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChatMessageResponse' }
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
  '/api/chat/campaign/{campaignId}': {
    get: {
      summary: 'Listar mensagens da campanha (RF23)',
      tags: ['💬 Chat'],
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
          name: 'limit',
          schema: { type: 'integer', minimum: 1, maximum: 100 },
          description: 'Número máximo de mensagens (padrão: 50)'
        },
        {
          in: 'query',
          name: 'offset',
          schema: { type: 'integer', minimum: 0 },
          description: 'Número de mensagens para pular (padrão: 0)'
        },
        {
          in: 'query',
          name: 'sceneId',
          schema: { type: 'string' },
          description: 'Filtrar por cena específica'
        }
      ],
      responses: {
        200: {
          description: 'Lista de mensagens da campanha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ChatMessageResponse' }
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
  '/api/dice/roll': {
    post: {
      summary: 'Testar rolagem de dados (RF20/RF21)',
      tags: ['💬 Chat'],
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
                  examples: [
                    '/roll 2d6+3',
                    '/w gm 1d20+5'
                  ],
                  description: 'Comando de rolagem de dados (pública ou privada para GM)'
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
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      expression: {
                        type: 'string',
                        description: 'Expressão dos dados'
                      },
                      rolls: {
                        type: 'array',
                        items: { type: 'integer' },
                        description: 'Resultados individuais'
                      },
                      sum: {
                        type: 'integer',
                        description: 'Soma dos dados'
                      },
                      modifier: {
                        type: 'integer',
                        description: 'Modificador aplicado'
                      },
                      total: {
                        type: 'integer',
                        description: 'Resultado final'
                      },
                      breakdown: {
                        type: 'string',
                        description: 'Detalhamento da rolagem'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/chat/campaign/{campaignId}/dice-history': {
    get: {
      summary: 'Listar histórico de rolagens (RF22)',
      tags: ['💬 Chat'],
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
          name: 'limit',
          schema: { type: 'integer', minimum: 1, maximum: 50 },
          description: 'Número máximo de rolagens (padrão: 20)'
        }
      ],
      responses: {
        200: {
          description: 'Histórico de rolagens da campanha',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/DiceRollHistoryItem' }
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
  '/api/chat/{messageId}': {
    delete: {
      summary: 'Deletar mensagem do chat',
      tags: ['💬 Chat'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'messageId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da mensagem'
      }],
      responses: {
        200: {
          description: 'Mensagem deletada com sucesso',
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