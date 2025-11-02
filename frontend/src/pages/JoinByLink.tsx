import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import { campaignService } from '../services/campaignService';

const JoinByLink: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomCode) {
      handleJoinCampaign();
    } else {
      setError('Código de campanha inválido');
      setLoading(false);
    }
  }, [roomCode]);

  const handleJoinCampaign = async () => {
    try {
      setLoading(true);
      const result = await campaignService.joinByCode(roomCode!.toUpperCase());
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate(`/campaigns/${result.campaign.id}`);
      }, 2000);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Campanha não encontrada. O link pode estar inválido ou expirado.');
      } else if (err.response?.status === 409) {
        setError('Você já participa desta campanha.');
        // Redirecionar para campanhas após 3 segundos
        setTimeout(() => {
          navigate('/campaigns');
        }, 3000);
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
            🔗 ENTRANDO NA CAMPANHA
          </h1>
          <p className="rpg-subtitle">
            Código: {roomCode?.toUpperCase()}
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <span className="loading-spinner" style={{ marginBottom: '1rem' }}></span>
            <p style={{ color: 'rgba(212, 175, 55, 0.7)' }}>
              Processando convite...
            </p>
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(0, 128, 0, 0.2)',
            border: '1px solid rgba(0, 128, 0, 0.5)',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: '#90EE90', 
              marginBottom: '1rem',
              fontFamily: 'Cinzel, serif'
            }}>
              ✅ Sucesso!
            </h3>
            <p style={{ color: 'rgba(144, 238, 144, 0.8)' }}>
              Você entrou na campanha com sucesso!<br/>
              Redirecionando...
            </p>
          </div>
        )}

        {error && (
          <div>
            <div className="rpg-error">
              ⚠️ {error}
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '2rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate('/campaigns')}
                className="rpg-button"
                style={{ flex: 1, minWidth: '200px' }}
              >
                📋 Ver Minhas Campanhas
              </button>
              <button
                onClick={() => navigate('/join')}
                className="rpg-button"
                style={{ 
                  flex: 1, 
                  minWidth: '200px',
                  background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)'
                }}
              >
                🔑 Entrar com Código
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !success && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'rgba(212, 175, 55, 0.7)' }}>
              Link inválido ou expirado
            </p>
            <button
              onClick={() => navigate('/campaigns')}
              className="rpg-button"
              style={{ marginTop: '1rem' }}
            >
              ← Voltar às Campanhas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinByLink;