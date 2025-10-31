export const validateImportCampaign = (data) => {
  const errors = [];
  const { name, system, description } = data;

  if (!name || name.trim() === '') {
    errors.push('Nome da campanha é obrigatório');
  } else if (name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }

  if (!system || system.trim() === '') {
    errors.push('Sistema é obrigatório');
  } else if (system.length > 50) {
    errors.push('Sistema deve ter no máximo 50 caracteres');
  }

  if (description && description.length > 1000) {
    errors.push('Descrição deve ter no máximo 1000 caracteres');
  }

  // Validar estrutura básica se fornecida
  if (data.scenes && !Array.isArray(data.scenes)) {
    errors.push('Scenes deve ser um array');
  }

  if (data.notes && !Array.isArray(data.notes)) {
    errors.push('Notes deve ser um array');
  }

  if (data.backgroundMusic && !Array.isArray(data.backgroundMusic)) {
    errors.push('BackgroundMusic deve ser um array');
  }

  if (data.soundEffects && !Array.isArray(data.soundEffects)) {
    errors.push('SoundEffects deve ser um array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};