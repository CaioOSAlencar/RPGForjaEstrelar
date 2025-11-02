const tokenSchemas = {
  CreateTokenRequest: {
    type: 'object',
    required: ['name', 'sceneId'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        description: 'Nome do token',
        example: 'Guerreiro Élfico'
      },
      sceneId: {
        type: 'integer',
        description: 'ID da cena onde o token será criado',
        example: 1
      },
      size: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'Tamanho do token em quadrados do grid (opcional)',
        example: 1
      },
      hp: {
        type: 'integer',
        minimum: 0,
        description: 'HP atual do token (opcional)',
        example: 25
      },
      maxHp: {
        type: 'integer',
        minimum: 1,
        description: 'HP máximo do token (opcional)',
        example: 30
      },
      tokenImage: {
        type: 'string',
        format: 'binary',
        description: 'Imagem do token (PNG, JPEG, WebP - máx 5MB)'
      }
    }
  },

  UpdateTokenRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        description: 'Nome do token (opcional)',
        example: 'Guerreiro Élfico Veterano'
      },
      x: {
        type: 'number',
        description: 'Coordenada X no mapa (opcional)',
        example: 150.5
      },
      y: {
        type: 'number',
        description: 'Coordenada Y no mapa (opcional)',
        example: 200.0
      },
      size: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'Tamanho do token (opcional)',
        example: 2
      },
      rotation: {
        type: 'number',
        minimum: 0,
        maximum: 359,
        description: 'Rotação em graus (opcional)',
        example: 45
      },
      hp: {
        type: 'integer',
        minimum: 0,
        description: 'HP atual (opcional)',
        example: 20
      },
      maxHp: {
        type: 'integer',
        minimum: 1,
        description: 'HP máximo (opcional)',
        example: 30
      },
      conditions: {
        type: 'string',
        description: 'Condições do token em JSON (opcional)',
        example: '["envenenado", "invisível"]'
      },
      isVisible: {
        type: 'boolean',
        description: 'Se o token está visível (opcional)',
        example: true
      }
    }
  },

  TokenResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      name: {
        type: 'string',
        example: 'Guerreiro Élfico'
      },
      x: {
        type: 'number',
        example: 150.5
      },
      y: {
        type: 'number',
        example: 200.0
      },
      size: {
        type: 'integer',
        example: 1
      },
      rotation: {
        type: 'number',
        example: 0
      },
      imageUrl: {
        type: 'string',
        example: '/uploads/tokens/1640995200000-123456789.png'
      },
      hp: {
        type: 'integer',
        example: 25
      },
      maxHp: {
        type: 'integer',
        example: 30
      },
      conditions: {
        type: 'string',
        example: null
      },
      isVisible: {
        type: 'boolean',
        example: true
      },
      sceneId: {
        type: 'integer',
        example: 1
      },
      userId: {
        type: 'integer',
        example: 2
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 2
          },
          name: {
            type: 'string',
            example: 'João Silva'
          }
        }
      }
    }
  },

  CreateTokenResponse: {
    type: 'object',
    properties: {
      error: {
        type: 'boolean',
        example: false
      },
      code: {
        type: 'integer',
        example: 201
      },
      message: {
        type: 'string',
        example: 'Token criado com sucesso!'
      },
      data: {
        $ref: '#/components/schemas/TokenResponse'
      }
    }
  },

  ListTokensResponse: {
    type: 'object',
    properties: {
      error: {
        type: 'boolean',
        example: false
      },
      code: {
        type: 'integer',
        example: 200
      },
      message: {
        type: 'string',
        example: 'Tokens listados com sucesso'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/TokenResponse'
        }
      }
    }
  },

  UpdateTokenResponse: {
    type: 'object',
    properties: {
      error: {
        type: 'boolean',
        example: false
      },
      code: {
        type: 'integer',
        example: 200
      },
      message: {
        type: 'string',
        example: 'Token atualizado com sucesso!'
      },
      data: {
        $ref: '#/components/schemas/TokenResponse'
      }
    }
  },

  DeleteTokenResponse: {
    type: 'object',
    properties: {
      error: {
        type: 'boolean',
        example: false
      },
      code: {
        type: 'integer',
        example: 200
      },
      message: {
        type: 'string',
        example: 'Token deletado com sucesso'
      },
      data: {
        type: 'null',
        example: null
      }
    }
  }
};

export default tokenSchemas;