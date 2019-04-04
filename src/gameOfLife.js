const {
  runIteration,
  world,
  getCoordOfAliveCells,
  validateInput,
  validateOutput
} = require("./library.js");

const nextGeneration = function(currGeneration, bounds) {
  let result = [];
  let heightOfWorld = bounds.bottomRight[1] - bounds.topLeft[1] + 1;
  let lengthOfWorld = bounds.bottomRight[0] - bounds.topLeft[0] + 1;
  result = world(
    lengthOfWorld,
    heightOfWorld,
    validateInput(bounds, currGeneration)
  );
  result = runIteration(result);
  return validateOutput(bounds, getCoordOfAliveCells(result));
};

export default nextGeneration;
