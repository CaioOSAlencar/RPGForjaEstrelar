const authSchemas = {
  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome completo do usuário',
        example: 'João Silva'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email único do usuário',
        example: 'joao@email.com'
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'Senha do usuário (mínimo 6 caracteres)',
        example: '123456'
      }
    }
  },
  
  RegisterResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Usuário cadastrado com sucesso!'
      },
      user: {
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
            example: 'joao@email.com'
          },
          role: {
            type: 'string',
            example: 'player'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      }
    }
  },
  
  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      message: {
        type: 'string',
        example: 'Dados inválidos'
      },
      errors: {
        type: 'array',
        items: {
          type: 'string'
        },
        example: ['Nome é obrigatório', 'Email deve ter formato válido']
      }
    }
  }
};

export default authSchemas;