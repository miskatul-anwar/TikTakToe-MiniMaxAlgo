// main.js
const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let isGameOver = false;
let currentPlayer = "O"; // Human starts first

function handleCellClick(event) {
  const cell = event.target;
  const cellId = cell.id;
  const row = Math.floor((parseInt(cellId.split("-")[1]) - 1) / 3);
  const col = (parseInt(cellId.split("-")[1]) - 1) % 3;

  if (board[row][col] === "" && !isGameOver) {
    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    checkGameOver();
    if (!isGameOver) {
      currentPlayer = "X";
      makeAIMove();
    }
  }
}

function checkGameOver() {
  const winner = evaluate(board);
  if (winner === 10) {
    document.getElementById("status").textContent = "AI Wins!";
    isGameOver = true;
  } else if (winner === -10) {
    document.getElementById("status").textContent = "You Win!";
    isGameOver = true;
  } else if (!isMovesLeft(board)) {
    document.getElementById("status").textContent = "It's a Tie!";
    isGameOver = true;
  }
}

function isMovesLeft(board) {
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) if (board[i][j] === "") return true;
  return false;
}

function evaluate(board) {
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] === "X") return +10;
      else if (board[row][0] === "O") return -10;
    }
  }

  for (let col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] === "X") return +10;
      else if (board[0][col] === "O") return -10;
    }
  }

  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === "X") return +10;
    else if (board[0][0] === "O") return -10;
  }

  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === "X") return +10;
    else if (board[0][2] === "O") return -10;
  }

  return 0;
}

function minimax(board, depth, isMax) {
  const score = evaluate(board);

  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (!isMovesLeft(board)) return 0;

  if (isMax) {
    let best = -1000;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = "X";
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i][j] = "";
        }
      }
    }
    return best;
  } else {
    let best = 1000;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = "O";
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i][j] = "";
        }
      }
    }
    return best;
  }
}

function findBestMove(board) {
  let bestVal = -1000;
  let bestMove = { row: -1, col: -1 };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        board[i][j] = "X";
        const moveVal = minimax(board, 0, false);
        board[i][j] = "";

        if (moveVal > bestVal) {
          bestMove.row = i;
          bestMove.col = j;
          bestVal = moveVal;
        }
      }
    }
  }
  return bestMove;
}

function makeAIMove() {
  const bestMove = findBestMove(board);
  if (bestMove.row !== -1 && bestMove.col !== -1) {
    board[bestMove.row][bestMove.col] = "X";
    document.getElementById(
      `cell-${bestMove.row * 3 + bestMove.col + 1}`
    ).textContent = "X";
    checkGameOver();
    if (!isGameOver) {
      currentPlayer = "O";
      document.getElementById("status").textContent = "Your Turn";
    }
  }
}

// Restart the game
function restartGame() {
  // Clear the board array
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[i][j] = "";
    }
  }
  // Reset game state
  isGameOver = false;
  currentPlayer = "O";
  document.getElementById("status").textContent = "Your Turn";

  // Clear the UI cells
  for (let i = 1; i <= 9; i++) {
    document.getElementById(`cell-${i}`).textContent = "";
  }
}
