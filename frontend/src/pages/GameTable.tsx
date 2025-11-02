import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignService, Campaign } from '../services/campaignService';
import { sceneService, Scene } from '../services/sceneService';
import { getUserFromStorage } from '../utils/localStorage';

interface Player {
  id: number;
  name: string;
  email: string;
  role: string;
}

const GameTable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const user = getUserFromStorage();

  useEffect(() => {
    if (id) {
      loadCampaignData();
    }
  }, [id]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const [campaignData, playersData, scenesData] = await Promise.all([
        campaignService.getById(Number(id)),
        campaignService.getPlayers(Number(id)),
        sceneService.getScenes(id!)
      ]);
      setCampaign(campaignData);
      setPlayers(playersData || []);
      setScenes(Array.isArray(scenesData) ? scenesData : []);
      
      // Definir cena ativa (primeira cena ou nenhuma)
      const validScenes = Array.isArray(scenesData) ? scenesData : [];
      const firstScene = validScenes[0] || null;
      setActiveScene(firstScene);
    } catch (err: any) {
      setError('Erro ao carregar dados da campanha');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: user.name,
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const handleSceneChange = async (scene: Scene) => {
    if (user.id !== campaign?.masterId) return; // Só o mestre pode trocar cenas
    
    setActiveScene(scene);
    // TODO: Notificar outros jogadores via WebSocket
    console.log('Cena alterada para:', scene.name);
  };

  const handleCreateScene = () => {
    navigate(`/campaigns/${id}/scenes`);
  };

  const isMaster = campaign?.masterId === user.id;

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c1810 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#d4af37' }}>
          <span className="loading-spinner" style={{ marginBottom: '1rem' }}></span>
          <p>Preparando a mesa de jogo...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c1810 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
          <h2>⚠️ {error || 'Campanha não encontrada'}</h2>
          <button 
            onClick={() => navigate('/campaigns')}
            style={{
              background: '#d4af37',
              color: '#1a1a1a',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            ← Voltar às Campanhas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c1810 100%)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        borderBottom: '2px solid #d4af37',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '0.5rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate(`/campaigns/${id}`)}
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                color: '#d4af37',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ← Sair
            </button>
            <h1 style={{ 
              color: '#d4af37', 
              margin: 0, 
              fontSize: '1.2rem',
              fontFamily: 'Cinzel, serif'
            }}>
              🏰 {campaign.name}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#d4af37', fontSize: '0.9rem' }}>
              👥 {players.length} jogadores
            </span>
            <span style={{ color: '#d4af37', fontSize: '0.9rem' }}>
              🎲 {campaign.system}
            </span>
          </div>
        </div>
        
        {/* Scene Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          borderTop: '1px solid rgba(212, 175, 55, 0.3)',
          minHeight: '40px',
          background: 'rgba(0,0,0,0.5)'
        }}>
          {isMaster && (
            <button
              onClick={handleCreateScene}
              style={{
                background: 'rgba(34, 139, 34, 0.3)',
                border: '1px solid #228B22',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                color: '#90EE90',
                cursor: 'pointer',
                fontSize: '0.7rem',
                marginRight: '0.5rem'
              }}
            >
              + Nova Cena
            </button>
          )}
          
          <div style={{ display: 'flex', gap: '0.25rem', flex: 1, overflowX: 'auto' }}>
            {!Array.isArray(scenes) || scenes.length === 0 ? (
              <div style={{ 
                color: 'rgba(212, 175, 55, 0.5)', 
                fontSize: '0.8rem',
                padding: '0.25rem 0.5rem'
              }}>
                {isMaster ? 'Nenhuma cena criada. Clique em "+ Nova Cena"' : 'Aguardando o mestre criar cenas...'}
              </div>
            ) : (
              scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => handleSceneChange(scene)}
                  disabled={!isMaster}
                  style={{
                    background: activeScene?.id === scene.id 
                      ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' 
                      : 'rgba(212, 175, 55, 0.2)',
                    border: activeScene?.id === scene.id 
                      ? '1px solid #d4af37' 
                      : '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '4px',
                    padding: '0.25rem 0.75rem',
                    color: activeScene?.id === scene.id ? '#1a1a1a' : '#d4af37',
                    cursor: isMaster ? 'pointer' : 'default',
                    fontSize: '0.7rem',
                    fontWeight: activeScene?.id === scene.id ? 'bold' : 'normal',
                    opacity: isMaster ? 1 : 0.8,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {scene.name}
                  {activeScene?.id === scene.id && ' ●'}
                </button>
              ))
            )}
          </div>
          
          {isMaster && Array.isArray(scenes) && scenes.length > 0 && (
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(212, 175, 55, 0.6)',
              marginLeft: '0.5rem'
            }}>
              Clique para trocar cena
            </div>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Chat Sidebar */}
        <div style={{
          width: '300px',
          background: 'rgba(0,0,0,0.6)',
          borderRight: '1px solid rgba(212, 175, 55, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '0.5rem',
            borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
            background: 'rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ 
              color: '#d4af37', 
              margin: 0, 
              fontSize: '1rem',
              fontFamily: 'Cinzel, serif'
            }}>
              💬 Chat
            </h3>
          </div>
          
          <div style={{
            flex: 1,
            padding: '0.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {chatMessages.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: 'rgba(212, 175, 55, 0.5)',
                fontSize: '0.9rem',
                marginTop: '2rem'
              }}>
                Nenhuma mensagem ainda...<br/>
                Seja o primeiro a falar!
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ 
                    color: '#d4af37', 
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {msg.user} <span style={{ 
                      color: 'rgba(212, 175, 55, 0.6)',
                      fontWeight: 'normal',
                      fontSize: '0.7rem'
                    }}>
                      {msg.timestamp}
                    </span>
                  </div>
                  <div style={{ color: '#ffffff' }}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <form onSubmit={handleSendMessage} style={{
            padding: '0.5rem',
            borderTop: '1px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '4px',
                padding: '0.5rem',
                color: '#ffffff',
                fontSize: '0.8rem'
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                background: newMessage.trim() ? '#d4af37' : 'rgba(212, 175, 55, 0.3)',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem',
                color: '#1a1a1a',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                fontSize: '0.8rem'
              }}
            >
              📤
            </button>
          </form>
        </div>

        {/* Main Canvas Area */}
        <div style={{
          flex: 1,
          background: activeScene?.backgroundImage 
            ? `url(${activeScene.backgroundImage}) center/cover no-repeat, rgba(0,0,0,0.3)`
            : 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {activeScene ? (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '4px',
              padding: '0.5rem',
              color: '#d4af37',
              fontSize: '0.8rem'
            }}>
              🗺️ {activeScene.name}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              color: 'rgba(212, 175, 55, 0.7)'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗺️</h2>
              <h3 style={{ marginBottom: '0.5rem' }}>Mesa de Jogo</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                {isMaster 
                  ? 'Crie uma cena para começar a jogar'
                  : 'Aguardando o mestre preparar a cena...'}
              </p>
            </div>
          )}
        </div>

        {/* Players Sidebar */}
        <div style={{
          width: '250px',
          background: 'rgba(0,0,0,0.6)',
          borderLeft: '1px solid rgba(212, 175, 55, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '0.5rem',
            borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
            background: 'rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ 
              color: '#d4af37', 
              margin: 0, 
              fontSize: '1rem',
              fontFamily: 'Cinzel, serif'
            }}>
              👥 Jogadores
            </h3>
          </div>
          
          <div style={{
            flex: 1,
            padding: '0.5rem',
            overflowY: 'auto'
          }}>
            {players.map((player) => (
              <div key={player.id} style={{
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '4px',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.8rem'
              }}>
                <div style={{ 
                  color: '#d4af37', 
                  fontWeight: 'bold',
                  marginBottom: '0.25rem'
                }}>
                  {player.role === 'master' ? '👑' : '🎭'} {player.name}
                  {player.id === user.id && (
                    <span style={{ 
                      color: 'rgba(212, 175, 55, 0.6)',
                      fontSize: '0.7rem',
                      marginLeft: '0.25rem'
                    }}>
                      (Você)
                    </span>
                  )}
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.7rem'
                }}>
                  {player.role === 'master' ? 'Mestre' : 'Jogador'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTable;