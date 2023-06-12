const gameBoard = document.getElementById("game__board");
const gameInfo = document.getElementById("game__info");
const reStartGame = document.getElementById("restart");
const squares = ["", "", "", "", "", "", "", "", ""];
let sign = "circle";

// draw game board by iterating the squares array and create div and attach click event to call
// another function that will show sing either O or X in each time
function drawGameBoard() {
  gameInfo.innerText = "On circle's move";

  squares.forEach((_square, index) => {
    const cellDivElement = document.createElement("div");
    cellDivElement.id = index + 1;
    cellDivElement.classList.add("square");
    cellDivElement.addEventListener("click", showSign);
    gameBoard.append(cellDivElement);
  });
}

function showSign(e) {
  const signDivElement = document.createElement("div");
  signDivElement.classList.add(sign);
  e.target.append(signDivElement);
  sign = sign === "circle" ? "cross" : "circle";
  e.target.removeEventListener("click", showSign);
  gameInfo.innerText = `On ${sign}'s move`;
  checkWhoWin();
}

function checkWhoWin() {
  const allSquares = document.querySelectorAll(".square");
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  winCombos.forEach((array) => {
    const circleWin = array.every((cell) => {
      return allSquares[cell].firstChild?.classList.contains("circle");
    });

    if (circleWin) {
      gameInfo.innerText = "Circle won";
      allSquares.forEach((square) =>
        square.replaceWith(square.cloneNode(true))
      );
      return;
    }
  });

  winCombos.forEach((array) => {
    const crossWin = array.every((cell) => {
      return allSquares[cell].firstChild?.classList.contains("cross");
    });
    if (crossWin) {
      gameInfo.innerText = "Cross won";
      allSquares.forEach((array) => {
        array.replaceWith(array.cloneNode(true));
      });
    }
  });
}

reStartGame.addEventListener("click", () => {
  gameBoard.innerHTML = null;
  sign = "circle";
  drawGameBoard();
});

document.addEventListener("DOMContentLoaded", drawGameBoard);
