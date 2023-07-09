const gameBoard = document.querySelector("#game__board");
const gameInfo = document.querySelector("#game__info");
const restart = document.querySelector("#restart");
const choices = document.querySelectorAll('input[name="choices"]');

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let gameChoice = "ai"; // init the game play to ai

let ai = "X"; // ai player
let human = "O"; // human player

let playerOne = "X";
let playerTwo = "0";

let currentPlayer = ai; // current player
let countCell = 9; // cell count remain
let winner = null; // winner status

// check user select offline or ai
function checkGamePlay() {
  choices.forEach((choice) => {
    choice.addEventListener("change", (e) => {
      gameChoice = e.target.value;
      drawGameBoard();
    });
  });
}

// init the game by creating div and append them to the game board div
function drawGameBoard() {
  gameBoard.innerHTML = ""; // clear the div

  ai = "X"; // ai player
  human = "O"; // human player

  playerOne = "X";
  playerTwo = "0";

  currentPlayer = ai; // current player
  countCell = 9; // cell count remain
  winner = null; // winner status
  let index = 0; // id
  board.forEach((rows, rowIndex) => {
    rows.forEach((_cell, colIndex) => {
      const cellDivEle = document.createElement("div");
      cellDivEle.id = index;
      cellDivEle.dataset.index = `${rowIndex}${colIndex}`; // data set for row, col
      cellDivEle.classList.add("square");
      cellDivEle.addEventListener("click", showSignOnBoard);
      index++;
      gameBoard.append(cellDivEle);
    });
  });
  console.log(gameChoice);
  gameChoice === "ai" && nextMoveForAi(); // * init ai first move
}

// show cross or circle on the board
function showSignOnBoard(e) {
  const row = parseInt(e.target.dataset.index.charAt(0));
  const col = parseInt(e.target.dataset.index.charAt(1));
  let signDiv;
  if (gameChoice === "offline") {
    signDiv = nextMoveForOffline(row, col);
  } else if (gameChoice === "ai") {
    if (currentPlayer === human) {
      const div = document.createElement("div");
      div.dataset.sign = "circle";
      div.classList.add("circle");
      board[row][col] = human;
      currentPlayer = ai;
      signDiv = div;
    }
  }

  e.target.append(signDiv);
  e.target.removeEventListener("click", showSignOnBoard);
  countCell -= 1;

  checkWinner();
}

// check descent cell is same sign
function equalCell(a, b, c) {
  return a === b && b === c && a !== "";
}

function checkWinner() {
  // check horizontally
  for (let i = 0; i < 3; i++) {
    if (equalCell(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }
  // check vertically
  for (let i = 0; i < 3; i++) {
    if (equalCell(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }
  // check diagonally
  if (equalCell(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  // check diagonally
  if (equalCell(board[0][2], board[1][1], board[2][0])) {
    winner = board[0][2];
  }

  // check for tie
  if (winner === null && countCell === 0) {
    gameInfo.innerText = "Tie";
    return "tie";
  }

  // check for winner
  if (winner !== null) {
    const allDiv = document.querySelectorAll(".square");
    allDiv.forEach((div) => {
      div.removeEventListener("click", showSignOnBoard);
    });
    gameInfo.innerText =
      winner === "O"
        ? `Winner is ${gameChoice === "ai" ? "player" : "playerTwo"}`
        : `Winner is ${gameChoice === "ai" ? "AI" : "playerOne"}`;
    return winner;
  }
  gameChoice === "ai" && nextMoveForAi(); // * next move
}

// next move for offline playing
function nextMoveForOffline(row, col) {
  const signDiv = document.createElement("div");
  if (currentPlayer === playerTwo) {
    signDiv.dataset.sign = "circle";
    signDiv.classList.add("circle");
    board[row][col] = playerTwo;
    currentPlayer = playerOne;
  } else {
    signDiv.dataset.sign = "cross";
    signDiv.classList.add("cross");
    board[row][col] = playerOne;
    currentPlayer = playerTwo;
  }
  return signDiv;
}

// check if current player is ai and then call aiMove()
function nextMoveForAi() {
  if (currentPlayer !== ai) {
    return;
  }

  aiMove();
}

// loop through 2d array and produce best possible outcome by using minimax algorithm
function aiMove() {
  let bestScore = -Infinity;
  let move = {};
  let hasAvailableSpot = false; // check for empty space

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        hasAvailableSpot = true;
        board[i][j] = ai;
        let score = minimax(board, 0, false, -Infinity, Infinity); // * minimax
        board[i][j] = "";
        if (score > bestScore) {
          bestScore = score;
          move.i = i;
          move.j = j;
        }
      }
    }
  }

  if (hasAvailableSpot) {
    board[move.i][move.j] = ai;
    const xDiv = document.createElement("div");
    xDiv.classList.add("cross");
    document.querySelector(`[data-index="${move.i}${move.j}"]`).append(xDiv);
    countCell -= 1;
    currentPlayer = human;
    checkWinner();
  }
}

let scores = {
  X: 10,
  Y: -10,
  tie: 0,
};

function minimax(board, depth, isMaximizing, alpha, beta) {
  // let result = checkWinner();
  // if (result !== null) {
  //   return scores[result];
  // }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false, alpha, beta);
          board[i][j] = "";
          bestScore = Math.max(score, bestScore);
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) {
            break; // Beta cutoff
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true, alpha, beta);
          board[i][j] = "";
          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) {
            break; // Alpha cutoff
          }
        }
      }
    }
    return bestScore;
  }
}

// restart game
function restartGame() {
  window.location.reload();
}

// call the game when DOM load
document.addEventListener("DOMContentLoaded", () => {
  drawGameBoard();
  checkGamePlay();
});

restart.addEventListener("click", restartGame);
