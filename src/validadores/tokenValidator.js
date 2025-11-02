export const validateCreateToken = (data) => {
  const errors = [];
  const { name, sceneId, size, hp, maxHp } = data;

  // Validação do nome
  if (!name || name.trim() === '') {
    errors.push('Nome do token é obrigatório');
  } else if (name.trim().length < 1) {
    errors.push('Nome do token deve ter pelo menos 1 caractere');
  } else if (name.trim().length > 50) {
    errors.push('Nome do token deve ter no máximo 50 caracteres');
  }

  // Validação do sceneId
  if (!sceneId) {
    errors.push('ID da cena é obrigatório');
  } else if (isNaN(parseInt(sceneId))) {
    errors.push('ID da cena deve ser um número válido');
  }

  // Validação do tamanho (opcional)
  if (size !== undefined) {
    const tokenSize = parseInt(size);
    if (isNaN(tokenSize) || tokenSize < 1 || tokenSize > 10) {
      errors.push('Tamanho do token deve ser entre 1 e 10 quadrados');
    }
  }

  // Validação do HP (opcional)
  if (hp !== undefined) {
    const hitPoints = parseInt(hp);
    if (isNaN(hitPoints) || hitPoints < 0) {
      errors.push('HP deve ser um número positivo');
    }
  }

  // Validação do HP máximo (opcional)
  if (maxHp !== undefined) {
    const maxHitPoints = parseInt(maxHp);
    if (isNaN(maxHitPoints) || maxHitPoints < 1) {
      errors.push('HP máximo deve ser um número positivo');
    }
  }

  // Validar se HP não é maior que HP máximo
  if (hp !== undefined && maxHp !== undefined) {
    const hitPoints = parseInt(hp);
    const maxHitPoints = parseInt(maxHp);
    if (hitPoints > maxHitPoints) {
      errors.push('HP atual não pode ser maior que HP máximo');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateToken = (data) => {
  const errors = [];
  const { name, x, y, size, rotation, hp, maxHp, conditions, isVisible } = data;

  // Validação do nome (opcional)
  if (name !== undefined) {
    if (!name || name.trim() === '') {
      errors.push('Nome do token não pode ser vazio');
    } else if (name.trim().length > 50) {
      errors.push('Nome do token deve ter no máximo 50 caracteres');
    }
  }

  // Validação das coordenadas (opcional)
  if (x !== undefined && (isNaN(parseFloat(x)))) {
    errors.push('Coordenada X deve ser um número válido');
  }

  if (y !== undefined && (isNaN(parseFloat(y)))) {
    errors.push('Coordenada Y deve ser um número válido');
  }

  // Validação do tamanho (opcional)
  if (size !== undefined) {
    const tokenSize = parseInt(size);
    if (isNaN(tokenSize) || tokenSize < 1 || tokenSize > 10) {
      errors.push('Tamanho do token deve ser entre 1 e 10 quadrados');
    }
  }

  // Validação da rotação (opcional)
  if (rotation !== undefined) {
    const rot = parseFloat(rotation);
    if (isNaN(rot) || rot < 0 || rot >= 360) {
      errors.push('Rotação deve ser entre 0 e 359 graus');
    }
  }

  // Validação do HP (opcional)
  if (hp !== undefined) {
    const hitPoints = parseInt(hp);
    if (isNaN(hitPoints) || hitPoints < 0) {
      errors.push('HP deve ser um número positivo');
    }
  }

  // Validação do HP máximo (opcional)
  if (maxHp !== undefined) {
    const maxHitPoints = parseInt(maxHp);
    if (isNaN(maxHitPoints) || maxHitPoints < 1) {
      errors.push('HP máximo deve ser um número positivo');
    }
  }

  // Validação da visibilidade (opcional)
  if (isVisible !== undefined && typeof isVisible !== 'boolean') {
    errors.push('Visibilidade deve ser verdadeiro ou falso');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};