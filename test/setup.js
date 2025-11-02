import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Setup global para testes
beforeAll(async () => {
  // Conectar ao banco de teste
  await prisma.$connect();
});

afterAll(async () => {
  // Limpar dados de teste e desconectar
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: Date.now().toString().slice(-6)
      }
    }
  });
  
  await prisma.$disconnect();
});

// Helper para criar usuário de teste
export const createTestUser = async (suffix = '') => {
  const userData = {
    name: `Test User ${suffix}`,
    email: `test${Date.now()}${suffix}@gmail.com`,
    password: 'MinhaSenh@123'
  };

  return userData;
};

// Helper para fazer login e obter token
export const loginTestUser = async (app, userData) => {
  const request = (await import('supertest')).default;
  
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: userData.email,
      password: userData.password
    });

  return response.body.token;
};

// Helper para criar campanha de teste
export const createTestCampaign = async (app, authToken) => {
  const request = (await import('supertest')).default;
  
  const campaignData = {
    name: `Test Campaign ${Date.now()}`,
    system: 'D&D 5e',
    description: 'Campanha de teste'
  };

  const response = await request(app)
    .post('/api/campaigns')
    .set('Authorization', `Bearer ${authToken}`)
    .send(campaignData);

  return response.body.data;
};