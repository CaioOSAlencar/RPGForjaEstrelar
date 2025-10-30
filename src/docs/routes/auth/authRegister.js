const authRegister = {
  '/auth/register': {
    post: {
      tags: ['🔐 Autenticação'],
      summary: 'Cadastrar novo usuário',
      description: 'Cria uma nova conta de usuário no sistema (RF01)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Usuário cadastrado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos ou email já cadastrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Erro interno do servidor',
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

export default authRegister;