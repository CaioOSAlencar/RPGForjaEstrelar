const authUpdateProfile = {
  '/auth/profile': {
    put: {
      tags: ['🔐 Autenticação'],
      summary: 'Editar perfil do usuário',
      description: 'Permite ao usuário editar seu nome e/ou senha (RF05)',
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateProfileRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Perfil atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateProfileResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos ou nenhum campo informado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Token de acesso requerido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        403: {
          description: 'Token inválido ou expirado',
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

export default authUpdateProfile;