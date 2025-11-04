import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('🗑️ Iniciando limpeza do banco de dados...');

    // Deletar em ordem para respeitar as foreign keys
    await prisma.chatMessage.deleteMany({});
    console.log('✅ Chat messages removidas');

    await prisma.note.deleteMany({});
    console.log('✅ Notas removidas');

    await prisma.characterSheet.deleteMany({});
    console.log('✅ Fichas de personagem removidas');

    // await prisma.mapToken.deleteMany({});
    // console.log('✅ Tokens do mapa removidos');

    await prisma.token.deleteMany({});
    console.log('✅ Tokens removidos');

    await prisma.scene.deleteMany({});
    console.log('✅ Cenas removidas');

    // await prisma.invite.deleteMany({});
    // console.log('✅ Convites removidos');

    await prisma.campaignUser.deleteMany({});
    console.log('✅ Relacionamentos campanha-usuário removidos');

    await prisma.campaign.deleteMany({});
    console.log('✅ Campanhas removidas');

    await prisma.user.deleteMany({});
    console.log('✅ Usuários removidos');

    console.log('🎉 Banco de dados limpo com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();