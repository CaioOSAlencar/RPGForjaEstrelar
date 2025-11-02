import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import RPGBackground from '../components/RPGBackground';
import PasswordInput from '../components/PasswordInput';
import { setUserInStorage } from '../utils/localStorage';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🚀 Tentando registrar:', formData);
    console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:3000/api');

    try {
      const response = await authService.register(formData);
      console.log('✅ Registro bem-sucedido:', response);
      localStorage.setItem('token', response.token);
      setUserInStorage(response.user);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Erro no registro:', err);
      console.error('📡 Resposta da API:', err.response);
      console.error('🔗 URL tentada:', err.config?.url);
      
      // Log completo para debug
      console.log('Status:', err.response?.status);
      console.log('Data:', err.response?.data);
      console.log('Message:', err.response?.data?.message);
      
      // Tratamento específico de erros
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        const message = errorData.message || '';
        
        if (message.toLowerCase().includes('email já está cadastrado') || 
            message.toLowerCase().includes('email') && message.toLowerCase().includes('cadastrado')) {
          setError('Este email já está cadastrado. Tente fazer login ou use outro email.');
        } else if (message.toLowerCase().includes('senha') || message.toLowerCase().includes('password')) {
          setError('A senha deve ter pelo menos 6 caracteres.');
        } else if (message.toLowerCase().includes('nome') || message.toLowerCase().includes('name')) {
          setError('O nome é obrigatório e deve ter pelo menos 2 caracteres.');
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          // Se houver array de erros, pegar o primeiro
          setError(errorData.errors[0] || 'Dados inválidos. Verifique as informações.');
        } else {
          setError(message || 'Dados inválidos. Verifique as informações e tente novamente.');
        }
      } else if (err.response?.status === 409) {
        setError('Este email já está cadastrado. Tente fazer login ou use outro email.');
      } else if (err.response?.status === 422) {
        setError('Dados inválidos. Verifique se o email é válido e a senha tem pelo menos 6 caracteres.');
      } else if (err.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente em alguns minutos.');
      } else {
        setError('Erro ao criar conta. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="rpg-container">
      <RPGBackground />
      
      <div className="rpg-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="rpg-title">
            CONCLAVE
          </h1>
          <p className="rpg-subtitle">
            Crie sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rpg-form">
          <div className="rpg-field">
            <label className="rpg-label">
              Nome do Aventureiro
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="rpg-input"
              placeholder="Seu nome de aventureiro"
              required
            />
          </div>

          <div className="rpg-field">
            <label className="rpg-label">
              📧 Pergaminho do Aventureiro
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="rpg-input"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="rpg-field">
            <label className="rpg-label">
              🗝️ Palavra Secreta
            </label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="rpg-error">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rpg-button"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="loading-spinner"></span>
                Criando Personagem...
              </span>
            ) : (
              '✨ Criar Conta'
            )}
          </button>
        </form>

        <div className="rpg-link">
          <p>
            Já tem um Conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
            >
              Entrar no CONCLAVE
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;