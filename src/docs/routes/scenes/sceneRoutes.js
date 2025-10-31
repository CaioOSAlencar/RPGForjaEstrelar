const sceneRoutes = {
  '/scenes': {
    post: {
      tags: ['🗺️ Cenas'],
      summary: 'Criar nova cena',
      description: 'Permite ao mestre criar uma cena com upload de imagem de fundo (RF11)',
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/CreateSceneRequest'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Cena criada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateSceneResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos ou arquivo muito grande',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        403: {
          description: 'Apenas o mestre pode criar cenas',
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
  '/scenes/campaign/{campaignId}': {
    get: {
      tags: ['🗺️ Cenas'],
      summary: 'Listar cenas da campanha',
      description: 'Lista todas as cenas de uma campanha',
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
          description: 'Cenas listadas com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ListScenesResponse'
              }
            }
          }
        },
        403: {
          description: 'Apenas participantes da campanha podem ver as cenas',
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
  '/scenes/{sceneId}': {
    get: {
      tags: ['🗺️ Cenas'],
      summary: 'Obter detalhes da cena',
      description: 'Obtém detalhes completos de uma cena específica',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'sceneId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da cena'
        }
      ],
      responses: {
        200: {
          description: 'Detalhes da cena obtidos com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateSceneResponse'
              }
            }
          }
        },
        403: {
          description: 'Apenas o mestre pode acessar os detalhes da cena',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Cena não encontrada',
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
    put: {
      tags: ['🗺️ Cenas'],
      summary: 'Atualizar configurações da cena',
      description: 'Atualiza nome, grid e outras configurações da cena (RF12)',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'sceneId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da cena'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateSceneRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Cena atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateSceneResponse'
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
          description: 'Apenas o mestre pode editar a cena',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Cena não encontrada',
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
    delete: {
      tags: ['🗺️ Cenas'],
      summary: 'Deletar cena',
      description: 'Remove uma cena da campanha (RF45)',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'sceneId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da cena'
        }
      ],
      responses: {
        200: {
          description: 'Cena deletada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DeleteSceneResponse'
              }
            }
          }
        },
        403: {
          description: 'Apenas o mestre pode deletar a cena',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Cena não encontrada',
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

export default sceneRoutes;