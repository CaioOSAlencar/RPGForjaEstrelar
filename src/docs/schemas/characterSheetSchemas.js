export default {
  CharacterSheetResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único da ficha'
      },
      name: {
        type: 'string',
        description: 'Nome do personagem'
      },
      class: {
        type: 'string',
        nullable: true,
        description: 'Classe do personagem'
      },
      level: {
        type: 'integer',
        description: 'Nível do personagem'
      },
      data: {
        type: 'string',
        description: 'Dados da ficha em JSON'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de atualização'
      },
      user: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' }
        }
      },
      campaign: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' }
        }
      }
    }
  },
  SheetDiceRollResponse: {
    type: 'object',
    properties: {
      sheet: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          class: { type: 'string' },
          level: { type: 'integer' }
        }
      },
      roll: {
        type: 'object',
        properties: {
          expression: { type: 'string' },
          rolls: {
            type: 'array',
            items: { type: 'integer' }
          },
          sum: { type: 'integer' },
          modifier: { type: 'integer' },
          total: { type: 'integer' },
          breakdown: { type: 'string' },
          attributeName: { type: 'string' },
          attributeValue: { type: 'integer' },
          isSheetRoll: { type: 'boolean' }
        }
      }
    }
  }
};