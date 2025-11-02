import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sceneService, Scene } from '../services/sceneService';
import { toast } from 'react-toastify';

const Scenes: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadScenes();
    }
  }, [campaignId]);

  const loadScenes = async () => {
    try {
      const data = await sceneService.getScenes(campaignId!);
      setScenes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar cenas:', error);
      setScenes([]);
      toast.error('Erro ao carregar cenas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScene = async (sceneId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta cena?')) return;
    
    try {
      await sceneService.deleteScene(sceneId);
      setScenes(scenes.filter(s => s.id !== sceneId));
      toast.success('Cena excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir cena');
    }
  };

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
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(212, 175, 55, 0.3)',
            borderTop: '4px solid #d4af37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Carregando cenas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c1810 100%)',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate(`/campaigns/${campaignId}`)}
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '2px solid #d4af37',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: '#d4af37',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#d4af37';
              e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.color = '#d4af37';
            }}
          >
            ← Voltar
          </button>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#d4af37',
            fontFamily: 'Cinzel, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            margin: 0
          }}>
            🗺️ Cenas da Campanha
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            color: '#1a1a1a',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
          }}
        >
          ✨ Nova Cena
        </button>
      </div>

      {scenes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '20px',
          border: '2px dashed rgba(212, 175, 55, 0.3)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            opacity: 0.7
          }}>🗺️</div>
          <h3 style={{
            fontSize: '1.5rem',
            color: '#d4af37',
            marginBottom: '0.5rem',
            fontFamily: 'Cinzel, serif'
          }}>Nenhuma cena criada</h3>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '2rem',
            fontSize: '1rem'
          }}>Crie sua primeira cena para começar a aventura</p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              color: '#1a1a1a',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
            }}
          >
            ✨ Criar Primeira Cena
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {scenes.map((scene) => (
            <div key={scene.id} style={{
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '16px',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            }}>
              {scene.backgroundImage ? (
                <div style={{
                  height: '200px',
                  background: `url(${scene.backgroundImage}) center/cover`,
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '8px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.7rem',
                    color: '#d4af37'
                  }}>
                    🖼️ Com Fundo
                  </div>
                </div>
              ) : (
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  opacity: 0.5
                }}>
                  🗺️
                </div>
              )}
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#d4af37',
                  marginBottom: '0.5rem',
                  fontFamily: 'Cinzel, serif'
                }}>{scene.name}</h3>
                {scene.description && (
                  <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{scene.description}</p>
                )}
                
                <div style={{
                  fontSize: '0.8rem',
                  color: 'rgba(212, 175, 55, 0.7)',
                  marginBottom: '1.5rem',
                  padding: '0.5rem',
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  📐 Grid: {scene.gridSize}px • 📏 {scene.width}x{scene.height}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/scenes/${scene.id}`)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    🎮 Abrir
                  </button>
                  <button
                    onClick={() => navigate(`/scenes/${scene.id}/edit`)}
                    style={{
                      background: 'rgba(255, 193, 7, 0.2)',
                      border: '2px solid #ffc107',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: '#ffc107',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ffc107';
                      e.currentTarget.style.color = '#1a1a1a';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 193, 7, 0.2)';
                      e.currentTarget.style.color = '#ffc107';
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteScene(scene.id)}
                    style={{
                      background: 'rgba(220, 53, 69, 0.2)',
                      border: '2px solid #dc3545',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#dc3545';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
                      e.currentTarget.style.color = '#dc3545';
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateSceneModal
          campaignId={campaignId!}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newScene) => {
            setScenes([...scenes, newScene]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

interface CreateSceneModalProps {
  campaignId: string;
  onClose: () => void;
  onSuccess: (scene: Scene) => void;
}

const CreateSceneModal: React.FC<CreateSceneModalProps> = ({ campaignId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gridSize: 50,
    width: 1920,
    height: 1080
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const scene = await sceneService.createScene({
        ...formData,
        campaignId
      });
      onSuccess(scene);
      toast.success('Cena criada com sucesso');
    } catch (error) {
      toast.error('Erro ao criar cena');
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
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(44, 24, 16, 0.95) 100%)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        border: '2px solid #d4af37',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        margin: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#d4af37',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontFamily: 'Cinzel, serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>✨ Nova Cena</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '0.5rem'
            }}>🏷️ Nome da Cena</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.5)',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '0.5rem'
            }}>📝 Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.5)',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                height: '80px',
                resize: 'vertical',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '0.5rem'
              }}>📏 Largura</label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(0,0,0,0.5)',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '0.5rem'
              }}>📐 Altura</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(0,0,0,0.5)',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '0.5rem'
            }}>🔲 Tamanho do Grid (px)</label>
            <input
              type="number"
              value={formData.gridSize}
              onChange={(e) => setFormData({ ...formData, gridSize: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.5)',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'rgba(108, 117, 125, 0.3)',
                border: '2px solid #6c757d',
                borderRadius: '12px',
                color: '#6c757d',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#6c757d';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(108, 117, 125, 0.3)';
                e.currentTarget.style.color = '#6c757d';
              }}
            >
              ❌ Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                background: loading ? 'rgba(212, 175, 55, 0.5)' : 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#1a1a1a',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              {loading ? '⏳ Criando...' : '✨ Criar Cena'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Scenes;