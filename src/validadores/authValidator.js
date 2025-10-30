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

  // Validação da senha
  if (!password) {
    errors.push('Senha é obrigatória');
  } else {
    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos 1 letra maiúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Senha deve conter pelo menos 1 número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos 1 caractere especial (!@#$%^&*)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};