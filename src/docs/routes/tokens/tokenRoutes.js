export default {
  '/api/tokens': {
    post: {
      summary: 'Criar novo token',
      tags: ['🎭 Tokens'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: { $ref: '#/components/schemas/CreateTokenRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Token criado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/tokens/scene/{sceneId}': {
    get: {
      summary: 'Listar tokens de uma cena',
      tags: ['🎭 Tokens'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'sceneId',
        required: true,
        schema: { type: 'string' },
        description: 'ID da cena'
      }],
      responses: {
        200: {
          description: 'Lista de tokens da cena',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenListResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/tokens/{tokenId}': {
    get: {
      summary: 'Obter detalhes de um token',
      tags: ['🎭 Tokens'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'tokenId',
        required: true,
        schema: { type: 'string' },
        description: 'ID do token'
      }],
      responses: {
        200: {
          description: 'Detalhes do token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    put: {
      summary: 'Atualizar propriedades do token',
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
            schema: { $ref: '#/components/schemas/UpdateTokenRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Token atualizado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    delete: {
      summary: 'Deletar token',
      tags: ['🎭 Tokens'],
      security: [{ bearerAuth: [] }],
      parameters: [{
        in: 'path',
        name: 'tokenId',
        required: true,
        schema: { type: 'string' },
        description: 'ID do token'
      }],
      responses: {
        200: {
          description: 'Token deletado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/tokens/user': {
    get: {
      summary: 'Listar tokens do usuário',
      tags: ['🎭 Tokens'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de tokens do usuário',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenListResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
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
                  description: 'Rotação em graus (0-360)'
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
        403: {
          description: 'Sem permissão para rotacionar token',
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
              required: ['size'],
              properties: {
                size: {
                  type: 'number',
                  minimum: 0.1,
                  maximum: 5.0,
                  description: 'Tamanho do token (0.1 a 5.0)'
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
        403: {
          description: 'Sem permissão para redimensionar token',
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