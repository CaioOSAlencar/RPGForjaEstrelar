const campaignSchemas = {
  CreateCampaignRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: 'Nome da campanha',
        example: 'A Maldição de Strahd'
      },
      system: {
        type: 'string',
        maxLength: 50,
        description: 'Sistema de RPG (opcional)',
        example: 'D&D 5e'
      },
      description: {
        type: 'string',
        maxLength: 500,
        description: 'Descrição da campanha (opcional)',
        example: 'Uma aventura sombria em Barovia, onde os heróis enfrentam o vampiro Strahd von Zarovich.'
      }
    }
  },

  CampaignResponse: {
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
      system: {
        type: 'string',
        example: 'D&D 5e'
      },
      description: {
        type: 'string',
        example: 'Uma aventura sombria em Barovia...'
      },
      masterId: {
        type: 'integer',
        example: 1
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      master: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          name: {
            type: 'string',
            example: 'João Silva'
          },
          email: {
            type: 'string',
            example: 'joao@gmail.com'
          }
        }
      }
    }
  },

  CreateCampaignResponse: {
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
        example: 'Campanha criada com sucesso!'
      },
      data: {
        $ref: '#/components/schemas/CampaignResponse'
      }
    }
  },

  ListCampaignsResponse: {
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
        example: 'Campanhas listadas com sucesso'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/CampaignResponse'
        }
      }
    }
  }
};

export default campaignSchemas;