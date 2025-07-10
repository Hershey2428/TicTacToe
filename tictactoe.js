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
    showMessage("Clean Slates!");
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 1;
  gameActive = true;
  cells.forEach(cell => {
    cell.innerText = "";
    cell.classList.remove('win');
  });
  const line = document.getElementById("win-line");
  line.style.display = "none";
  line.style.width = "";
  line.style.transform = "";
  showMessage("New Game, Starting Now...");
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
      cells[x].classList.add('win');
      cells[y].classList.add('win');
      cells[z].classList.add('win');
      winLine([x, y, z])
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

function winLine([x, y, z]){
  const line = document.getElementById("win-line");
  const board = document.getElementById("board");
  const boardRect = document.getElementById("board").getBoundingClientRect();
  const cellRects = Array.from(cells).map(cell => cell.getBoundingClientRect());
  
  const startRect = cellRects[x];
  const endRect = cellRects[z];

  const x1 = (startRect.left + startRect.width / 2) - boardRect.left;
  const y1 = (startRect.top + startRect.height / 2) - boardRect.top;
  const x2 = (endRect.left + endRect.width / 2) - boardRect.left;
  const y2 = (endRect.top + endRect.height / 2) - boardRect.top;

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const length = Math.sqrt(deltaX**2 + deltaY**2) + 120;
  const angle = Math.atan2(deltaY, deltaX) * (180/ Math.PI);

  const newX = (60) * Math.cos(angle * Math.PI/180);
  const newY = (60) * Math.sin(angle * Math.PI/180)

  line.style.width = `${length}px`;
  line.style.transform = `translate(${x1 - newX}px, ${y1 - newY}px) rotate(${angle}deg)`;
  line.style.display = "block";
}