const authSchemas = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário',
        example: 'joao@gmail.com'
      },
      password: {
        type: 'string',
        description: 'Senha do usuário',
        example: 'MinhaSenh@123'
      }
    }
  },
  
  LoginResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Login realizado com sucesso!'
      },
      token: {
        type: 'string',
        description: 'Token JWT válido por 7 dias',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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
            example: 'joao@gmail.com'
          },
          role: {
            type: 'string',
            example: 'player'
          }
        }
      }
    }
  },
  
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
        description: 'Email único do usuário (provedor válido)',
        example: 'joao@gmail.com'
      },
      password: {
        type: 'string',
        minLength: 8,
        description: 'Senha do usuário (mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial)',
        example: 'MinhaSenh@123'
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
            example: 'joao@gmail.com'
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
  
  UpdateProfileRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Novo nome do usuário (opcional)',
        example: 'João Silva Santos'
      },
      password: {
        type: 'string',
        minLength: 8,
        description: 'Nova senha do usuário (opcional)',
        example: 'NovaSenha@456'
      }
    }
  },
  
  UpdateProfileResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Perfil atualizado com sucesso!'
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
            example: 'João Silva Santos'
          },
          email: {
            type: 'string',
            example: 'joao@gmail.com'
          },
          role: {
            type: 'string',
            example: 'player'
          },
          updatedAt: {
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