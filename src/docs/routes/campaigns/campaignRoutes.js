const campaignRoutes = {
  '/campaigns/{campaignId}/invite': {
    post: {
      tags: ['🏰 Campanhas'],
      summary: 'Convidar jogador por email',
      description: 'Permite ao mestre convidar um jogador por email (RF08)',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'campaignId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da campanha'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/InviteByEmailRequest'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Convite criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InviteResponse'
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
        403: {
          description: 'Apenas o mestre pode convidar jogadores',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Campanha não encontrada',
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
  },
  '/campaigns/{campaignId}/share': {
    get: {
      tags: ['🏰 Campanhas'],
      summary: 'Gerar link compartilhável',
      description: 'Gera link compartilhável da campanha (RF08)',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'campaignId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da campanha'
        }
      ],
      responses: {
        200: {
          description: 'Link gerado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ShareLinkResponse'
              }
            }
          }
        },
        403: {
          description: 'Apenas o mestre pode gerar links',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Campanha não encontrada',
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
  },
  '/campaigns/invite/{token}/accept': {
    post: {
      tags: ['🏰 Campanhas'],
      summary: 'Aceitar convite por token',
      description: 'Aceita convite de campanha usando token (RF09)',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'token',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Token do convite'
        }
      ],
      responses: {
        200: {
          description: 'Convite aceito com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AcceptInviteResponse'
              }
            }
          }
        },
        400: {
          description: 'Convite expirado ou já utilizado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Convite não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        409: {
          description: 'Usuário já participa da campanha',
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
  },
  '/campaigns/join': {
    post: {
      tags: ['🏰 Campanhas'],
      summary: 'Entrar na campanha por código',
      description: 'Entra na campanha usando código de sala (RF09)',
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
              $ref: '#/components/schemas/JoinByCodeRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Entrou na campanha com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/JoinCampaignResponse'
              }
            }
          }
        },
        400: {
          description: 'Código inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Campanha não encontrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        409: {
          description: 'Usuário já participa da campanha',
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
  },
  '/campaigns/{campaignId}/players': {
    get: {
      tags: ['🏰 Campanhas'],
      summary: 'Listar jogadores da campanha',
      description: 'Lista todos os jogadores de uma campanha (apenas mestre)',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'campaignId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da campanha'
        }
      ],
      responses: {
        200: {
          description: 'Jogadores listados com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ListPlayersResponse'
              }
            }
          }
        },
        403: {
          description: 'Apenas o mestre pode listar jogadores',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Campanha não encontrada',
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
  },
  '/campaigns/{campaignId}/players/{playerId}': {
    delete: {
      tags: ['🏰 Campanhas'],
      summary: 'Remover jogador da campanha',
      description: 'Remove um jogador da campanha (RF43 - apenas mestre)',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'campaignId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da campanha'
        },
        {
          name: 'playerId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID do jogador a ser removido'
        }
      ],
      responses: {
        200: {
          description: 'Jogador removido com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RemovePlayerResponse'
              }
            }
          }
        },
        400: {
          description: 'Mestre não pode se remover',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        403: {
          description: 'Apenas o mestre pode remover jogadores',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Campanha ou jogador não encontrado',
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
  },
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