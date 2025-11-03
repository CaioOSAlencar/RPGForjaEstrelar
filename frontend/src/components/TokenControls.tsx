import React, { useState } from 'react';
import { MapToken } from '../services/tokenService';

interface TokenControlsProps {
  token: MapToken;
  onUpdate: (updates: Partial<MapToken>) => void;
  onDelete: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export const TokenControls: React.FC<TokenControlsProps> = ({
  token,
  onUpdate,
  onDelete,
  isVisible,
  onClose
}) => {
  const [hp, setHp] = useState(token.hp);
  const [maxHp, setMaxHp] = useState(token.maxHp);
  const [conditions, setConditions] = useState<string[]>(token.conditions || []);

  const commonConditions = [
    'Cego', 'Surdo', 'Paralisado', 'Envenenado', 'Amedrontado',
    'Caído', 'Inconsciente', 'Concentração', 'Invisível', 'Voando'
  ];

  const handleHpChange = (newHp: number) => {
    const validHp = Math.max(0, Math.min(newHp, maxHp));
    setHp(validHp);
    onUpdate({ hp: validHp });
  };

  const handleMaxHpChange = (newMaxHp: number) => {
    const validMaxHp = Math.max(1, newMaxHp);
    setMaxHp(validMaxHp);
    if (hp > validMaxHp) {
      setHp(validMaxHp);
      onUpdate({ maxHp: validMaxHp, hp: validMaxHp });
    } else {
      onUpdate({ maxHp: validMaxHp });
    }
  };

  const toggleCondition = (condition: string) => {
    const newConditions = conditions.includes(condition)
      ? conditions.filter(c => c !== condition)
      : [...conditions, condition];
    
    setConditions(newConditions);
    onUpdate({ conditions: newConditions });
  };

  const toggleVisibility = () => {
    onUpdate({ visible: !token.visible });
  };

  const rotateToken = () => {
    const newRotation = (token.rotation + 90) % 360;
    onUpdate({ rotation: newRotation });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{token.name || token.token?.name || 'Token'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Token Image */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600">
            <img
              src={token.imageUrl || token.token?.imageUrl || 'https://via.placeholder.com/80x80?text=Token'}
              alt={token.name || token.token?.name || 'Token'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* HP Controls */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ❤️ Pontos de Vida
          </label>
          
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={hp}
              onChange={(e) => handleHpChange(Number(e.target.value))}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
              min="0"
              max={maxHp}
            />
            <span className="text-gray-400">/</span>
            <input
              type="number"
              value={maxHp}
              onChange={(e) => handleMaxHpChange(Number(e.target.value))}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
              min="1"
            />
          </div>

          {/* HP Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                hp > maxHp * 0.5 ? 'bg-green-500' :
                hp > maxHp * 0.25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(hp / maxHp) * 100}%` }}
            />
          </div>

          {/* Quick HP Buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => handleHpChange(hp - 5)}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
            >
              -5
            </button>
            <button
              onClick={() => handleHpChange(hp - 1)}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
            >
              -1
            </button>
            <button
              onClick={() => handleHpChange(hp + 1)}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
            >
              +1
            </button>
            <button
              onClick={() => handleHpChange(hp + 5)}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
            >
              +5
            </button>
            <button
              onClick={() => handleHpChange(maxHp)}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
            >
              Max
            </button>
          </div>
        </div>

        {/* Conditions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🛡️ Condições
          </label>
          
          <div className="grid grid-cols-2 gap-1">
            {commonConditions.map(condition => (
              <button
                key={condition}
                onClick={() => toggleCondition(condition)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  conditions.includes(condition)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={toggleVisibility}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors ${
              token.visible
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {token.visible ? '👁️' : '🙈'}
            {token.visible ? ' Visível' : ' Oculto'}
          </button>
          
          <button
            onClick={rotateToken}
            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
            title="Rotacionar 90°"
          >
            🔄
          </button>
          
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            title="Remover Token"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};