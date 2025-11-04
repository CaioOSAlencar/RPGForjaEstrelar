import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RPGBackground from '../components/RPGBackground';
import RPGHeader from '../components/RPGHeader';
import ConfirmationModal from '../components/ConfirmationModal';
import { campaignService, Campaign } from '../services/campaignService';
import { getUserFromStorage } from '../utils/localStorage';

interface Player {
  id: number;
  name: string;
  email: string;
  role: string;
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const user = getUserFromStorage();

  useEffect(() => {
    if (id) {
      loadCampaignDetails();
    }
  }, [id]);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      const [campaignData, playersData] = await Promise.all([
        campaignService.getById(Number(id)),
        campaignService.getPlayers(Number(id))
      ]);
      setCampaign(campaignData);
      setPlayers(playersData);
    } catch (err: any) {
      setError('Erro ao carregar detalhes da campanha');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetShareLink = async () => {
    try {
      const linkData = await campaignService.getShareableLink(Number(id));
      setShareLink(linkData.shareLink);
    } catch (err: any) {
      setError('Erro ao gerar link compartilhável');
    }
  };

  const handleDeleteCampaign = async () => {
    setDeleting(true);
    try {
      await campaignService.delete(Number(id));
      navigate('/campaigns');
    } catch (err: any) {
      setError('Erro ao deletar campanha');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isMaster = campaign?.masterId === user.id;

  if (loading) {
    return (
      <div className="rpg-container">
        <RPGHeader />
        <RPGBackground />
        <div className="rpg-card" style={{ marginTop: '70px', textAlign: 'center' }}>
          <span className="loading-spinner"></span>
          <p style={{ color: 'rgba(212, 175, 55, 0.7)', marginTop: '1rem' }}>
            Carregando campanha...
          </p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="rpg-container">
        <RPGHeader />
        <RPGBackground />
        <div className="rpg-card" style={{ marginTop: '70px' }}>
          <div className="rpg-error">
            ⚠️ {error || 'Campanha não encontrada'}
          </div>
          <div className="rpg-link">
            <button onClick={() => navigate('/campaigns')}>
              ← Voltar às Campanhas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rpg-container">
      <RPGHeader />
      <RPGBackground />
      
      <div className="rpg-card" style={{ maxWidth: '900px', marginTop: '70px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="rpg-title" style={{ fontSize: '2rem' }}>
            {campaign.name}
          </h1>
          <p className="rpg-subtitle">
            🎲 {campaign.system} • #{campaign.roomCode}
          </p>
          {campaign.description && (
            <p style={{ 
              color: 'rgba(212, 175, 55, 0.7)', 
              marginTop: '1rem',
              lineHeight: '1.5'
            }}>
              {campaign.description}
            </p>
          )}
        </div>

        {/* Actions */}
        {isMaster && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(`/campaigns/${id}/edit`)}
              className="rpg-button"
              style={{ 
                flex: 1, 
                minWidth: '150px',
                background: 'linear-gradient(135deg, #4169E1 0%, #6495ED 100%)'
              }}
            >
              ✏️ Editar Campanha
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="rpg-button"
              style={{ flex: 1, minWidth: '150px' }}
            >
              📧 Convidar Jogadores
            </button>
            <button
              onClick={handleGetShareLink}
              className="rpg-button"
              style={{ 
                flex: 1, 
                minWidth: '150px',
                background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)'
              }}
            >
              🔗 Link Compartilhável
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rpg-button"
              style={{ 
                flex: 1, 
                minWidth: '150px',
                background: 'linear-gradient(135deg, #DC143C 0%, #B22222 100%)'
              }}
            >
              🗑️ Deletar Campanha
            </button>
          </div>
        )}

        {/* Share Link Display */}
        {shareLink && (
          <div style={{
            background: 'rgba(0, 128, 0, 0.1)',
            border: '1px solid rgba(0, 128, 0, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{ color: '#90EE90', marginBottom: '0.5rem', fontFamily: 'Cinzel, serif' }}>
              🔗 Link Compartilhável
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={shareLink}
                readOnly
                className="rpg-input"
                style={{ flex: 1, fontSize: '0.9rem' }}
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="rpg-button"
                style={{ padding: '0.5rem 1rem' }}
              >
                📋 Copiar
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: activeTab === 'overview' ? '#D4AF37' : 'rgba(212, 175, 55, 0.6)',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'overview' ? '2px solid #D4AF37' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            📋 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('players')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: activeTab === 'players' ? '#D4AF37' : 'rgba(212, 175, 55, 0.6)',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'players' ? '2px solid #D4AF37' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            👥 Jogadores ({players.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <h3 style={{ 
                  fontFamily: 'Cinzel, serif', 
                  color: '#D4AF37', 
                  marginBottom: '1rem'
                }}>
                  📊 Informações da Campanha
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(212, 175, 55, 0.7)' }}>Sistema:</span>
                    <span style={{ color: '#D4AF37' }}>{campaign.system}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(212, 175, 55, 0.7)' }}>Código:</span>
                    <span style={{ color: '#D4AF37' }}>#{campaign.roomCode}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(212, 175, 55, 0.7)' }}>Mestre:</span>
                    <span style={{ color: '#D4AF37' }}>{campaign.master?.name || 'Desconhecido'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(212, 175, 55, 0.7)' }}>Criada em:</span>
                    <span style={{ color: '#D4AF37' }}>
                      {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <h3 style={{ 
                  fontFamily: 'Cinzel, serif', 
                  color: '#D4AF37', 
                  marginBottom: '1rem'
                }}>
                  🎮 Jogar
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <button 
                    onClick={() => navigate(`/campaigns/${id}/play`)}
                    className="rpg-button"
                    style={{ 
                      background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
                      fontSize: '1.1rem',
                      padding: '1rem'
                    }}
                  >
                    🎲 Entrar na Mesa de Jogo
                  </button>
                  <button 
                    onClick={() => navigate(`/campaigns/${id}/scenes`)}
                    className="rpg-button"
                    style={{ opacity: 0.7, fontSize: '0.9rem' }}
                  >
                    ⚙️ Gerenciar Cenas (Mestre)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div>
            {players.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 1rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                border: '2px dashed rgba(212, 175, 55, 0.3)'
              }}>
                <h3 style={{ 
                  fontFamily: 'Cinzel, serif', 
                  color: '#D4AF37', 
                  marginBottom: '1rem'
                }}>
                  👥 Nenhum Jogador
                </h3>
                <p style={{ color: 'rgba(212, 175, 55, 0.7)', marginBottom: '1.5rem' }}>
                  Esta campanha ainda não tem jogadores.
                </p>
                {isMaster && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="rpg-button"
                  >
                    📧 Convidar Primeiro Jogador
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {players.map((player) => (
                  <PlayerCard 
                    key={player.id}
                    player={player}
                    isMaster={isMaster}
                    currentUserId={user.id}
                    campaignId={Number(id)}
                    onPlayerRemoved={loadCampaignDetails}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal 
            campaignId={Number(id)}
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setShowInviteModal(false);
              loadCampaignDetails();
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="⚠️ Deletar Campanha"
          message={`Tem certeza que deseja deletar a campanha "${campaign?.name}"? Esta ação não pode ser desfeita e todos os dados serão perdidos permanentemente.`}
          confirmText="🗑️ Deletar Permanentemente"
          cancelText="❌ Cancelar"
          onConfirm={handleDeleteCampaign}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
          type="danger"
        />

        <div className="rpg-link">
          <button onClick={() => navigate('/campaigns')}>
            ← Voltar às Campanhas
          </button>
        </div>
      </div>
    </div>
  );
};

interface InviteModalProps {
  campaignId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ campaignId, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await campaignService.inviteByEmail(campaignId, email);
      setSuccess('Convite enviado com sucesso!');
      setEmail('');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar convite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
        border: '2px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        padding: '2rem',
        width: '90%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="rpg-title" style={{ fontSize: '1.5rem' }}>
            📧 CONVIDAR JOGADOR
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="rpg-form">
          <div className="rpg-field">
            <label className="rpg-label">Email do Jogador</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rpg-input"
              placeholder="jogador@email.com"
              required
            />
          </div>

          {error && (
            <div className="rpg-error">
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
              fontSize: '0.9rem'
            }}>
              ✅ {success}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="rpg-button"
              style={{ 
                flex: 1,
                background: 'rgba(139, 0, 0, 0.2)',
                border: '2px solid rgba(139, 0, 0, 0.5)'
              }}
            >
              ❌ Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rpg-button"
              style={{ flex: 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="loading-spinner"></span>
                  Enviando...
                </span>
              ) : (
                '📧 Enviar Convite'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PlayerCardProps {
  player: Player;
  isMaster: boolean;
  currentUserId: number;
  campaignId: number;
  onPlayerRemoved: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  isMaster, 
  currentUserId, 
  campaignId, 
  onPlayerRemoved 
}) => {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemovePlayer = async () => {
    setRemoving(true);
    try {
      await campaignService.removePlayer(campaignId, player.id);
      onPlayerRemoved();
    } catch (err) {
      console.error('Erro ao remover jogador:', err);
    } finally {
      setRemoving(false);
      setShowConfirmRemove(false);
    }
  };

  const canRemove = isMaster && player.role !== 'master' && player.id !== currentUserId;

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <h4 style={{ 
          color: '#D4AF37', 
          marginBottom: '0.25rem',
          fontFamily: 'Cinzel, serif'
        }}>
          {player.role === 'master' ? '👑' : '🎭'} {player.name}
          {player.id === currentUserId && (
            <span style={{ 
              color: 'rgba(212, 175, 55, 0.6)', 
              fontSize: '0.8rem',
              marginLeft: '0.5rem'
            }}>
              (Você)
            </span>
          )}
        </h4>
        <p style={{ 
          color: 'rgba(212, 175, 55, 0.6)', 
          fontSize: '0.9rem' 
        }}>
          {player.email}
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ 
          background: player.role === 'master' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 100, 200, 0.2)',
          color: player.role === 'master' ? '#D4AF37' : '#87CEEB',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontFamily: 'Cinzel, serif'
        }}>
          {player.role === 'master' ? 'Mestre' : 'Jogador'}
        </span>
        
        {canRemove && (
          <button
            onClick={() => setShowConfirmRemove(true)}
            style={{
              background: 'rgba(139, 0, 0, 0.2)',
              border: '1px solid rgba(139, 0, 0, 0.5)',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              color: '#ff6b6b',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 0, 0, 0.2)';
            }}
          >
            ❌ Remover
          </button>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmRemove}
        title="⚠️ Remover Jogador"
        message={`Tem certeza que deseja remover ${player.name} da campanha? Esta ação não pode ser desfeita.`}
        confirmText="🗑️ Remover"
        cancelText="❌ Cancelar"
        onConfirm={handleRemovePlayer}
        onCancel={() => setShowConfirmRemove(false)}
        loading={removing}
        type="danger"
      />
    </div>
  );
};

export default CampaignDetails;