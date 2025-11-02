// RF18 - Validações para fichas de personagem

export const validateCreateSheet = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Nome do personagem é obrigatório');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Nome do personagem deve ter no máximo 100 caracteres');
  }
  
  if (!data.campaignId) {
    errors.push('ID da campanha é obrigatório');
  }
  
  if (data.class && data.class.length > 50) {
    errors.push('Classe deve ter no máximo 50 caracteres');
  }
  
  if (data.level && (data.level < 1 || data.level > 20)) {
    errors.push('Nível deve ser entre 1 e 20');
  }
  
  if (!data.data) {
    errors.push('Dados da ficha são obrigatórios');
  }
  
  // Validar se data é JSON válido
  if (data.data) {
    try {
      const parsed = JSON.parse(data.data);
      if (!parsed.attributes || !parsed.skills || !parsed.inventory) {
        errors.push('Ficha deve conter attributes, skills e inventory');
      }
    } catch (error) {
      errors.push('Dados da ficha devem estar em formato JSON válido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
};

export const validateUpdateSheet = (data) => {
  const errors = [];
  
  if (data.name !== undefined) {
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome do personagem não pode estar vazio');
    }
    if (data.name && data.name.length > 100) {
      errors.push('Nome do personagem deve ter no máximo 100 caracteres');
    }
  }
  
  if (data.class !== undefined && data.class && data.class.length > 50) {
    errors.push('Classe deve ter no máximo 50 caracteres');
  }
  
  if (data.level !== undefined && (data.level < 1 || data.level > 20)) {
    errors.push('Nível deve ser entre 1 e 20');
  }
  
  if (data.data !== undefined) {
    try {
      const parsed = JSON.parse(data.data);
      if (!parsed.attributes || !parsed.skills || !parsed.inventory) {
        errors.push('Ficha deve conter attributes, skills e inventory');
      }
    } catch (error) {
      errors.push('Dados da ficha devem estar em formato JSON válido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
};