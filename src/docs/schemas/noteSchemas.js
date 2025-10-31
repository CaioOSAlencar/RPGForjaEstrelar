export default {
  NoteResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único da nota'
      },
      title: {
        type: 'string',
        description: 'Título da nota'
      },
      content: {
        type: 'string',
        nullable: true,
        description: 'Conteúdo em Markdown'
      },
      isHandout: {
        type: 'boolean',
        description: 'Se é um handout para jogadores'
      },
      recipients: {
        type: 'string',
        nullable: true,
        description: 'IDs dos destinatários'
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
      creator: {
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
  }
};