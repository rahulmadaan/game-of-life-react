const repeat = function(symbol, length) {
  return new Array(length).fill(symbol).join("");
};

const generateDeadCells = function(length) {
  return new Array(length).fill(0);
};

const generateGrid = function(height, length) {
  let board = [];
  for (let count = 0; count < height; count++) {
    board.push(generateDeadCells(length));
  }
  return board;
};

const getNeighboursByIndex = function(inputArray, index) {
  let neighbours = [];
  if (index < 0) {
    return neighbours;
  }
  neighbours.push(inputArray[index - 1]);
  neighbours.push(inputArray[index + 1]);
  return neighbours.filter(x => x !== undefined);
};

const getHorizontalNeighbours = function(
  inputArray,
  arrayIndex,
  subArrayIndex
) {
  return getNeighboursByIndex(inputArray[arrayIndex], subArrayIndex);
};

const getVerticalNeighbours = function(inputArray, arrayIndex, subArrayIndex) {
  let neighbours = [];
  let topNeighbours = inputArray[arrayIndex - 1];
  let bottomNeighbours = inputArray[arrayIndex + 1];

  if (inputArray[1] === undefined) {
    return neighbours;
  }
  if (topNeighbours !== undefined) {
    neighbours.push(topNeighbours[subArrayIndex]);
  }

  if (bottomNeighbours !== undefined) {
    neighbours.push(bottomNeighbours[subArrayIndex]);
  }

  return neighbours;
};

const getAllNeighbours = function(inputArray, arrayIndex, subArrayIndex) {
  let neighbours = [];
  if (arrayIndex < 0 || subArrayIndex < 0 || inputArray.length < 2) {
    return neighbours;
  }

  // horizontal neighbours
  neighbours.push(getNeighboursByIndex(inputArray[arrayIndex], subArrayIndex));

  // top diagonal neighbours
  if (inputArray[arrayIndex - 1] !== undefined) {
    neighbours.push(
      getNeighboursByIndex(inputArray[arrayIndex - 1], subArrayIndex)
    );
  }

  // bottom diagonal neighbours
  if (inputArray[arrayIndex + 1] !== undefined) {
    neighbours.push(
      getNeighboursByIndex(inputArray[arrayIndex + 1], subArrayIndex)
    );
  }

  //vertical neighbours
  neighbours.push(getVerticalNeighbours(inputArray, arrayIndex, subArrayIndex));
  return neighbours
    .toString()
    .split(",")
    .map(x => +x)
    .sort();
};

const countAliveNeighboursOfCell = function(
  inputArray,
  arrayIndex,
  subArrayIndex
) {
  return getAllNeighbours(inputArray, arrayIndex, subArrayIndex).filter(x => x)
    .length;
};

const isAlive = function(aliveNeighbours, currentState) {
  if (aliveNeighbours < 2 || aliveNeighbours > 3) {
    return 0;
  }
  if (aliveNeighbours === 3) {
    return 1;
  }
  return currentState;
};

const runIteration = function(inputArray) {
  let result = inputArray.map(x => x.slice());

  inputArray.forEach((elemOfArray, count) => {
    inputArray[count].forEach((elem, index) => {
      let totalAlive = countAliveNeighboursOfCell(inputArray, count, index);
      let state = isAlive(totalAlive, inputArray[count][index]);
      result[count][index] = state;
    });
  });

  return result;
};

const toggleState = function(inputArray, arrayIndex, subArrayIndex) {
  let result = inputArray.slice();
  let currentState = result[arrayIndex][subArrayIndex];
  currentState = 1 - currentState;
  result[arrayIndex][subArrayIndex] = currentState;
  return result;
};

const world = function(height, length, resurrectCells) {
  let result = generateGrid(height, length);
  let arrayIndex = resurrectCells.map(x => x[0]);
  let subIndex = resurrectCells.map(x => x[1]);
  for (let count = 0; count < arrayIndex.length; count++) {
    result = toggleState(result, arrayIndex[count], subIndex[count]);
  }
  return result;
};

const getCoordOfAliveCells = function(world) {
  let result = [];
  for (let count = 0; count < world.length; count++) {
    for (let index = 0; index < world[count].length; index++) {
      if (world[count][index] === 1) {
        result.push([count, index]);
      }
    }
  }
  return result;
};
const validateOutput = function(bound, aliveCellsCoordinate) {
  let result = aliveCellsCoordinate.map(x => x.slice());

  result = result.map(function(x) {
    return x.map((number, index) => (index === 0 ? number + this : number));
  }, bound.topLeft[0]);

  result = result.map(function(x) {
    return x.map((number, index) => (index === 1 ? number + this : number));
  }, bound.topLeft[1]);

  return result;
};

const validateInput = function(bound, aliveCellsCoordinate) {
  let result = filterValidGeneration(bound, aliveCellsCoordinate);
  result = result.map(x => x.slice());

  result = result.map(function(x) {
    return x.map((number, index) => (index === 0 ? number - this : number));
  }, bound.topLeft[0]);

  result = result.map(function(x) {
    return x.map((number, index) => (index === 1 ? number - this : number));
  }, bound.topLeft[1]);

  return result;
};

const filterValidGeneration = function(bounds, currGeneration) {
  const isValid = function(elem) {
    return elem >= bounds.topLeft[this] && elem <= bounds.bottomRight[this];
  };

  const checkValidHeight = isValid.bind(0);
  const checkValidWidth = isValid.bind(1);

  const checkValidDimensions = function(subArray) {
    return checkValidHeight(subArray[0]) && checkValidWidth(subArray[1]);
  };

  return currGeneration.filter(checkValidDimensions);
};

/* ------- EXPORTS ------- */

module.exports = {
  repeat,
  generateDeadCells,
  generateGrid, //
  getNeighboursByIndex,
  getHorizontalNeighbours,
  getVerticalNeighbours,
  getAllNeighbours,
  countAliveNeighboursOfCell,
  isAlive,
  toggleState,
  runIteration,
  world,
  getCoordOfAliveCells,
  validateInput,
  validateOutput
};
