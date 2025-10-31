export default {
  SceneResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único da cena'
      },
      name: {
        type: 'string',
        description: 'Nome da cena'
      },
      backgroundUrl: {
        type: 'string',
        nullable: true,
        description: 'URL da imagem de fundo'
      },
      gridSize: {
        type: 'integer',
        description: 'Tamanho do grid em pixels'
      },
      gridColor: {
        type: 'string',
        description: 'Cor do grid em hexadecimal'
      },
      snapToGrid: {
        type: 'boolean',
        description: 'Se o snap to grid está ativo'
      },
      campaignId: {
        type: 'integer',
        description: 'ID da campanha'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação'
      },
      campaign: {
        type: 'object',
        properties: {
          id: {
            type: 'integer'
          },
          name: {
            type: 'string'
          },
          masterId: {
            type: 'integer'
          }
        }
      }
    }
  }
};