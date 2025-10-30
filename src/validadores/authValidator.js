export const validateRegister = (data) => {
  const errors = [];
  const { name, email, password } = data;

  if (!name || name.trim() === '') {
    errors.push('Nome é obrigatório');
  }

  if (!email || email.trim() === '') {
    errors.push('Email é obrigatório');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email deve ter formato válido');
  }

  if (!password) {
    errors.push('Senha é obrigatória');
  } else if (password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};