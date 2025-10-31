export default {
  MusicResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único da música'
      },
      name: {
        type: 'string',
        description: 'Nome da música'
      },
      url: {
        type: 'string',
        description: 'URL do arquivo de áudio'
      },
      volume: {
        type: 'number',
        description: 'Volume da música (0-1)'
      },
      isLooping: {
        type: 'boolean',
        description: 'Se a música deve repetir'
      },
      isPlaying: {
        type: 'boolean',
        description: 'Se a música está tocando'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação'
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
  SoundEffectResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único do efeito sonoro'
      },
      name: {
        type: 'string',
        description: 'Nome do efeito sonoro'
      },
      url: {
        type: 'string',
        description: 'URL do arquivo de áudio'
      },
      volume: {
        type: 'number',
        description: 'Volume do efeito (0-1)'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação'
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