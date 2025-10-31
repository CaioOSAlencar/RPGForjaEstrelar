import { isDiceCommand, calculateDiceRoll } from '../utils/diceRoller.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';

// RF20 - Endpoint para testar rolagem de dados
export const rollDice = asyncHandler(async (req, res) => {
  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return sendError(res, 400, 'Comando de dados é obrigatório');
  }

  if (!isDiceCommand(command)) {
    return sendError(res, 400, 'Formato inválido. Use: /roll XdY+Z (ex: /roll 2d6+3)');
  }

  try {
    const result = calculateDiceRoll(command);
    return sendResponse(res, 200, { 
      data: result, 
      message: 'Dados rolados com sucesso!' 
    });
  } catch (error) {
    return sendError(res, 400, error.message);
  }
});