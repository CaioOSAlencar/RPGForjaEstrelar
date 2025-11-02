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
    if (tool === 'pan') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && tool === 'pan') {
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
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
←
          </button>
          <h1 className="text-xl font-bold text-yellow-400">{scene.name}</h1>
          {scene.description && (
            <span className="text-gray-400 text-sm">• {scene.description}</span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setTool('pan')}
              className={`p-2 rounded ${tool === 'pan' ? 'bg-yellow-600 text-black' : 'text-white hover:bg-gray-600'}`}
              title="Ferramenta de Pan"
            >
              🖱️
            </button>
            <button
              onClick={() => setTool('pointer')}
              className={`p-2 rounded ${tool === 'pointer' ? 'bg-yellow-600 text-black' : 'text-white hover:bg-gray-600'}`}
              title="Ponteiro"
            >
              🖱️
            </button>
          </div>

          <div className="w-px h-8 bg-gray-600"></div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded ${showGrid ? 'bg-yellow-600 text-black' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
            title="Mostrar/Ocultar Grid"
          >
⚏
          </button>

          <div className="w-px h-8 bg-gray-600"></div>

          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            title="Diminuir Zoom"
          >
🔍➖
          </button>
          
          <span className="text-white text-sm min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            title="Aumentar Zoom"
          >
🔍➕
          </button>
          
          <button
            onClick={handleResetView}
            className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            title="Resetar Visualização"
          >
🔄
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: scene.width,
            height: scene.height,
            left: '50%',
            top: '50%',
            marginLeft: -scene.width / 2,
            marginTop: -scene.height / 2
          }}
        >
          {/* Imagem de Fundo */}
          {scene.backgroundImage && (
            <img
              src={scene.backgroundImage}
              alt={scene.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          )}

          {/* Grid */}
          {showGrid && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ opacity: scene.gridOpacity }}
            >
              <defs>
                <pattern
                  id="grid-pattern"
                  width={scene.gridSize}
                  height={scene.gridSize}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${scene.gridSize} 0 L 0 0 0 ${scene.gridSize}`}
                    fill="none"
                    stroke={scene.gridColor}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          )}

          {/* Área de conteúdo da cena */}
          <div className="absolute inset-0 border border-gray-600">
            {/* Aqui serão adicionados tokens, objetos, etc. */}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>Dimensões: {scene.width}x{scene.height}</span>
          <span>Grid: {scene.gridSize}px</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Pan: {Math.round(pan.x)}, {Math.round(pan.y)}</span>
        </div>
      </div>
    </div>
  );
};

export default SceneViewer;