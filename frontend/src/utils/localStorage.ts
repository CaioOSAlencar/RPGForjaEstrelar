export const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : {};
  } catch (error) {
    console.error('Erro ao parsear dados do usuário:', error);
    localStorage.removeItem('user'); // Remove dados corrompidos
    return {};
  }
};

export const setUserInStorage = (user: any) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error);
  }
};

export const clearUserStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};