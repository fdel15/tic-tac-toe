var human, computer;
var currentPlayer;
var players = [human, computer];
var board = new Array(9);

$(document).ready(newGame)

/* ***************
Game Setup
******************/

function newGame() {
  $('#newGame').modal('show')

  $('.squares li').on('click', function(event){
    var square = $(event.target)
    if(marked(square)) { return; }
    makeMove(square, human);
    if( gameOver() ) { return endGame(); }
    computerTurn();
  })

}

$(document).on('click', '#playerX', function(event) {
    event.preventDefault();
    human = 'x';
    computer = 'o';
  })

  $(document).on('click', '#playerO', function() {
    human = 'o';
    computer = 'x';
    computerTurn();
  })

/* ***************
GamePlay
******************/

function indexOfSquare(square) {
  return parseInt(square.attr('id').slice(-1));
}

function updateBoard(square, player, state, index) {
  state = state || board
  if (typeof square === 'object') { index = indexOfSquare(square) }
  state[index] = player;
  return state;
}

function markSquare(square, player) {
  square.addClass('marked');
  square.addClass(player);
}

function makeMove(square, sign) {
  markSquare(square, sign);
  updateBoard(square, sign);
}

function changeTurn() {
  currentPlayer = players.shift()
  players.push(currentPlayer)
}

function computerTurn() {
  var move = maxMove(board, computer)
  var square = $('#sq' + move)
  makeMove(square, computer);
  if( gameOver() ) { return endGame(); }
}

function endGame() {
  $('.squares li').off('click');
  var winner = gameWon() || 'draw';
  $('.squares li').addClass('animated infinite bounce')
  setTimeout(clearBoard, 4000)
}

function clearBoard() {
  $('.squares li').each(function(){
    $(this).removeClass('marked x o')
  })
  $('.squares li').removeClass('animated infinite bounce')
  board = new Array(9);
  newGame();
}

/* ***************
Mini-Max Algo
******************/

function maxMove(state, player, depth) {
  var moves = possibleMoves(state);
  var opponent = other(player);
  var scores = [];
  var i;
  depth = depth || 0;

  for (i = 0; i < moves.length; i++ ) {
    var temp = state.slice(0);
    var score;
    updateBoard('_', player, temp, moves[i]);
    score = scoreMove(temp, player);
    if(! score) {
      score = minMove(temp, opponent, depth + 1)
    }
    scores.push(score)
  }
  if(depth === 0) { return bestMove(scores, moves) }
  return Math.max(...scores)
}

function bestMove(scores, moves) {
  var max = Math.max(...scores)
  var index = scores.indexOf(max)
  return moves[index]
}

function minMove(state, player, depth) {
  var moves = possibleMoves(state);
  var opponent = other(player);
  var scores = [];
  var i;

  for (i = 0; i < moves.length; i++ ) {
    var temp = state.slice(0);
    var score;
    updateBoard('_', player, temp, moves[i]);
    score = scoreMove(temp, player);
    if(! score) {
      score = maxMove(temp, opponent, depth + 1)
    }
    scores.push(score)
  }
  return Math.min(...scores)
}


function other(player) {
  if (player === human ) { return computer }
  return human
}

function possibleMoves(state) {
  var arr = [];
  var i;
  for (i = 0; i < state.length; i++ ) {
    if(state[i] === undefined ) { arr.push(i) }
  }
  return arr;
}

function scoreMove(state, player) {
  var result;
  if (gameWon(state)) {
    if(player === computer ) {
      result = 10
    } else {
      result = -10
    }
  }
  else if (fullBoard(state)) {
    result = -5
  }
  return result;
}


/* ***************
   Board Check
******************/

function gameOver() {
  return gameWon() || fullBoard()
}


function gameWon(state) {
  state = state || board
  var winner = rowWin(state) || colWin(state) || diagWin(state)
  return winner;
}

function fullBoard(state) {
  var full = true;
  var i;
  state = state || board
  for(i = 0; i < state.length; i++) {
    if( state[i] === undefined ) { full = false; break; }
  }
  return full;
}

function rowWin(state) {
  state = state || board
  var winner;
  var i;
  for(i = 0; i < state.length; i += 3) {
    if(state[i] !== undefined && state[i] === state[i+1] && state[i] === state[i + 2]) {
      winner = state[i];
      break;
    }
  }
  return winner
}

function colWin(state) {
  state = state || board
   var winner;
  var i;
  for(i = 0; i <= 3; i++) {
    if(state[i] !== undefined && state[i] === state[i+3] && state[i] === state[i + 6]) {
      winner = state[i];
      break;
    }
  }
  return winner
}

function diagWin(state) {
  state = state || board
  var winner;
  if(state[0] !== undefined && state[0] === state[4] && state[0] === state[8]) {
      winner = state[0];}
  else if (state[2] !== undefined && state[2] === state[4] && state[2] === state[6]) {
      winner = state[2]
  }
  return winner
}

function marked(square) {
  return square.hasClass('marked')
}









