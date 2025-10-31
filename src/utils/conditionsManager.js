// RF37 - Gerenciador de condições para tokens

// Condições padrão D&D 5e
export const D5E_CONDITIONS = [
  { id: 'blinded', name: 'Cego', icon: '👁️', color: '#666666' },
  { id: 'charmed', name: 'Enfeitiçado', icon: '💖', color: '#ff69b4' },
  { id: 'deafened', name: 'Surdo', icon: '🔇', color: '#8b4513' },
  { id: 'frightened', name: 'Amedrontado', icon: '😨', color: '#800080' },
  { id: 'grappled', name: 'Agarrado', icon: '🤝', color: '#ffa500' },
  { id: 'incapacitated', name: 'Incapacitado', icon: '😵', color: '#ff0000' },
  { id: 'invisible', name: 'Invisível', icon: '👻', color: '#e0e0e0' },
  { id: 'paralyzed', name: 'Paralisado', icon: '🧊', color: '#00bfff' },
  { id: 'petrified', name: 'Petrificado', icon: '🗿', color: '#696969' },
  { id: 'poisoned', name: 'Envenenado', icon: '☠️', color: '#32cd32' },
  { id: 'prone', name: 'Caído', icon: '⬇️', color: '#8b4513' },
  { id: 'restrained', name: 'Contido', icon: '⛓️', color: '#2f4f4f' },
  { id: 'stunned', name: 'Atordoado', icon: '💫', color: '#ffd700' },
  { id: 'unconscious', name: 'Inconsciente', icon: '😴', color: '#4b0082' }
];

// Condições customizadas
export const CUSTOM_CONDITIONS = [
  { id: 'bleeding', name: 'Sangrando', icon: '🩸', color: '#dc143c' },
  { id: 'burning', name: 'Queimando', icon: '🔥', color: '#ff4500' },
  { id: 'frozen', name: 'Congelado', icon: '❄️', color: '#87ceeb' },
  { id: 'blessed', name: 'Abençoado', icon: '✨', color: '#ffd700' },
  { id: 'cursed', name: 'Amaldiçoado', icon: '💀', color: '#8b0000' }
];

// Obter todas as condições disponíveis
export const getAllConditions = () => {
  return [...D5E_CONDITIONS, ...CUSTOM_CONDITIONS];
};

// Obter condição por ID
export const getConditionById = (id) => {
  return getAllConditions().find(condition => condition.id === id);
};

// Validar array de condições
export const validateConditions = (conditions) => {
  if (!Array.isArray(conditions)) {
    return { isValid: false, error: 'Condições devem ser um array' };
  }
  
  const allConditions = getAllConditions();
  const validIds = allConditions.map(c => c.id);
  
  for (const condition of conditions) {
    if (typeof condition === 'string') {
      if (!validIds.includes(condition)) {
        return { isValid: false, error: `Condição '${condition}' não é válida` };
      }
    } else if (typeof condition === 'object') {
      if (!condition.id || !validIds.includes(condition.id)) {
        return { isValid: false, error: `Condição com ID '${condition.id}' não é válida` };
      }
    } else {
      return { isValid: false, error: 'Formato de condição inválido' };
    }
  }
  
  return { isValid: true };
};

// Processar condições para exibição
export const processConditionsForDisplay = (conditions) => {
  if (!conditions) return [];
  
  let conditionsArray = conditions;
  if (typeof conditions === 'string') {
    try {
      conditionsArray = JSON.parse(conditions);
    } catch {
      return [];
    }
  }
  
  if (!Array.isArray(conditionsArray)) return [];
  
  return conditionsArray.map(condition => {
    if (typeof condition === 'string') {
      return getConditionById(condition);
    }
    return condition;
  }).filter(Boolean);
};