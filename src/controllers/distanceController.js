import { findTokenById } from '../repositories/tokenRepository.js';
import { findSceneById } from '../repositories/sceneRepository.js';
import { sendResponse, sendError } from '../utils/messages.js';
import { calculateGridDistance, convertGridToGameUnits } from '../utils/distanceCalculator.js';
import asyncHandler from 'express-async-handler';

// RF25 - Medir distância entre dois tokens
export const measureDistance = asyncHandler(async (req, res) => {
  const { token1Id, token2Id, unitType } = req.body;

  if (!token1Id || !token2Id) {
    return sendError(res, 400, 'IDs dos tokens são obrigatórios');
  }

  if (token1Id === token2Id) {
    return sendError(res, 400, 'Não é possível medir distância do token para ele mesmo');
  }

  const token1 = await findTokenById(parseInt(token1Id));
  const token2 = await findTokenById(parseInt(token2Id));

  if (!token1 || !token2) {
    return sendError(res, 404, 'Um ou ambos os tokens não foram encontrados');
  }

  if (token1.sceneId !== token2.sceneId) {
    return sendError(res, 400, 'Os tokens devem estar na mesma cena');
  }

  const scene = await findSceneById(token1.sceneId);
  if (!scene) {
    return sendError(res, 404, 'Cena não encontrada');
  }

  const gridDistance = calculateGridDistance(token1, token2, scene.gridSize);
  const gameUnits = convertGridToGameUnits(gridDistance, scene.gridSize, unitType);

  const result = {
    token1: { id: token1.id, name: token1.name, position: { x: token1.x, y: token1.y } },
    token2: { id: token2.id, name: token2.name, position: { x: token2.x, y: token2.y } },
    scene: { id: scene.id, name: scene.name, gridSize: scene.gridSize },
    distance: {
      grid: gridDistance,
      gameUnits: gameUnits,
      measurement: `${gameUnits.euclidean} ${gameUnits.unit}`
    }
  };

  return sendResponse(res, 200, { data: result, message: 'Distância calculada com sucesso' });
});