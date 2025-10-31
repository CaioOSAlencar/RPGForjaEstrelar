import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const campaignExportRepository = {
  // RF26 - Exportar campanha completa
  async exportCampaign(campaignId) {
    return await prisma.campaign.findUnique({
      where: { id: parseInt(campaignId) },
      include: {
        master: { select: { id: true, name: true, email: true } },
        campaignUsers: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        scenes: {
          include: {
            tokens: {
              include: {
                characterSheet: true
              }
            }
          }
        },
        characterSheets: {
          include: {
            user: { select: { id: true, name: true } },
            diceMacros: true
          }
        },
        notes: {
          include: {
            creator: { select: { id: true, name: true } }
          }
        },
        backgroundMusic: true,
        soundEffects: true,
        chatMessages: {
          include: {
            user: { select: { id: true, name: true } }
          },
          orderBy: { timestamp: 'asc' }
        }
      }
    });
  },

  // RF27 - Importar dados da campanha
  async importCampaign(campaignData, userId) {
    return await prisma.$transaction(async (tx) => {
      // Criar campanha
      const campaign = await tx.campaign.create({
        data: {
          name: campaignData.name,
          system: campaignData.system,
          description: campaignData.description,
          masterId: userId
        }
      });

      // Importar cenas
      if (campaignData.scenes?.length > 0) {
        for (const scene of campaignData.scenes) {
          const newScene = await tx.scene.create({
            data: {
              campaignId: campaign.id,
              name: scene.name,
              backgroundUrl: scene.backgroundUrl,
              gridSize: scene.gridSize,
              gridColor: scene.gridColor,
              snapToGrid: scene.snapToGrid
            }
          });

          // Importar tokens da cena
          if (scene.tokens?.length > 0) {
            for (const token of scene.tokens) {
              await tx.token.create({
                data: {
                  sceneId: newScene.id,
                  name: token.name,
                  x: token.x,
                  y: token.y,
                  size: token.size,
                  rotation: token.rotation,
                  imageUrl: token.imageUrl,
                  hp: token.hp,
                  maxHp: token.maxHp,
                  conditions: token.conditions,
                  isVisible: token.isVisible
                }
              });
            }
          }
        }
      }

      // Importar notas
      if (campaignData.notes?.length > 0) {
        for (const note of campaignData.notes) {
          await tx.note.create({
            data: {
              campaignId: campaign.id,
              title: note.title,
              content: note.content,
              isHandout: note.isHandout,
              recipients: note.recipients,
              createdBy: userId
            }
          });
        }
      }

      // Importar música
      if (campaignData.backgroundMusic?.length > 0) {
        for (const music of campaignData.backgroundMusic) {
          await tx.backgroundMusic.create({
            data: {
              campaignId: campaign.id,
              name: music.name,
              url: music.url,
              volume: music.volume,
              isLooping: music.isLooping
            }
          });
        }
      }

      // Importar efeitos sonoros
      if (campaignData.soundEffects?.length > 0) {
        for (const effect of campaignData.soundEffects) {
          await tx.soundEffect.create({
            data: {
              campaignId: campaign.id,
              name: effect.name,
              url: effect.url,
              volume: effect.volume
            }
          });
        }
      }

      return campaign;
    });
  }
};