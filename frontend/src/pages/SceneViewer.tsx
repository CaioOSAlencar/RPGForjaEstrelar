import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sceneService, Scene } from '../services/sceneService';
import { toast } from 'react-toastify';

const SceneViewer: React.FC = () => {
  const { sceneId } = useParams<{ sceneId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Controles de visualização
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'pan' | 'pointer'>('pan');

  useEffect(() => {
    if (sceneId) {
      loadScene();
    }
  }, [sceneId]);

  const loadScene = async () => {
    try {
      const data = await sceneService.getScene(sceneId!);
      console.log('Cena carregada:', data);
      console.log('Background URL:', data.backgroundUrl);
      setScene(data);
    } catch (error) {
      toast.error('Erro ao carregar cena');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
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
            🎭 {scene.name}
          </h1>
          {scene.description && (
            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              padding: '0.25rem 0.75rem',
              color: '#d4af37',
              fontSize: '0.9rem'
            }}>
              {scene.description}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>


          <button
            onClick={() => setShowGrid(!showGrid)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: showGrid ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'rgba(40, 167, 69, 0.2)',
              color: showGrid ? 'white' : '#28a745',
              border: showGrid ? 'none' : '2px solid #28a745',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            title="Mostrar/Ocultar Grid"
          >
            🔲 Grid
          </button>

          <div style={{ width: '2px', height: '2rem', background: 'rgba(212, 175, 55, 0.3)' }}></div>

          <button
            onClick={handleZoomOut}
            style={{
              padding: '0.75rem',
              background: 'rgba(74, 144, 226, 0.2)',
              border: '2px solid #4a90e2',
              borderRadius: '8px',
              color: '#4a90e2',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            title="Diminuir Zoom"
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#4a90e2';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(74, 144, 226, 0.2)';
              e.currentTarget.style.color = '#4a90e2';
            }}
          >
            🔍➖
          </button>
          
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: '#d4af37',
            fontSize: '1rem',
            fontWeight: 'bold',
            minWidth: '80px',
            textAlign: 'center'
          }}>
            {Math.round(zoom * 100)}%
          </div>
          
          <button
            onClick={handleZoomIn}
            style={{
              padding: '0.75rem',
              background: 'rgba(74, 144, 226, 0.2)',
              border: '2px solid #4a90e2',
              borderRadius: '8px',
              color: '#4a90e2',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            title="Aumentar Zoom"
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#4a90e2';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(74, 144, 226, 0.2)';
              e.currentTarget.style.color = '#4a90e2';
            }}
          >
            🔍➕
          </button>
          
          <button
            onClick={handleResetView}
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255, 193, 7, 0.2)',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              color: '#ffc107',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            title="Resetar Visualização"
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ffc107';
              e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 193, 7, 0.2)';
              e.currentTarget.style.color = '#ffc107';
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          style={{
            position: 'relative',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            width: 'auto',
            height: 'auto',
            maxWidth: '90vw',
            maxHeight: '90vh',
            border: '3px solid #d4af37',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)'
          }}
        >
          {/* Imagem de Fundo */}
          {scene.backgroundUrl ? (
            <img
              src={`http://localhost:3000${scene.backgroundUrl}`}
              alt={scene.name}
              style={{
                display: 'block',
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                pointerEvents: 'none'
              }}
              draggable={false}
              onLoad={() => console.log('Imagem carregada com sucesso!')}
              onError={(e) => {
                console.error('ERRO ao carregar imagem:', `http://localhost:3000${scene.backgroundUrl}`);
                console.error('Evento de erro:', e);
              }}
            />
          ) : (
            <div style={{
              width: scene.width || 1920,
              height: scene.height || 1080,
              background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(212, 175, 55, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(212, 175, 55, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(212, 175, 55, 0.1) 75%)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center', color: 'rgba(212, 175, 55, 0.7)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Cinzel, serif' }}>Sem imagem de fundo</div>
                <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.7 }}>Faça upload de uma imagem no editor</div>
              </div>
            </div>
          )}

          {/* Grid */}
          {showGrid && scene.backgroundUrl && (
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: scene.gridOpacity || 0.3
              }}
            >
              <defs>
                <pattern
                  id="grid-pattern"
                  width={scene.gridSize || 50}
                  height={scene.gridSize || 50}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${scene.gridSize || 50} 0 L 0 0 0 ${scene.gridSize || 50}`}
                    fill="none"
                    stroke={scene.gridColor || '#ffffff'}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          )}


        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        borderTop: '2px solid rgba(212, 175, 55, 0.3)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        color: 'rgba(212, 175, 55, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span>📏 Dimensões: {scene.width || 1920}x{scene.height || 1080}</span>
          <span>🔲 Grid: {scene.gridSize || 50}px</span>
          <span>🎨 Ferramenta: Pan & Zoom</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span>🔍 Zoom: {Math.round(zoom * 100)}%</span>
          <span>📍 Pan: {Math.round(pan.x)}, {Math.round(pan.y)}</span>
        </div>
      </div>
    </div>
  );
};

export default SceneViewer;