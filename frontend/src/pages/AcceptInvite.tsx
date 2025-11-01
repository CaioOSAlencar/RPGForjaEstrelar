import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import { campaignService } from '../services/campaignService';

const AcceptInvite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [campaign, setCampaign] = useState<any>(null);

  const handleAcceptInvite = async () => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const result = await campaignService.acceptInvite(token);
      setCampaign(result.campaign);
      
      // Redirecionar após 10 segundos
      setTimeout(() => {
        navigate(`/campaigns/${result.campaign.id}`);
      }, 10000);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Convite não encontrado ou inválido.');
      } else if (err.response?.status === 400) {
        const message = err.response.data?.message || '';
        if (message.includes('expirado')) {
          setError('Este convite expirou. Peça um novo convite ao mestre da campanha.');
        } else if (message.includes('usado')) {
          setError('Este convite já foi utilizado.');
        } else {
          setError('Convite inválido ou expirado.');
        }
      } else if (err.response?.status === 409) {
        setError('Você já participa desta campanha.');
      } else {
        setError('Erro ao aceitar convite. Tente novamente.');
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
            📜 CONVITE PARA CAMPANHA
          </h1>
          <p className="rpg-subtitle">
            Você foi convidado para uma aventura épica!
          </p>
        </div>

        {campaign ? (
          <div>
            <div style={{
              background: 'rgba(0, 128, 0, 0.1)',
              border: '1px solid rgba(0, 128, 0, 0.3)',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                color: '#90EE90', 
                fontFamily: 'Cinzel, serif',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                ✅ Convite Aceito!
              </h2>
              <p style={{ color: 'rgba(144, 238, 144, 0.8)', marginBottom: '1rem' }}>
                Você agora faz parte da campanha:
              </p>
              <h3 style={{ 
                color: '#D4AF37', 
                fontFamily: 'Cinzel, serif',
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                {campaign.name}
              </h3>
              <p style={{ color: 'rgba(212, 175, 55, 0.7)' }}>
                🎲 {campaign.system}
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  className="rpg-button"
                  style={{ marginRight: '1rem' }}
                >
                  🏰 Ir para Campanha
                </button>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="rpg-button"
                  style={{ 
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '2px solid rgba(212, 175, 55, 0.5)'
                  }}
                >
                  📜 Ver Todas as Campanhas
                </button>
              </div>
              <p style={{ 
                color: 'rgba(144, 238, 144, 0.6)', 
                fontSize: '0.9rem',
                marginTop: '1rem'
              }}>
                Redirecionamento automático em 10 segundos...
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontFamily: 'Cinzel, serif', 
                color: '#D4AF37', 
                marginBottom: '1rem'
              }}>
                🎭 Pronto para a Aventura?
              </h3>
              <p style={{ 
                color: 'rgba(212, 175, 55, 0.7)', 
                marginBottom: '2rem',
                lineHeight: '1.5'
              }}>
                Ao aceitar este convite, você se juntará à campanha e poderá:
              </p>
              <ul style={{ 
                color: 'rgba(212, 175, 55, 0.8)', 
                textAlign: 'left',
                marginBottom: '2rem',
                paddingLeft: '2rem'
              }}>
                <li>Criar e gerenciar personagens</li>
                <li>Participar das sessões de jogo</li>
                <li>Interagir com outros jogadores</li>
                <li>Acessar mapas e recursos da campanha</li>
              </ul>

              {error && (
                <div className="rpg-error" style={{ marginBottom: '1rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleAcceptInvite}
                disabled={loading}
                className="rpg-button"
                style={{ width: '100%' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="loading-spinner"></span>
                    Aceitando Convite...
                  </span>
                ) : (
                  '⚔️ Aceitar Convite e Entrar na Aventura'
                )}
              </button>
            </div>

            <div style={{ 
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <p style={{ 
                color: 'rgba(212, 175, 55, 0.6)', 
                fontSize: '0.9rem',
                textAlign: 'center',
                margin: 0
              }}>
                💡 Dica: Se o convite não funcionar, peça ao mestre da campanha para enviar um novo.
              </p>
            </div>
          </div>
        )}

        <div className="rpg-link">
          <button onClick={() => navigate('/campaigns')}>
            ← Voltar às Campanhas
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;