// RF25 - Sistema de medição de distância entre tokens

// Calcular distância euclidiana entre dois pontos
export const calculateEuclideanDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

// Calcular distância Manhattan (grid-based)
export const calculateManhattanDistance = (x1, y1, x2, y2) => {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

// Calcular distância em células do grid
export const calculateGridDistance = (token1, token2, gridSize) => {
  const gridX1 = Math.floor(token1.x / gridSize);
  const gridY1 = Math.floor(token1.y / gridSize);
  const gridX2 = Math.floor(token2.x / gridSize);
  const gridY2 = Math.floor(token2.y / gridSize);
  
  const euclidean = calculateEuclideanDistance(gridX1, gridY1, gridX2, gridY2);
  const manhattan = calculateManhattanDistance(gridX1, gridY1, gridX2, gridY2);
  
  return {
    euclidean: Math.round(euclidean * 100) / 100,
    manhattan: manhattan,
    gridCells: {
      horizontal: Math.abs(gridX2 - gridX1),
      vertical: Math.abs(gridY2 - gridY1)
    }
  };
};

// Converter distância do grid para unidades de jogo
export const convertGridToGameUnits = (gridDistance, gridSize, unitType = 'feet') => {
  const unitsPerGrid = {
    feet: 5,
    meters: 1.5,
    squares: 1
  };
  
  const multiplier = unitsPerGrid[unitType] || unitsPerGrid.feet;
  
  return {
    euclidean: Math.round(gridDistance.euclidean * multiplier * 100) / 100,
    manhattan: gridDistance.manhattan * multiplier,
    unit: unitType
  };
};