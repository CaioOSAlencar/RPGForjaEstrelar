import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import PasswordInput from '../components/PasswordInput';
import { getUserFromStorage } from '../utils/localStorage';

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const user = getUserFromStorage();

  React.useEffect(() => {
    setFormData(prev => ({ ...prev, name: user.name || '' }));
  }, [user.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, name: formData.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Senha alterada com sucesso!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setError('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rpg-container">
      <RPGHeader />
      <RPGBackground />
      
      <div className="rpg-card" style={{ maxWidth: '450px', marginTop: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="rpg-title">
            👤 PERFIL DO AVENTUREIRO
          </h1>
          <p className="rpg-subtitle">
            Gerencie suas informações
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: activeTab === 'profile' ? '#D4AF37' : 'rgba(212, 175, 55, 0.6)',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'profile' ? '2px solid #D4AF37' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            📋 Informações
          </button>
          <button
            onClick={() => setActiveTab('security')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: activeTab === 'security' ? '#D4AF37' : 'rgba(212, 175, 55, 0.6)',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'security' ? '2px solid #D4AF37' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            🔒 Segurança
          </button>
        </div>

        {error && (
          <div className="rpg-error" style={{ marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: 'rgba(0, 128, 0, 0.2)', 
            border: '1px solid rgba(0, 128, 0, 0.5)', 
            borderRadius: '8px', 
            padding: '0.75rem', 
            color: '#90EE90', 
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            ✅ {success}
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="rpg-form">
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
                📧 Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="rpg-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.8rem', color: 'rgba(212, 175, 55, 0.5)', marginTop: '0.25rem' }}>
                O email não pode ser alterado
              </p>
            </div>

            <div className="rpg-field">
              <label className="rpg-label">
                🎭 Papel
              </label>
              <input
                type="text"
                value={user.role === 'player' ? 'Jogador' : 'Mestre'}
                disabled
                className="rpg-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rpg-button"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="loading-spinner"></span>
                  Salvando...
                </span>
              ) : (
                '💾 Salvar Alterações'
              )}
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="rpg-form">
            <div className="rpg-field">
              <label className="rpg-label">
                🔑 Senha Atual
              </label>
              <PasswordInput
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Digite sua senha atual"
                required
              />
            </div>

            <div className="rpg-field">
              <label className="rpg-label">
                🗝️ Nova Senha
              </label>
              <PasswordInput
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Digite sua nova senha"
                required
                minLength={6}
              />
            </div>

            <div className="rpg-field">
              <label className="rpg-label">
                🔒 Confirmar Nova Senha
              </label>
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua nova senha"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rpg-button"
              style={{ background: 'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="loading-spinner"></span>
                  Alterando...
                </span>
              ) : (
                '🔄 Alterar Senha'
              )}
            </button>
          </form>
        )}

        <div className="rpg-link">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            ← Voltar à Taverna
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;