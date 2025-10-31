export default {
  DiceMacroResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único da macro'
      },
      name: {
        type: 'string',
        description: 'Nome da macro'
      },
      expression: {
        type: 'string',
        description: 'Expressão de dados'
      },
      description: {
        type: 'string',
        nullable: true,
        description: 'Descrição da macro'
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
      characterSheet: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          userId: { type: 'integer' }
        }
      }
    }
  }
};