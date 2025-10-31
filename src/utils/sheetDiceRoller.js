// RF19 - Sistema de rolagem de dados da ficha

// Calcular modificador de atributo (D&D 5e)
export const calculateModifier = (attributeValue) => {
  return Math.floor((attributeValue - 10) / 2);
};

// Processar expressão de dados da ficha (ex: "1d20+FOR", "2d6+STR")
export const parseSheetDiceExpression = (expression, sheetData) => {
  const cleanExpression = expression.trim().toUpperCase();
  
  // Regex para capturar: XdY+ATTR ou XdY-ATTR ou XdY
  const diceRegex = /^(\d+)d(\d+)([+-][A-Z]{3})?$/;
  const match = cleanExpression.match(diceRegex);
  
  if (!match) {
    throw new Error('Formato inválido. Use: XdY+ATTR (ex: 1d20+STR, 2d6+DEX)');
  }
  
  const numDice = parseInt(match[1]);
  const diceSides = parseInt(match[2]);
  const operatorAndAttr = match[3];
  let operator = '+';
  let attributeName = null;
  
  if (operatorAndAttr) {
    operator = operatorAndAttr[0];
    attributeName = operatorAndAttr.slice(1);
  }
  
  // Validações básicas
  if (numDice < 1 || numDice > 20) {
    throw new Error('Número de dados deve ser entre 1 e 20');
  }
  
  if (diceSides < 2 || diceSides > 100) {
    throw new Error('Lados do dado devem ser entre 2 e 100');
  }
  
  let modifier = 0;
  let attributeValue = null;
  
  if (attributeName && sheetData.attributes) {
    // Mapear nomes de atributos comuns
    const attrMap = {
      'STR': 'strength',
      'DEX': 'dexterity', 
      'CON': 'constitution',
      'INT': 'intelligence',
      'WIS': 'wisdom',
      'CHA': 'charisma',
      'FOR': 'strength' // Português
    };
    
    const fullAttrName = attrMap[attributeName] || attributeName.toLowerCase();
    attributeValue = sheetData.attributes[fullAttrName];
    
    if (attributeValue === undefined) {
      throw new Error(`Atributo ${attributeName} não encontrado na ficha`);
    }
    
    const attrModifier = calculateModifier(attributeValue);
    modifier = operator === '+' ? attrModifier : -attrModifier;
  }
  
  return {
    numDice,
    diceSides,
    modifier,
    attributeName,
    attributeValue,
    expression: cleanExpression
  };
};

// Rolar dados da ficha
export const rollSheetDice = (expression, sheetData) => {
  const { numDice, diceSides, modifier, attributeName, attributeValue } = parseSheetDiceExpression(expression, sheetData);
  
  const rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(Math.floor(Math.random() * diceSides) + 1);
  }
  
  const sum = rolls.reduce((total, roll) => total + roll, 0);
  const total = sum + modifier;
  
  let breakdown = rolls.join(' + ');
  if (modifier !== 0) {
    const modifierText = attributeName ? 
      `${modifier >= 0 ? '+' : ''}${modifier} (${attributeName}: ${attributeValue})` :
      `${modifier >= 0 ? '+' : ''}${modifier}`;
    breakdown += ` ${modifierText}`;
  }
  breakdown += ` = ${total}`;
  
  return {
    expression,
    rolls,
    sum,
    modifier,
    total,
    breakdown,
    attributeName,
    attributeValue,
    isSheetRoll: true
  };
};