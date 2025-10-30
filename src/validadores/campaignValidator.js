export const validateCreateCampaign = (data) => {
  const errors = [];
  const { name, system, description } = data;

  // Validação do nome
  if (!name || name.trim() === '') {
    errors.push('Nome da campanha é obrigatório');
  } else if (name.trim().length < 3) {
    errors.push('Nome da campanha deve ter pelo menos 3 caracteres');
  } else if (name.trim().length > 100) {
    errors.push('Nome da campanha deve ter no máximo 100 caracteres');
  }

  // Validação do sistema (opcional)
  if (system && system.trim().length > 50) {
    errors.push('Sistema deve ter no máximo 50 caracteres');
  }

  // Validação da descrição (opcional)
  if (description && description.trim().length > 500) {
    errors.push('Descrição deve ter no máximo 500 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};