export const validateCreateDiceMacro = (data) => {
  const errors = [];
  const { name, expression, description, characterSheetId } = data;

  if (!name || name.trim() === '') {
    errors.push('Nome é obrigatório');
  } else if (name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }

  if (!expression || expression.trim() === '') {
    errors.push('Expressão é obrigatória');
  } else if (expression.length > 200) {
    errors.push('Expressão deve ter no máximo 200 caracteres');
  }

  if (description && description.length > 500) {
    errors.push('Descrição deve ter no máximo 500 caracteres');
  }

  if (!characterSheetId) {
    errors.push('ID da ficha é obrigatório');
  } else if (isNaN(parseInt(characterSheetId)) || parseInt(characterSheetId) < 1) {
    errors.push('ID da ficha deve ser um número válido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateDiceMacro = (data) => {
  const errors = [];
  const { name, expression, description } = data;

  if (name !== undefined) {
    if (name.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres');
    }
  }

  if (expression !== undefined) {
    if (expression.length > 200) {
      errors.push('Expressão deve ter no máximo 200 caracteres');
    }
  }

  if (description !== undefined && description.length > 500) {
    errors.push('Descrição deve ter no máximo 500 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};