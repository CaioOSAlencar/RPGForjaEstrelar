export default {
  DistanceMeasurement: {
    type: 'object',
    properties: {
      token1: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          position: {
            type: 'object',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' }
            }
          }
        }
      },
      token2: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          position: {
            type: 'object',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' }
            }
          }
        }
      },
      scene: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          gridSize: { type: 'integer' }
        }
      },
      distance: {
        type: 'object',
        properties: {
          grid: {
            type: 'object',
            properties: {
              euclidean: { type: 'number' },
              manhattan: { type: 'integer' },
              gridCells: {
                type: 'object',
                properties: {
                  horizontal: { type: 'integer' },
                  vertical: { type: 'integer' }
                }
              }
            }
          },
          gameUnits: {
            type: 'object',
            properties: {
              euclidean: { type: 'number' },
              manhattan: { type: 'number' },
              unit: { type: 'string' }
            }
          },
          measurement: { type: 'string' }
        }
      }
    }
  }
};