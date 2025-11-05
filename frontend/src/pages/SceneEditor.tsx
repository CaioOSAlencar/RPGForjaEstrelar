import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sceneService, Scene } from '../services/sceneService';
import { toast } from 'react-toastify';

const SceneEditor: React.FC = () => {
  const { sceneId } = useParams<{ sceneId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gridSize: 50,
    gridColor: '#ffffff',
    gridOpacity: 0.3,
    width: 1920,
    height: 1080
  });

  useEffect(() => {
    if (sceneId) {
      loadScene();
    }
  }, [sceneId]);

  const loadScene = async () => {
    try {
      const data = await sceneService.getScene(sceneId!);
      if (!data) {
        throw new Error('Cena nao encontrada');
      }
      setScene(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        gridSize: data.gridSize || 50,
        gridColor: data.gridColor || '#ffffff',
        gridOpacity: data.gridOpacity || 0.3,
        width: data.width || 1920,
        height: data.height || 1080
      });
    } catch (error: any) {
      console.error('Erro ao carregar cena:', error);
      toast.error(error?.response?.data?.message || 'Erro ao carregar cena');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Garantir que todos os valores estão definidos
      const dataToSave = {
        name: formData.name,
        description: formData.description || '',
        gridSize: formData.gridSize || 50,
        gridColor: formData.gridColor || '#ffffff',
        gridOpacity: formData.gridOpacity,
        width: formData.width || 1920,
        height: formData.height || 1080
      };
      
      console.log('Salvando dados:', dataToSave);
      const updatedScene = await sceneService.updateScene(sceneId!, dataToSave);
      console.log('Cena atualizada:', updatedScene);
      console.log('GridOpacity retornado:', updatedScene.gridOpacity);
      setScene(updatedScene);
      // Atualizar formData com os dados retornados do backend
      setFormData({
        name: updatedScene.name || '',
        description: updatedScene.description || '',
        gridSize: updatedScene.gridSize || 50,
        gridColor: updatedScene.gridColor || '#ffffff',
        gridOpacity: updatedScene.gridOpacity !== undefined ? updatedScene.gridOpacity : dataToSave.gridOpacity,
        width: updatedScene.width || 1920,
        height: updatedScene.height || 1080
      });
      toast.success('Cena salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar cena');
    } finally {
      setSaving(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas');
      return;
    }

    setUploading(true);
    try {
      // Obter dimensões da imagem
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      img.onload = async () => {
        // Atualizar dimensões no formData
        setFormData(prev => ({
          ...prev,
          width: img.width,
          height: img.height
        }));
        
        URL.revokeObjectURL(imageUrl);
      };
      
      img.src = imageUrl;
      
      const backgroundUrl = await sceneService.uploadBackground(sceneId!, file);
      setScene(prev => prev ? { ...prev, backgroundUrl: backgroundUrl } : null);
      toast.success('Imagem carregada! Dimensões ajustadas automaticamente.');
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
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
          <p>Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (!scene) return null;

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c1810 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        borderBottom: '2px solid #d4af37',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '2px solid #d4af37',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: '#d4af37',
              cursor: 'pointer',
              fontSize: '1rem',
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
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#d4af37',
            fontFamily: 'Cinzel, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            margin: 0
          }}>
            ⚙️ Editor de Cena
          </h1>
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '0.25rem 0.75rem',
            color: '#d4af37',
            fontSize: '0.9rem'
          }}>
            {scene.name}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowGrid(!showGrid)}
            style={{
              background: showGrid ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' : 'rgba(108, 117, 125, 0.3)',
              border: showGrid ? 'none' : '2px solid #6c757d',
              borderRadius: '8px',
              padding: '0.75rem',
              color: showGrid ? '#1a1a1a' : '#6c757d',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: showGrid ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none'
            }}
            title="Mostrar/Ocultar Grid"
          >
            🔲 Grid
          </button>
          <button
            onClick={() => navigate(`/scenes/${sceneId}/view`)}
            style={{
              background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.3)';
            }}
          >
            👁️ Visualizar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(212, 175, 55, 0.5)' : 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              color: '#1a1a1a',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: saving ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: saving ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
              }
            }}
          >
            💾 {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '350px',
          background: 'rgba(0,0,0,0.6)',
          borderRight: '2px solid rgba(212, 175, 55, 0.3)',
          padding: '2rem',
          overflowY: 'auto',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Informações Básicas */}
            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '1rem',
                fontFamily: 'Cinzel, serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📝 Informações
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#d4af37',
                    marginBottom: '0.5rem'
                  }}>🏷️ Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
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
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#d4af37',
                    marginBottom: '0.5rem'
                  }}>📄 Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
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
              </div>
            </div>

            {/* Imagem de Fundo */}
            <div style={{
              background: 'rgba(74, 144, 226, 0.1)',
              border: '2px solid rgba(74, 144, 226, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#4a90e2',
                marginBottom: '1rem',
                fontFamily: 'Cinzel, serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🖼️ Imagem de Fundo
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: '100%',
                  background: uploading ? 'rgba(74, 144, 226, 0.5)' : 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: 'white',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: uploading ? 'none' : '0 4px 15px rgba(74, 144, 226, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: uploading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.3)';
                  }
                }}
              >
                📁 {uploading ? 'Enviando...' : 'Fazer Upload'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                style={{ display: 'none' }}
              />
              {scene.backgroundUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={`http://localhost:3000${scene.backgroundUrl}`}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid rgba(74, 144, 226, 0.3)'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Configurações do Grid */}
            <div style={{
              background: 'rgba(40, 167, 69, 0.1)',
              border: '2px solid rgba(40, 167, 69, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#28a745',
                marginBottom: '1rem',
                fontFamily: 'Cinzel, serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔲 Grid
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#28a745',
                    marginBottom: '0.5rem'
                  }}>📏 Tamanho (px)</label>
                  <input
                    type="number"
                    value={formData.gridSize}
                    onChange={(e) => setFormData({ ...formData, gridSize: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid rgba(40, 167, 69, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    min="10"
                    max="200"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#28a745',
                    marginBottom: '0.5rem'
                  }}>🎨 Cor</label>
                  <input
                    type="color"
                    value={formData.gridColor}
                    onChange={(e) => setFormData({ ...formData, gridColor: e.target.value })}
                    style={{
                      width: '100%',
                      height: '50px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid rgba(40, 167, 69, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#28a745',
                    marginBottom: '0.5rem'
                  }}>
                    👻 Opacidade: {Math.round(formData.gridOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.gridOpacity}
                    onChange={(e) => setFormData({ ...formData, gridOpacity: parseFloat(e.target.value) })}
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(40, 167, 69, 0.3)',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Dimensões */}
            <div style={{
              background: 'rgba(255, 193, 7, 0.1)',
              border: '2px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#ffc107',
                marginBottom: '1rem',
                fontFamily: 'Cinzel, serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📐 Dimensões
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#ffc107',
                    marginBottom: '0.5rem'
                  }}>↔️ Largura</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid rgba(255, 193, 7, 0.3)',
                      borderRadius: '8px',
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
                    color: '#ffc107',
                    marginBottom: '0.5rem'
                  }}>↕️ Altura</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid rgba(255, 193, 7, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Preview */}
        <div style={{
          flex: 1,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '20px',
            padding: '2rem',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              marginBottom: '1rem',
              textAlign: 'center',
              color: '#d4af37',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              🎭 Preview da Cena
            </div>
            <div
              style={{
                position: 'relative',
                border: '3px solid #d4af37',
                borderRadius: '12px',
                overflow: 'hidden',
                width: Math.min((formData.width || 1920) * 0.4, 600),
                height: Math.min((formData.height || 1080) * 0.4, 400),
                backgroundImage: scene.backgroundUrl ? `url(http://localhost:3000${scene.backgroundUrl})` : 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(212, 175, 55, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(212, 175, 55, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(212, 175, 55, 0.1) 75%)',
                backgroundSize: scene.backgroundUrl ? 'cover' : '20px 20px',
                backgroundPosition: scene.backgroundUrl ? 'center' : '0 0, 0 10px, 10px -10px, -10px 0px',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
              }}
            >
              {showGrid && (
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    opacity: formData.gridOpacity
                  }}
                >
                  <defs>
                    <pattern
                      id="grid"
                      width={(formData.gridSize || 50) * 0.4}
                      height={(formData.gridSize || 50) * 0.4}
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d={`M ${(formData.gridSize || 50) * 0.4} 0 L 0 0 0 ${(formData.gridSize || 50) * 0.4}`}
                        fill="none"
                        stroke={formData.gridColor || '#ffffff'}
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              )}
              
              {!scene.backgroundUrl && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'rgba(212, 175, 55, 0.5)',
                  fontSize: '2rem'
                }}>
                  🗺️
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Sem imagem de fundo
                  </div>
                </div>
              )}
            </div>
            
            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'rgba(212, 175, 55, 0.7)'
            }}>
              📏 {formData.width} × {formData.height} px • 🔲 Grid: {formData.gridSize}px
            </div>
          </div>
        </div>
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

export default SceneEditor;