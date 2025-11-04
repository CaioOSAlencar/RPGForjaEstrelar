import React, { useState, useEffect } from 'react';
import { tokenService } from '../services/tokenService';

interface Token {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  campaignId: string;
}

interface TokenLibraryProps {
  campaignId: string;
  sceneId?: string;
  onTokenSelect: (token: Token) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TokenLibrary: React.FC<TokenLibraryProps> = ({
  campaignId,
  sceneId,
  onTokenSelect,
  isOpen,
  onClose
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  
  // Todos os participantes podem fazer upload de tokens
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isOpen) {
      loadTokens();
    }
  }, [isOpen, campaignId]);

  const loadTokens = async () => {
    try {
      const data = await tokenService.getTokens(campaignId);
      setTokens(data);
    } catch (error) {
      console.error('Erro ao carregar tokens:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 Iniciando upload do arquivo:', file.name, 'Tamanho:', file.size);
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('❌ Por favor, selecione apenas arquivos de imagem!');
      return;
    }
    
    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Arquivo muito grande! Máximo 10MB.');
      return;
    }

    setUploading(true);
    try {
      console.log('🚀 Enviando para campaignId:', campaignId, 'sceneId:', sceneId);
      console.log('👤 Usuário atual:', JSON.parse(localStorage.getItem('user') || '{}'));
      const newToken = await tokenService.uploadToken(campaignId, file, sceneId);
      console.log('✅ Token criado com sucesso:', newToken);
      setTokens(prev => [...prev, newToken]);
      alert('✅ Token enviado com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro detalhado no upload:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      alert(`❌ Erro no upload: ${errorMessage}`);
    } finally {
      setUploading(false);
      // Limpar o input para permitir upload do mesmo arquivo novamente
      event.target.value = '';
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      await tokenService.deleteToken(tokenId);
      setTokens(prev => prev.filter(t => t.id !== tokenId));
    } catch (error) {
      console.error('Erro ao deletar token:', error);
    }
  };

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(44, 24, 16, 0.95) 100%)',
        borderRadius: '16px',
        width: '85%',
        height: '85%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        border: '3px solid #d4af37',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(212, 175, 55, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            color: '#d4af37',
            margin: 0,
            fontSize: '1.5rem',
            fontFamily: 'Cinzel, serif',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}>
            🎭 Biblioteca de Tokens
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(220, 53, 69, 0.2)',
              border: '2px solid #dc3545',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.5rem',
          borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(212, 175, 55, 0.6)',
              fontSize: '1.1rem'
            }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar tokens mágicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' 
                  ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' 
                  : 'rgba(212, 175, 55, 0.2)',
                border: '2px solid #d4af37',
                borderRadius: '8px',
                padding: '0.75rem',
                color: viewMode === 'grid' ? '#1a1a1a' : '#d4af37',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                minWidth: '50px'
              }}
            >
              🗄️
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' 
                  ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' 
                  : 'rgba(212, 175, 55, 0.2)',
                border: '2px solid #d4af37',
                borderRadius: '8px',
                padding: '0.75rem',
                color: viewMode === 'list' ? '#1a1a1a' : '#d4af37',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                minWidth: '50px'
              }}
            >
              📋
            </button>
          </div>

          <label style={{
            background: uploading 
              ? 'rgba(108, 117, 125, 0.3)' 
              : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            border: '2px solid #28a745',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            color: uploading ? '#6c757d' : '#ffffff',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📁 {uploading ? 'Enviando...' : 'Upload Token'}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Token Grid/List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          background: 'rgba(0, 0, 0, 0.1)'
        }}>
          {filteredTokens.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'rgba(212, 175, 55, 0.6)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Nenhum token encontrado</h3>
              <p style={{ fontSize: '1rem' }}>
                {searchTerm ? 'Tente uma busca diferente' : 'Faça upload do primeiro token para começar'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredTokens.map(token => (
                <div
                  key={token.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => onTokenSelect(token)}
                >
                  <div style={{
                    aspectRatio: '1',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    overflow: 'hidden',
                    border: '2px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <img
                      src={token.imageUrl}
                      alt={token.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: '#d4af37',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>{token.name || 'Token sem nome'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteToken(token.id);
                      }}
                      style={{
                        background: 'rgba(220, 53, 69, 0.2)',
                        border: '1px solid #dc3545',
                        borderRadius: '6px',
                        padding: '0.25rem 0.5rem',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        marginLeft: '0.5rem',
                        opacity: 0.7,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredTokens.map(token => (
                <div
                  key={token.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => onTokenSelect(token)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid rgba(212, 175, 55, 0.2)',
                    flexShrink: 0
                  }}>
                    <img
                      src={token.imageUrl}
                      alt={token.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#d4af37',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      marginBottom: '0.25rem'
                    }}>{token.name || 'Token sem nome'}</div>
                    <div style={{
                      color: 'rgba(212, 175, 55, 0.7)',
                      fontSize: '0.9rem'
                    }}>📐 {token.width}×{token.height} quadrados</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteToken(token.id);
                    }}
                    style={{
                      background: 'rgba(220, 53, 69, 0.2)',
                      border: '2px solid #dc3545',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      opacity: 0.7,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};