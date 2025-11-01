import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import RPGBackground from '../components/RPGBackground';
import PasswordInput from '../components/PasswordInput';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
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

    console.log('🚀 Tentando login:', formData);
    console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:3000/api');

    try {
      const response = await authService.login(formData);
      console.log('✅ Login bem-sucedido:', response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Erro no login:', err);
      console.error('📡 Resposta da API:', err.response);
      console.error('🔗 URL tentada:', err.config?.url);
      
      // Tratamento específico de erros
      if (err.response?.status === 401) {
        setError('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
      } else if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.message?.includes('email')) {
          setError('Por favor, insira um email válido.');
        } else if (errorData.message?.includes('senha') || errorData.message?.includes('password')) {
          setError('A senha é obrigatória.');
        } else {
          setError('Dados inválidos. Verifique as informações e tente novamente.');
        }
      } else if (err.response?.status === 404) {
        setError('Usuário não encontrado. Verifique o email ou crie uma nova conta.');
      } else if (err.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente em alguns minutos.');
      } else {
        setError('Erro ao fazer login. Verifique sua conexão e tente novamente.');
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
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="rpg-title">
            CONCLAVE
          </h1>
          <p className="rpg-subtitle">
            Pegue sua caneca e entre na aventura!
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="rpg-form">
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
                Entrando na Taverna...
              </span>
            ) : (
              '🚪 Entrar no Conglave'
            )}
          </button>
        </form>

        <div className="rpg-link">
          <p>
            Novo aventureiro?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
            >
              Criar Personagem
            </button>
          </p>
        </div>
      </div>
    </div>
    
  );
};

export default Login;