export default {
  DiceRollResponse: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Expressão de dados original'
      },
      rolls: {
        type: 'array',
        items: { type: 'integer' },
        description: 'Resultados individuais dos dados'
      },
      sum: {
        type: 'integer',
        description: 'Soma dos dados rolados'
      },
      modifier: {
        type: 'integer',
        description: 'Modificador aplicado'
      },
      total: {
        type: 'integer',
        description: 'Resultado final (soma + modificador)'
      },
      breakdown: {
        type: 'string',
        description: 'Detalhamento da rolagem'
      }
    }
  }
};