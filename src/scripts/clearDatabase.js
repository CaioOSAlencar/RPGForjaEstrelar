import prisma from '../config/database.js';

async function clearDatabase() {
  try {
    console.log('🗑️ Iniciando limpeza do banco de dados...');

    // Deletar em ordem para respeitar foreign keys
    await prisma.token.deleteMany({});
    console.log('✅ Tokens deletados');

    await prisma.chatMessage.deleteMany({});
    console.log('✅ Mensagens de chat deletadas');

    await prisma.note.deleteMany({});
    console.log('✅ Notas deletadas');

    await prisma.characterSheet.deleteMany({});
    console.log('✅ Fichas de personagem deletadas');

    await prisma.scene.deleteMany({});
    console.log('✅ Cenas deletadas');

    await prisma.campaignUser.deleteMany({});
    console.log('✅ Usuários de campanhas deletados');

    await prisma.campaignInvite.deleteMany({});
    console.log('✅ Convites deletados');

    await prisma.campaign.deleteMany({});
    console.log('✅ Campanhas deletadas');

    await prisma.user.deleteMany({});
    console.log('✅ Usuários deletados');

    console.log('🎉 Banco de dados limpo com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();