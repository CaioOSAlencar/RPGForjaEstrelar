import React, { useState, useEffect, useRef } from 'react';
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
  
  // Canvas controls
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'pan' | 'ruler' | 'spell'>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [rulerStart, setRulerStart] = useState<{x: number, y: number} | null>(null);
  const [rulerEnd, setRulerEnd] = useState<{x: number, y: number} | null>(null);
  const [isRulerActive, setIsRulerActive] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [playersMinimized, setPlayersMinimized] = useState(false);
  
  // Measurement system
  const [showMeasurementPanel, setShowMeasurementPanel] = useState(false);
  const [measurementShape, setMeasurementShape] = useState<'ruler' | 'square' | 'cone' | 'circle' | 'beam'>('ruler');
  const [measurementMode, setMeasurementMode] = useState<'temporary' | 'permanent'>('temporary');
  const [permanentMeasurements, setPermanentMeasurements] = useState<Array<{
    id: string;
    shape: string;
    start: {x: number, y: number};
    end: {x: number, y: number};
    distance: number;
  }>>([]);

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

  // Canvas controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleResetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (tool === 'ruler') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && activeScene) {
        // Corrigir cálculo das coordenadas
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        
        // Ajustar para o centro da imagem
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const imageWidth = (activeScene.width || 1920) * zoom;
        const imageHeight = (activeScene.height || 1080) * zoom;
        
        const x = (canvasX - centerX - pan.x + imageWidth / 2) / zoom;
        const y = (canvasY - centerY - pan.y + imageHeight / 2) / zoom;
        
        console.log('Clique na régua:', { x, y, isRulerActive, canvasX, canvasY, pan, zoom });
        
        if (!isRulerActive) {
          setRulerStart({ x, y });
          setRulerEnd({ x, y });
          setIsRulerActive(true);
          console.log('Iniciando medição:', { x, y });
        } else {
          setRulerEnd({ x, y });
          setIsRulerActive(false);
          console.log('Finalizando medição:', { start: rulerStart, end: { x, y } });
          
          // Se for permanente, salvar a medição
          if (measurementMode === 'permanent' && rulerStart) {
            const newMeasurement = {
              id: Date.now().toString(),
              shape: measurementShape,
              start: rulerStart,
              end: { x, y },
              distance: calculateDistance()
            };
            setPermanentMeasurements(prev => [...prev, newMeasurement]);
            console.log('Medição salva:', newMeasurement);
          }
          
          // Se for temporário, limpar instantaneamente
          if (measurementMode === 'temporary') {
            setRulerStart(null);
            setRulerEnd(null);
          }
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && tool === 'pan') {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (isRulerActive && tool === 'ruler') {
      // Quando a régua está ativa, a linha segue o mouse para preview
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && activeScene) {
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const imageWidth = (activeScene.width || 1920) * zoom;
        const imageHeight = (activeScene.height || 1080) * zoom;
        
        const x = (canvasX - centerX - pan.x + imageWidth / 2) / zoom;
        const y = (canvasY - centerY - pan.y + imageHeight / 2) / zoom;
        
        setRulerEnd({ x, y });
      }
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };

  const calculateDistance = (start?: {x: number, y: number}, end?: {x: number, y: number}) => {
    const startPoint = start || rulerStart;
    const endPoint = end || rulerEnd;
    if (!startPoint || !endPoint) return 0;
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const gridSize = activeScene?.gridSize || 50;
    return Math.round((pixelDistance / gridSize) * 5); // 5 pés por quadrado
  };
  
  const removePermanentMeasurement = (id: string) => {
    setPermanentMeasurements(prev => prev.filter(m => m.id !== id));
  };
  
  const clearAllMeasurements = () => {
    setPermanentMeasurements([]);
    setRulerStart(null);
    setRulerEnd(null);
    setIsRulerActive(false);
  };
  
  const renderMeasurementShape = (start: {x: number, y: number}, end: {x: number, y: number}, shape: string, color = '#ff6b6b') => {
    console.log('Renderizando shape:', { start, end, shape, color });
    const distance = calculateDistance(start, end);
    
    switch (shape) {
      case 'ruler':
        // Régua: linha normal sólida
        return (
          <>
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth="4" />
            <circle cx={start.x} cy={start.y} r="8" fill={color} />
            <circle cx={end.x} cy={end.y} r="8" fill={color} />
            <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 15} fill={color} fontSize="16" fontWeight="bold" textAnchor="middle">
              {distance} pés
            </text>
          </>
        );
      
      case 'square':
        // Quadrado: centro fixo, cresce conforme mouse se afasta
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const squareSize = radius * 2;
        return (
          <>
            <rect 
              x={start.x - radius} 
              y={start.y - radius} 
              width={squareSize} 
              height={squareSize} 
              fill="rgba(255, 107, 107, 0.2)" 
              stroke={color} 
              strokeWidth="3" 
            />
            <circle cx={start.x} cy={start.y} r="8" fill={color} />
            <text x={start.x} y={start.y - radius - 15} fill={color} fontSize="16" fontWeight="bold" textAnchor="middle">
              {Math.round(squareSize / ((activeScene?.gridSize || 50) / 5))} pés
            </text>
          </>
        );
      
      case 'circle':
        // Círculo: centro fixo, raio cresce conforme mouse se afasta
        const circleRadius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        return (
          <>
            <circle 
              cx={start.x} 
              cy={start.y} 
              r={circleRadius} 
              fill="rgba(255, 107, 107, 0.2)" 
              stroke={color} 
              strokeWidth="3" 
            />
            <circle cx={start.x} cy={start.y} r="8" fill={color} />
            <text x={start.x} y={start.y - circleRadius - 15} fill={color} fontSize="16" fontWeight="bold" textAnchor="middle">
              {distance} pés raio
            </text>
          </>
        );
      
      case 'cone':
        // Cone: centro fixo, abertura de 60 graus
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const coneLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const coneAngle = Math.PI / 6; // 30 graus cada lado = 60 graus total
        const x1 = start.x + Math.cos(angle - coneAngle) * coneLength;
        const y1 = start.y + Math.sin(angle - coneAngle) * coneLength;
        const x2 = start.x + Math.cos(angle + coneAngle) * coneLength;
        const y2 = start.y + Math.sin(angle + coneAngle) * coneLength;
        return (
          <>
            <path 
              d={`M ${start.x} ${start.y} L ${x1} ${y1} A ${coneLength} ${coneLength} 0 0 1 ${x2} ${y2} Z`} 
              fill="rgba(255, 107, 107, 0.2)" 
              stroke={color} 
              strokeWidth="3" 
            />
            <circle cx={start.x} cy={start.y} r="8" fill={color} />
            <text x={start.x + Math.cos(angle) * (coneLength / 2)} y={start.y + Math.sin(angle) * (coneLength / 2) - 10} fill={color} fontSize="16" fontWeight="bold" textAnchor="middle">
              {distance} pés
            </text>
          </>
        );
      
      case 'beam':
        // Feixe: linha com largura fixa
        const beamLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const beamAngle = Math.atan2(end.y - start.y, end.x - start.x);
        const beamWidth = 30; // largura fixa do feixe
        const perpAngle = beamAngle + Math.PI / 2;
        const bx1 = start.x + Math.cos(perpAngle) * beamWidth;
        const by1 = start.y + Math.sin(perpAngle) * beamWidth;
        const bx2 = start.x - Math.cos(perpAngle) * beamWidth;
        const by2 = start.y - Math.sin(perpAngle) * beamWidth;
        const bx3 = end.x - Math.cos(perpAngle) * beamWidth;
        const by3 = end.y - Math.sin(perpAngle) * beamWidth;
        const bx4 = end.x + Math.cos(perpAngle) * beamWidth;
        const by4 = end.y + Math.sin(perpAngle) * beamWidth;
        return (
          <>
            <path 
              d={`M ${bx1} ${by1} L ${bx4} ${by4} L ${bx3} ${by3} L ${bx2} ${by2} Z`} 
              fill="rgba(255, 107, 107, 0.2)" 
              stroke={color} 
              strokeWidth="3" 
            />
            <circle cx={start.x} cy={start.y} r="8" fill={color} />
            <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 15} fill={color} fontSize="16" fontWeight="bold" textAnchor="middle">
              {distance} pés
            </text>
          </>
        );
      
      default:
        return (
          <>
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth="4" />
            <circle cx={start.x} cy={start.y} r="8" fill={color} />
            <circle cx={end.x} cy={end.y} r="8" fill={color} />
          </>
        );
    }
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
          width: chatMinimized ? '50px' : '300px',
          background: 'rgba(0,0,0,0.8)',
          borderRight: '2px solid rgba(212, 175, 55, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease'
        }}>
          <div style={{
            padding: '0.5rem',
            borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {!chatMinimized && (
              <h3 style={{ 
                color: '#d4af37', 
                margin: 0, 
                fontSize: '1rem',
                fontFamily: 'Cinzel, serif'
              }}>
                💬 Chat
              </h3>
            )}
            <button
              onClick={() => setChatMinimized(!chatMinimized)}
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                padding: '0.25rem',
                color: '#d4af37',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
              title={chatMinimized ? 'Expandir Chat' : 'Minimizar Chat'}
            >
              {chatMinimized ? '💬' : '➖'}
            </button>
          </div>
          
          {!chatMinimized && (
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
          )}
          
          {!chatMinimized && (
            <form onSubmit={handleSendMessage} style={{
              padding: '0.5rem',
              borderTop: '2px solid rgba(212, 175, 55, 0.3)',
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
          )}
        </div>

        {/* Main Canvas Area */}
        <div 
          ref={canvasRef}
          style={{
            flex: 1,
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
            position: 'relative',
            overflow: 'hidden',
            cursor: tool === 'pan' ? (isDragging ? 'grabbing' : 'grab') : 
                   tool === 'ruler' ? 'crosshair' : 'default'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {activeScene && (
            <div style={{
              position: 'absolute',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              left: '50%',
              top: '50%',
              marginLeft: -(activeScene.width || 1920) / 2,
              marginTop: -(activeScene.height || 1080) / 2
            }}>
              {/* Background Image */}
              {activeScene.backgroundUrl && (
                <img
                  src={`http://localhost:3000${activeScene.backgroundUrl}`}
                  alt={activeScene.name}
                  style={{
                    display: 'block',
                    width: activeScene.width || 1920,
                    height: activeScene.height || 1080,
                    pointerEvents: 'none'
                  }}
                  draggable={false}
                />
              )}
              
              {/* Grid */}
              {showGrid && (
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: activeScene.width || 1920,
                    height: activeScene.height || 1080,
                    pointerEvents: 'none',
                    opacity: activeScene.gridOpacity || 0.3
                  }}
                >
                  <defs>
                    <pattern
                      id="game-grid"
                      width={activeScene.gridSize || 50}
                      height={activeScene.gridSize || 50}
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d={`M ${activeScene.gridSize || 50} 0 L 0 0 0 ${activeScene.gridSize || 50}`}
                        fill="none"
                        stroke={activeScene.gridColor || '#ffffff'}
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#game-grid)" />
                </svg>
              )}
              
              {/* Measurements */}
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: activeScene.width || 1920,
                  height: activeScene.height || 1080,
                  pointerEvents: 'none',
                  zIndex: 1000
                }}
              >
                {/* Linha de teste sempre visível */}
                <line x1="100" y1="100" x2="300" y2="300" stroke="yellow" strokeWidth="8" />
                <circle cx="100" cy="100" r="10" fill="yellow" />
                <circle cx="300" cy="300" r="10" fill="yellow" />
                <text x="200" y="190" fill="yellow" fontSize="20" fontWeight="bold" textAnchor="middle">
                  TESTE
                </text>
                
                {/* Current measurement */}
                {rulerStart && rulerEnd && (
                  <g>
                    {renderMeasurementShape(rulerStart, rulerEnd, measurementShape, '#ff6b6b')}
                  </g>
                )}
                
                {/* Permanent measurements */}
                {permanentMeasurements.map((measurement, index) => (
                  <g key={`perm-${index}`}>
                    {renderMeasurementShape(measurement.start, measurement.end, measurement.shape, '#00ff00')}
                  </g>
                ))}
              </svg>
            </div>
          )}
          {/* Scene Info */}
          {activeScene && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.8)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#d4af37',
              fontSize: '0.9rem',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              zIndex: 100
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>🗺️ {activeScene.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(212, 175, 55, 0.7)' }}>
                📐 {activeScene.width || 1920}×{activeScene.height || 1080} • 🔲 {activeScene.gridSize || 50}px
              </div>
            </div>
          )}
          
          {/* Floating Toolbar */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.9)',
            borderRadius: '12px',
            padding: '0.5rem',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            zIndex: 100,
            display: 'flex',
            gap: '0.25rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            {/* Tools */}
            {[
              { id: 'select', icon: '🖱️', title: 'Selecionar' },
              { id: 'pan', icon: '✋', title: 'Mover Câmera' },
              { id: 'ruler', icon: '📏', title: 'Medição' },
              { id: 'spell', icon: '✨', title: 'Área de Magia' }
            ].map((toolItem) => (
              <button
                key={toolItem.id}
                onClick={() => {
                  setTool(toolItem.id as any);
                  if (toolItem.id === 'ruler') {
                    setShowMeasurementPanel(true);
                  } else {
                    setShowMeasurementPanel(false);
                  }
                }}
                title={toolItem.title}
                style={{
                  background: tool === toolItem.id ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' : 'rgba(212, 175, 55, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  color: tool === toolItem.id ? '#1a1a1a' : '#d4af37',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {toolItem.icon}
              </button>
            ))}
            
            <div style={{ width: '1px', height: '36px', background: 'rgba(212, 175, 55, 0.3)', margin: '0 0.25rem' }}></div>
            
            {/* Grid Toggle */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              title="Grid"
              style={{
                background: showGrid ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'rgba(40, 167, 69, 0.2)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                color: showGrid ? 'white' : '#28a745',
                cursor: 'pointer',
                fontSize: '1rem',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              🔲
            </button>
          </div>
          
          {/* Zoom Controls */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.9)',
            borderRadius: '12px',
            padding: '0.5rem',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            <button onClick={handleZoomIn} title="Zoom +" style={{
              background: 'rgba(74, 144, 226, 0.2)', border: 'none', borderRadius: '6px',
              padding: '0.5rem', color: '#4a90e2', cursor: 'pointer', fontSize: '1rem',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>🔍➕</button>
            
            <div style={{
              background: 'rgba(212, 175, 55, 0.1)', borderRadius: '6px',
              padding: '0.25rem', color: '#d4af37', fontSize: '0.7rem',
              textAlign: 'center', fontWeight: 'bold', width: '36px'
            }}>
              {Math.round(zoom * 100)}%
            </div>
            
            <button onClick={handleZoomOut} title="Zoom -" style={{
              background: 'rgba(74, 144, 226, 0.2)', border: 'none', borderRadius: '6px',
              padding: '0.5rem', color: '#4a90e2', cursor: 'pointer', fontSize: '1rem',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>🔍➖</button>
            
            <button onClick={handleResetView} title="Reset" style={{
              background: 'rgba(255, 193, 7, 0.2)', border: 'none', borderRadius: '6px',
              padding: '0.5rem', color: '#ffc107', cursor: 'pointer', fontSize: '1rem',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>🔄</button>
          </div>
          
          {/* Measurement Panel */}
          {showMeasurementPanel && (
            <div style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
              background: 'rgba(0,0,0,0.95)',
              borderRadius: '12px',
              padding: '1rem',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              minWidth: '200px'
            }}>
              <div style={{ color: '#d4af37', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1rem' }}>
                📏 Ferramentas de Medição
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ color: '#d4af37', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Forma:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                  {[
                    { id: 'ruler', icon: '📏', name: 'Régua' },
                    { id: 'square', icon: '⬜', name: 'Quadrado' },
                    { id: 'circle', icon: '⭕', name: 'Círculo' },
                    { id: 'cone', icon: '📐', name: 'Cone' },
                    { id: 'beam', icon: '➡️', name: 'Feixe' }
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setMeasurementShape(shape.id as any)}
                      style={{
                        background: measurementShape === shape.id ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' : 'rgba(212, 175, 55, 0.2)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem',
                        color: measurementShape === shape.id ? '#1a1a1a' : '#d4af37',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {shape.icon} {shape.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ color: '#d4af37', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Modo:</div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    onClick={() => setMeasurementMode('temporary')}
                    style={{
                      background: measurementMode === 'temporary' ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)' : 'rgba(255, 107, 107, 0.2)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      color: measurementMode === 'temporary' ? 'white' : '#ff6b6b',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      flex: 1
                    }}
                  >
                    ⏱️ Temporário
                  </button>
                  <button
                    onClick={() => setMeasurementMode('permanent')}
                    style={{
                      background: measurementMode === 'permanent' ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'rgba(40, 167, 69, 0.2)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      color: measurementMode === 'permanent' ? 'white' : '#28a745',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      flex: 1
                    }}
                  >
                    📌 Permanente
                  </button>
                </div>
              </div>
              
              {permanentMeasurements.length > 0 && (
                <div>
                  <div style={{ color: '#d4af37', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Medições Salvas:</div>
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {permanentMeasurements.map((measurement) => (
                      <div key={measurement.id} style={{
                        background: 'rgba(0, 255, 0, 0.1)',
                        borderRadius: '4px',
                        padding: '0.25rem',
                        marginBottom: '0.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#00ff00', fontSize: '0.7rem' }}>
                          {measurement.shape} - {measurement.distance}pés
                        </span>
                        <button
                          onClick={() => removePermanentMeasurement(measurement.id)}
                          style={{
                            background: 'rgba(255, 0, 0, 0.3)',
                            border: 'none',
                            borderRadius: '2px',
                            padding: '0.1rem 0.25rem',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            fontSize: '0.6rem'
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={clearAllMeasurements}
                    style={{
                      background: 'rgba(255, 0, 0, 0.3)',
                      border: '1px solid #ff6b6b',
                      borderRadius: '4px',
                      padding: '0.25rem',
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      width: '100%',
                      marginTop: '0.25rem'
                    }}
                  >
                    🗑️ Limpar Tudo
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Debug Info */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.9)',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            color: '#ffffff',
            fontSize: '0.8rem',
            border: '2px solid #ffffff',
            zIndex: 100,
            fontWeight: 'bold',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            Tool: {tool}<br/>
            RulerActive: {isRulerActive ? 'Sim' : 'Não'}<br/>
            Start: {rulerStart ? `${Math.round(rulerStart.x)},${Math.round(rulerStart.y)}` : 'null'}<br/>
            End: {rulerEnd ? `${Math.round(rulerEnd.x)},${Math.round(rulerEnd.y)}` : 'null'}<br/>
            Permanentes: {permanentMeasurements.length}
          </div>
          
          {/* Close measurement panel when clicking outside */}
          {showMeasurementPanel && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 50
              }}
              onClick={() => setShowMeasurementPanel(false)}
            />
          )}
          
          {!activeScene && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'rgba(212, 175, 55, 0.7)'
            }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</h2>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Mesa de Jogo</h3>
              <p style={{ fontSize: '1rem', opacity: 0.8 }}>
                {isMaster 
                  ? 'Crie uma cena para começar a jogar'
                  : 'Aguardando o mestre preparar a cena...'}
              </p>
            </div>
          )}
        </div>

        {/* Players Sidebar */}
        <div style={{
          width: playersMinimized ? '50px' : '250px',
          background: 'rgba(0,0,0,0.8)',
          borderLeft: '2px solid rgba(212, 175, 55, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease'
        }}>
          <div style={{
            padding: '0.5rem',
            borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={() => setPlayersMinimized(!playersMinimized)}
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                padding: '0.25rem',
                color: '#d4af37',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
              title={playersMinimized ? 'Expandir Jogadores' : 'Minimizar Jogadores'}
            >
              {playersMinimized ? '👥' : '➖'}
            </button>
            {!playersMinimized && (
              <h3 style={{ 
                color: '#d4af37', 
                margin: 0, 
                fontSize: '1rem',
                fontFamily: 'Cinzel, serif'
              }}>
                👥 Jogadores
              </h3>
            )}
          </div>
          
          {!playersMinimized && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTable;