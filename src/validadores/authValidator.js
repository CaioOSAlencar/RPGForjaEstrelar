const validEmailProviders = [
  'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com',
  'live.com', 'msn.com', 'uol.com.br', 'bol.com.br', 'terra.com.br',
  'ig.com.br', 'globo.com', 'r7.com', 'oi.com.br', 'zipmail.com.br'
];

export const validateLogin = (data) => {
  const errors = [];
  const { email, password } = data;

  if (!email || email.trim() === '') {
    errors.push('Email é obrigatório');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email deve ter formato válido');
  }

  if (!password || password.trim() === '') {
    errors.push('Senha é obrigatória');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRegister = (data) => {
  const errors = [];
  const { name, email, password } = data;

  // Validação do nome
  if (!name || name.trim() === '') {
    errors.push('Nome é obrigatório');
  } else if (name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  // Validação do email
  if (!email || email.trim() === '') {
    errors.push('Email é obrigatório');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email deve ter formato válido');
  } else {
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!validEmailProviders.includes(emailDomain)) {
      errors.push('Email deve ser de um provedor válido (Gmail, Outlook, Yahoo, etc.)');
    }
  }

  // Validação da senha (relaxada para produção)
  if (!password) {
    errors.push('Senha é obrigatória');
  } else {
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    // Removidas validações rígidas para facilitar cadastro
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateProfile = (data) => {
  const errors = [];
  const { name, password } = data;

  // Validação do nome (opcional)
  if (name !== undefined) {
    if (!name || name.trim() === '') {
      errors.push('Nome não pode ser vazio');
    } else if (name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
  }

  // Validação da senha (opcional e relaxada)
  if (password !== undefined) {
    if (!password) {
      errors.push('Senha não pode ser vazia');
    } else if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};