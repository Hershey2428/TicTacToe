const cells = document.querySelectorAll('.cell');
const restart = document.querySelector('#restart');
const clear = document.querySelector('#clear');
const player1Score = document.querySelector('#player1-score');
const player2Score = document.querySelector('#player2-score');
const player1Select = document.getElementById("player1-piece");
const player2Select = document.getElementById("player2-piece");
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

let board = Array(9).fill(null);
let currentPlayer = 1;
let score1 = 0;
let score2 = 0;
let gameActive = true;

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

restart.addEventListener("click", resetGame);

clear.addEventListener("click", clearScores);

function clearScores() {
    score1 = 0;
    score2 = 0;
    player1Score.innerText = score1;
    player2Score.innerText = score2;
    showMessage("Scores have been cleared");
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 1;
  gameActive = true;
  cells.forEach(cell => {
    cell.innerText = "";
  });
  showMessage("Game has been reset");
}

function handleCellClick(event) {
  const index = event.target.dataset.index;

  if(player1Select.value === player2Select.value) {
    showMessage("Players must choose different pieces!");
    return;
  }

  if (!gameActive || board[index]) return;

  const player1Symbol = player1Select.value;
  const player2Symbol = player2Select.value;
  const symbol = currentPlayer === 1 ? player1Symbol : player2Symbol;

  board[index] = symbol;
  event.target.innerText = symbol;

  let won = false;
  for (let combo of winCombos) {
    const [x, y, z] = combo;
    if (board[x] && board[x] === board[y] && board[y] === board[z]) {
      won = true;
      break;
    }
  }

  if (won) {
    gameActive = false;
    if (currentPlayer === 1) {
      score1++;
      player1Score.innerText = score1;
    } else{
      score2++;
      player2Score.innerText = score2;
    }
    showMessage(`Player ${currentPlayer} wins!`);
  } else if(!board.includes(null)) {
    gameActive = false;
    showMessage("It's a draw!");
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
   if(gameActive){
    showTurn(`Player ${currentPlayer}'s turn`);
   }
}

function showMessage(text) {
  const messageBox = document.getElementById("message");
  messageBox.innerText = text;
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.innerText = "";
    messageBox.style.display = "none";
   }, 2000);
}

function showTurn(player) {
  const turnBox = document.getElementById("turn");
  turnBox.innerText = player;
  turnBox.style.display = "block";

  setTimeout(() => {
    turnBox.innerText = "";
    turnBox.style.display = "none";
   }, 2000);
}