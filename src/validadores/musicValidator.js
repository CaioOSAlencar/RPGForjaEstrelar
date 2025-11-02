export const validateCreateMusic = (data) => {
  const errors = [];
  const { name, url, campaignId, volume, isLooping } = data;

  if (!name || name.trim() === '') {
    errors.push('Nome é obrigatório');
  } else if (name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }

  if (!url || url.trim() === '') {
    errors.push('URL é obrigatória');
  } else if (url.length > 500) {
    errors.push('URL deve ter no máximo 500 caracteres');
  }

  if (!campaignId) {
    errors.push('ID da campanha é obrigatório');
  } else if (isNaN(parseInt(campaignId)) || parseInt(campaignId) < 1) {
    errors.push('ID da campanha deve ser um número válido');
  }

  if (volume !== undefined && (isNaN(parseFloat(volume)) || volume < 0 || volume > 1)) {
    errors.push('Volume deve ser um número entre 0 e 1');
  }

  if (isLooping !== undefined && typeof isLooping !== 'boolean') {
    errors.push('isLooping deve ser verdadeiro ou falso');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateMusic = (data) => {
  const errors = [];
  const { name, url, volume, isLooping, isPlaying } = data;

  if (name !== undefined) {
    if (name.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres');
    }
  }

  if (url !== undefined) {
    if (url.length > 500) {
      errors.push('URL deve ter no máximo 500 caracteres');
    }
  }

  if (volume !== undefined && (isNaN(parseFloat(volume)) || volume < 0 || volume > 1)) {
    errors.push('Volume deve ser um número entre 0 e 1');
  }

  if (isLooping !== undefined && typeof isLooping !== 'boolean') {
    errors.push('isLooping deve ser verdadeiro ou falso');
  }

  if (isPlaying !== undefined && typeof isPlaying !== 'boolean') {
    errors.push('isPlaying deve ser verdadeiro ou falso');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCreateSoundEffect = (data) => {
  const errors = [];
  const { name, url, campaignId, volume } = data;

  if (!name || name.trim() === '') {
    errors.push('Nome é obrigatório');
  } else if (name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }

  if (!url || url.trim() === '') {
    errors.push('URL é obrigatória');
  } else if (url.length > 500) {
    errors.push('URL deve ter no máximo 500 caracteres');
  }

  if (!campaignId) {
    errors.push('ID da campanha é obrigatório');
  } else if (isNaN(parseInt(campaignId)) || parseInt(campaignId) < 1) {
    errors.push('ID da campanha deve ser um número válido');
  }

  if (volume !== undefined && (isNaN(parseFloat(volume)) || volume < 0 || volume > 1)) {
    errors.push('Volume deve ser um número entre 0 e 1');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};