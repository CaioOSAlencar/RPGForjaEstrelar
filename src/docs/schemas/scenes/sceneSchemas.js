const sceneSchemas = {
  CreateSceneRequest: {
    type: 'object',
    required: ['name', 'campaignId'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        description: 'Nome da cena',
        example: 'Taverna do Dragão Dourado'
      },
      campaignId: {
        type: 'integer',
        description: 'ID da campanha',
        example: 1
      },
      backgroundImage: {
        type: 'string',
        format: 'binary',
        description: 'Imagem de fundo da cena (PNG, JPEG, WebP - máx 10MB)'
      }
    }
  },

  UpdateSceneRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        description: 'Nome da cena (opcional)',
        example: 'Taverna do Dragão Dourado - Andar Superior'
      },
      gridSize: {
        type: 'integer',
        minimum: 10,
        maximum: 200,
        description: 'Tamanho do grid em pixels (opcional)',
        example: 50
      },
      gridColor: {
        type: 'string',
        pattern: '^#[0-9A-F]{6}$',
        description: 'Cor do grid em hexadecimal (opcional)',
        example: '#000000'
      },
      snapToGrid: {
        type: 'boolean',
        description: 'Se tokens devem se alinhar ao grid (opcional)',
        example: true
      }
    }
  },

  SceneResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      name: {
        type: 'string',
        example: 'Taverna do Dragão Dourado'
      },
      backgroundUrl: {
        type: 'string',
        example: '/uploads/scenes/1640995200000-123456789.jpg'
      },
      gridSize: {
        type: 'integer',
        example: 50
      },
      gridColor: {
        type: 'string',
        example: '#000000'
      },
      snapToGrid: {
        type: 'boolean',
        example: true
      },
      campaignId: {
        type: 'integer',
        example: 1
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      campaign: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          name: {
            type: 'string',
            example: 'A Maldição de Strahd'
          },
          masterId: {
            type: 'integer',
            example: 1
          }
        }
      }
    }
  },

  CreateSceneResponse: {
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
        example: 'Cena criada com sucesso!'
      },
      data: {
        $ref: '#/components/schemas/SceneResponse'
      }
    }
  },

  ListScenesResponse: {
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
        example: 'Cenas listadas com sucesso'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SceneResponse'
        }
      }
    }
  },

  UpdateSceneResponse: {
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
        example: 'Cena atualizada com sucesso!'
      },
      data: {
        $ref: '#/components/schemas/SceneResponse'
      }
    }
  },

  DeleteSceneResponse: {
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
        example: 'Cena deletada com sucesso'
      },
      data: {
        type: 'null',
        example: null
      }
    }
  }
};

export default sceneSchemas;