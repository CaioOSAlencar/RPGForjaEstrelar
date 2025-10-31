export const validateCreateScene = (data) => {
  const errors = [];
  const { name, campaignId } = data;

  // Validação do nome
  if (!name || name.trim() === '') {
    errors.push('Nome da cena é obrigatório');
  } else if (name.trim().length < 2) {
    errors.push('Nome da cena deve ter pelo menos 2 caracteres');
  } else if (name.trim().length > 100) {
    errors.push('Nome da cena deve ter no máximo 100 caracteres');
  }

  // Validação do campaignId
  if (!campaignId) {
    errors.push('ID da campanha é obrigatório');
  } else if (isNaN(parseInt(campaignId))) {
    errors.push('ID da campanha deve ser um número válido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateScene = (data) => {
  const errors = [];
  const { name, gridSize, gridColor, snapToGrid } = data;

  // Validação do nome (opcional)
  if (name !== undefined) {
    if (!name || name.trim() === '') {
      errors.push('Nome da cena não pode ser vazio');
    } else if (name.trim().length < 2) {
      errors.push('Nome da cena deve ter pelo menos 2 caracteres');
    } else if (name.trim().length > 100) {
      errors.push('Nome da cena deve ter no máximo 100 caracteres');
    }
  }

  // Validação do gridSize (opcional)
  if (gridSize !== undefined) {
    const size = parseInt(gridSize);
    if (isNaN(size) || size < 10 || size > 200) {
      errors.push('Tamanho do grid deve ser entre 10 e 200 pixels');
    }
  }

  // Validação da cor do grid (opcional)
  if (gridColor !== undefined) {
    if (!/^#[0-9A-F]{6}$/i.test(gridColor)) {
      errors.push('Cor do grid deve estar no formato hexadecimal (#RRGGBB)');
    }
  }

  // Validação do snapToGrid (opcional)
  if (snapToGrid !== undefined) {
    if (typeof snapToGrid !== 'boolean') {
      errors.push('Snap to grid deve ser verdadeiro ou falso');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};