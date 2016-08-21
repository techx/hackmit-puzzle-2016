// imports
var grammarBuilder = require('./language/language-grammar');
var langStructure = require('./language/language-structure');
var Interpreter = new require('./language/interpreter');

// language imports
var UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3, PAUSE = 4;
function queueMovement(q, direction) {
  switch (direction) {
    case UP:
      q.push([-1, 0]);
      break;
    case RIGHT:
      q.push([0, 1]);
      break;
    case DOWN:
      q.push([1, 0]);
      break;
    case LEFT:
      q.push([0, -1]);
      break;
    case PAUSE:
      q.push([0, 0]);
      break;
    default:
      throw 'ERR: invalid movement direction supplied.';
  }
}
var builtInBuilder = function(queue) {
  return {
    'log': function() {
      return undefined;
    },

    'random': function(n) {
      return Math.floor(n * Math.random());
    },

    'moveUp': function() {
      queueMovement(queue, UP);
      return undefined;
    },

    'moveRight': function() {
      queueMovement(queue, RIGHT);
      return undefined;
    },

    'moveDown': function() {
      queueMovement(queue, DOWN);
      return undefined;
    },

    'dontMove': function() {
      queueMovement(queue, PAUSE);
      return undefined;
    },

    'moveLeft': function() {
      queueMovement(queue, LEFT);
      return undefined;
    },

    'move': function(direction) {
      queueMovement(queue, direction);
      return undefined;
    }
  };
};

function validateLevel(program, level) {
  // set up the interpreter for this validation request
  var queue = [];
  var builtIns = builtInBuilder(queue);
  var langGrammar = grammarBuilder(Object.keys(builtIns));
  var interpreter = new Interpreter.Interpreter(
    langGrammar.grammar,
    langStructure.structure,
    builtIns
  );

  // interpret the program
  try {
    var stats = interpreter.interpret(program, level.limits);
    if (stats.tooMuchCode) return false;

    return movementsSurviveObstacles(
      level.start, queue, level.frames, level.finish
    );
  } catch (e) {
    // sorry bud, no answer for you!
  }

  return false;
}

function movementsSurviveObstacles(start, movements, frames, goal) {
  function addVec(a, b) { return [a[0]+b[0],a[1]+b[1]]; }
  var pos = start;
  for (var f = 1; f < Math.min(frames.length, 1+movements.length); f++) {
    pos = addVec(pos, movements[f-1]);
    if (frames[f][pos[0]][pos[1]] === 1) {
      return false;
    }

    if (pos[0] === goal[0] && pos[1] === goal[1]) {
      return true;
    }
  }
  return false;
}

module.exports = {
  validate: validateLevel
};
