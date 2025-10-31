export const validateCreateNote = (data) => {
  const errors = [];
  const { title, content, campaignId, isHandout, recipients } = data;

  if (!title || title.trim() === '') {
    errors.push('Título é obrigatório');
  } else if (title.length > 200) {
    errors.push('Título deve ter no máximo 200 caracteres');
  }

  if (content && content.length > 10000) {
    errors.push('Conteúdo deve ter no máximo 10000 caracteres');
  }

  if (!campaignId) {
    errors.push('ID da campanha é obrigatório');
  } else if (isNaN(parseInt(campaignId)) || parseInt(campaignId) < 1) {
    errors.push('ID da campanha deve ser um número válido');
  }

  if (isHandout !== undefined && typeof isHandout !== 'boolean') {
    errors.push('isHandout deve ser verdadeiro ou falso');
  }

  if (recipients !== undefined && typeof recipients !== 'string') {
    errors.push('Recipients deve ser uma string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateNote = (data) => {
  const errors = [];
  const { title, content, isHandout, recipients } = data;

  if (title !== undefined) {
    if (title.length > 200) {
      errors.push('Título deve ter no máximo 200 caracteres');
    }
  }

  if (content !== undefined && content.length > 10000) {
    errors.push('Conteúdo deve ter no máximo 10000 caracteres');
  }

  if (isHandout !== undefined && typeof isHandout !== 'boolean') {
    errors.push('isHandout deve ser verdadeiro ou falso');
  }

  if (recipients !== undefined && typeof recipients !== 'string') {
    errors.push('Recipients deve ser uma string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSearchNotes = (query) => {
  const errors = [];
  const { q } = query;

  if (!q || q.trim() === '') {
    errors.push('Query de busca é obrigatória');
  } else if (q.length < 2) {
    errors.push('Query deve ter pelo menos 2 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};