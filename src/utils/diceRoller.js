// RF20 - Sistema de rolagem de dados
export const parseDiceCommand = (command) => {
  // Remove /roll e espaços extras
  const diceExpression = command.replace(/^\/roll\s+/i, '').trim();
  
  // Regex para capturar: XdY+Z ou XdY-Z ou XdY
  const diceRegex = /^(\d+)d(\d+)([+-]\d+)?$/i;
  const match = diceExpression.match(diceRegex);
  
  if (!match) {
    throw new Error('Formato inválido. Use: /roll XdY+Z (ex: /roll 2d6+3)');
  }
  
  const numDice = parseInt(match[1]);
  const diceSides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;
  
  // Validações
  if (numDice < 1 || numDice > 20) {
    throw new Error('Número de dados deve ser entre 1 e 20');
  }
  
  if (diceSides < 2 || diceSides > 100) {
    throw new Error('Lados do dado devem ser entre 2 e 100');
  }
  
  if (Math.abs(modifier) > 999) {
    throw new Error('Modificador deve ser entre -999 e +999');
  }
  
  return { numDice, diceSides, modifier, expression: diceExpression };
};

export const rollDice = (numDice, diceSides) => {
  const rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(Math.floor(Math.random() * diceSides) + 1);
  }
  return rolls;
};

export const calculateDiceRoll = (command) => {
  const { numDice, diceSides, modifier, expression } = parseDiceCommand(command);
  const rolls = rollDice(numDice, diceSides);
  const sum = rolls.reduce((total, roll) => total + roll, 0);
  const total = sum + modifier;
  
  return {
    expression,
    rolls,
    sum,
    modifier,
    total,
    breakdown: `${rolls.join(' + ')}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''} = ${total}`,
    isPrivate: false
  };
};

export const isDiceCommand = (content) => {
  return /^\/roll\s+\d+d\d+([+-]\d+)?$/i.test(content.trim());
};

// RF21 - Verificar se é comando de rolagem privada
export const isPrivateDiceCommand = (content) => {
  return /^\/w\s+gm\s+\d+d\d+([+-]\d+)?$/i.test(content.trim());
};

// RF21 - Parser para comando de rolagem privada
export const parsePrivateDiceCommand = (command) => {
  // Remove /w gm e espaços extras
  const diceExpression = command.replace(/^\/w\s+gm\s+/i, '').trim();
  
  // Usar o mesmo parser de dados normais
  const { numDice, diceSides, modifier } = parseDiceCommand(`/roll ${diceExpression}`);
  
  return { numDice, diceSides, modifier, expression: diceExpression };
};

// RF21 - Calcular rolagem privada
export const calculatePrivateDiceRoll = (command) => {
  const { numDice, diceSides, modifier, expression } = parsePrivateDiceCommand(command);
  const rolls = rollDice(numDice, diceSides);
  const sum = rolls.reduce((total, roll) => total + roll, 0);
  const total = sum + modifier;
  
  return {
    expression,
    rolls,
    sum,
    modifier,
    total,
    breakdown: `${rolls.join(' + ')}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''} = ${total}`,
    isPrivate: true
  };
};