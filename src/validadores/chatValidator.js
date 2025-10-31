export const validateSendMessage = (data) => {
  const errors = [];
  const { content, campaignId, sceneId } = data;

  // Validação do conteúdo
  if (!content || content.trim() === '') {
    errors.push('Conteúdo da mensagem é obrigatório');
  } else if (content.trim().length > 1000) {
    errors.push('Mensagem deve ter no máximo 1000 caracteres');
  }

  // Validação do campaignId
  if (!campaignId) {
    errors.push('ID da campanha é obrigatório');
  } else if (isNaN(parseInt(campaignId))) {
    errors.push('ID da campanha deve ser um número válido');
  }

  // Validação do sceneId (opcional)
  if (sceneId && isNaN(parseInt(sceneId))) {
    errors.push('ID da cena deve ser um número válido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateGetMessages = (data) => {
  const errors = [];
  const { campaignId, limit, offset } = data;

  // Validação do campaignId
  if (!campaignId) {
    errors.push('ID da campanha é obrigatório');
  } else if (isNaN(parseInt(campaignId))) {
    errors.push('ID da campanha deve ser um número válido');
  }

  // Validação do limit (opcional)
  if (limit && (isNaN(parseInt(limit)) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.push('Limite deve ser entre 1 e 100');
  }

  // Validação do offset (opcional)
  if (offset && (isNaN(parseInt(offset)) || parseInt(offset) < 0)) {
    errors.push('Offset deve ser maior ou igual a 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};