// RF36 - Cálculo automático de modificadores

// Calcular modificador D&D 5e
export const calculateD5eModifier = (attributeValue) => {
  return Math.floor((attributeValue - 10) / 2);
};

// Calcular modificador Call of Cthulhu (percentual)
export const calculateCoCModifier = (attributeValue) => {
  return Math.floor(attributeValue / 5);
};

// Calcular modificador Cyberpunk RED
export const calculateCyberpunkModifier = (attributeValue) => {
  const modifiers = {
    2: -4, 3: -3, 4: -2, 5: -1, 6: 0, 7: 0, 8: 1, 9: 1, 10: 2
  };
  return modifiers[attributeValue] || 0;
};

// Calcular todos os modificadores de uma ficha
export const calculateAllModifiers = (sheetData, systemName = 'D&D 5e') => {
  if (!sheetData.attributes) return {};

  const modifiers = {};
  
  for (const [attrName, attrValue] of Object.entries(sheetData.attributes)) {
    switch (systemName) {
      case 'D&D 5e':
      case 'Tormenta20':
        modifiers[attrName] = calculateD5eModifier(attrValue);
        break;
      case 'Call of Cthulhu':
        modifiers[attrName] = calculateCoCModifier(attrValue);
        break;
      case 'Cyberpunk RED':
        modifiers[attrName] = calculateCyberpunkModifier(attrValue);
        break;
      default:
        modifiers[attrName] = calculateD5eModifier(attrValue);
    }
  }
  
  return modifiers;
};

// Atualizar ficha com modificadores calculados
export const addModifiersToSheet = (sheetData, systemName = 'D&D 5e') => {
  const modifiers = calculateAllModifiers(sheetData, systemName);
  
  return {
    ...sheetData,
    modifiers: modifiers
  };
};