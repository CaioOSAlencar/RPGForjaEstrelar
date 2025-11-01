import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import { campaignService } from '../services/campaignService';

const JoinCampaign: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const campaign = await campaignService.joinByCode(roomCode.toUpperCase());
      navigate(`/campaigns/${campaign.id}`);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Código de campanha não encontrado. Verifique se digitou corretamente.');
      } else if (err.response?.status === 409) {
        setError('Você já participa desta campanha.');
      } else {
        setError(err.response?.data?.message || 'Erro ao entrar na campanha');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rpg-container">
      <RPGHeader />
      <RPGBackground />
      
      <div className="rpg-card" style={{ marginTop: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="rpg-title">
            🚪 ENTRAR EM CAMPANHA
          </h1>
          <p className="rpg-subtitle">
            Digite o código da campanha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rpg-form">
          <div className="rpg-field">
            <label className="rpg-label">
              🔑 Código da Campanha
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="rpg-input"
              placeholder="Ex: ABC123"
              required
              maxLength={6}
              style={{ 
                textAlign: 'center', 
                fontSize: '1.2rem', 
                letterSpacing: '0.2rem',
                textTransform: 'uppercase'
              }}
            />
            <p style={{ 
              fontSize: '0.8rem', 
              color: 'rgba(212, 175, 55, 0.6)', 
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              O código geralmente tem 6 caracteres (letras e números)
            </p>
          </div>

          {error && (
            <div className="rpg-error">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || roomCode.length < 3}
            className="rpg-button"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="loading-spinner"></span>
                Entrando...
              </span>
            ) : (
              '🎲 Entrar na Aventura'
            )}
          </button>
        </form>

        <div style={{ 
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '2rem',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <h3 style={{ 
            fontFamily: 'Cinzel, serif', 
            color: '#D4AF37', 
            marginBottom: '1rem',
            fontSize: '1rem'
          }}>
            💡 Como funciona?
          </h3>
          <ul style={{ 
            color: 'rgba(212, 175, 55, 0.7)', 
            fontSize: '0.9rem',
            lineHeight: '1.6',
            paddingLeft: '1rem'
          }}>
            <li>Peça ao Mestre da campanha o código de acesso</li>
            <li>Digite o código no campo acima</li>
            <li>Você será automaticamente adicionado à campanha</li>
            <li>Poderá participar das sessões e criar personagens</li>
          </ul>
        </div>

        <div className="rpg-link">
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
          >
            ← Voltar às Campanhas
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCampaign;