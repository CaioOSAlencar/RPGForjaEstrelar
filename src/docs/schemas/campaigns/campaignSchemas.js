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
  },

  InviteByEmailRequest: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do jogador a ser convidado',
        example: 'jogador@gmail.com'
      }
    }
  },

  InviteResponse: {
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
        example: 'Convite criado com sucesso!'
      },
      data: {
        type: 'object',
        properties: {
          inviteLink: {
            type: 'string',
            example: 'http://localhost:3000/invite/abc123def456...'
          },
          email: {
            type: 'string',
            example: 'jogador@gmail.com'
          },
          expiresAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      }
    }
  },

  ShareLinkResponse: {
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
        example: 'Link compartilhável gerado com sucesso'
      },
      data: {
        type: 'object',
        properties: {
          shareLink: {
            type: 'string',
            example: 'http://localhost:3000/join/ABC123'
          },
          roomCode: {
            type: 'string',
            example: 'ABC123'
          },
          campaignName: {
            type: 'string',
            example: 'A Maldição de Strahd'
          }
        }
      }
    }
  },

  JoinByCodeRequest: {
    type: 'object',
    required: ['roomCode'],
    properties: {
      roomCode: {
        type: 'string',
        minLength: 6,
        maxLength: 6,
        description: 'Código de 6 caracteres da campanha',
        example: 'ABC123'
      }
    }
  },

  AcceptInviteResponse: {
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
        example: 'Convite aceito com sucesso! Você agora faz parte da campanha.'
      },
      data: {
        type: 'object',
        properties: {
          campaign: {
            $ref: '#/components/schemas/CampaignResponse'
          }
        }
      }
    }
  },

  JoinCampaignResponse: {
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
        example: 'Você entrou na campanha com sucesso!'
      },
      data: {
        type: 'object',
        properties: {
          campaign: {
            $ref: '#/components/schemas/CampaignResponse'
          }
        }
      }
    }
  },

  ListPlayersResponse: {
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
        example: 'Jogadores listados com sucesso'
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer',
              example: 2
            },
            joinedAt: {
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
                  example: 'Maria Santos'
                },
                email: {
                  type: 'string',
                  example: 'maria@gmail.com'
                }
              }
            }
          }
        }
      }
    }
  },

  RemovePlayerResponse: {
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
        example: 'Jogador removido da campanha com sucesso'
      },
      data: {
        type: 'null',
        example: null
      }
    }
  }
};

export default campaignSchemas;