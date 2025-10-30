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

const instructionsBtn = document.getElementById('instructions-btn');

instructionsBtn.addEventListener('click', () => {
    alert(
        "Tic Tac Toe Instructions:\n\n" +
        "1. Use the dropdowns to pick a player piece.\n" +
        "2. Rename yourself by clicking the edit button (pencil).\n" +
        "3. Take turns clicking a cell to place your piece.\n" +
        "4. To win align 3 pieces in a row, diagonally, horizontally or vertically.\n" +
        "5. Click 'Restart Game' to play again.\n" +
        "6. Click 'Clear Scores' to reset wins."
    );
});

const editButtons = document.querySelectorAll('.edit-name');

editButtons.forEach(button => {
    button.addEventListener('click', () => {
        const playerNum = button.getAttribute('data-player');
        const labelSpan = document.getElementById(`player${playerNum}-label`);
        const nameSpan = document.getElementById(`player${playerNum}-name`);

        const input = document.createElement('input');
        input.type = 'text';
        input.value = labelSpan.textContent;
        input.classList.add('name-input');

        labelSpan.replaceWith(input);
        input.focus();

        const finishEdit = () => {
            const newName = input.value.trim() || `Player ${playerNum}`;
            labelSpan.textContent = newName;
            nameSpan.textContent = newName;
            input.replaceWith(labelSpan);
            updateNames();
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') finishEdit();
        });
    });
});

let board = Array(9).fill(null);
let currentPlayer = 1;
let score1 = 0;
let score2 = 0;
let gameActive = true;
let player1 = "Player 1";
let player2 = "Player 2";

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

cells.forEach(cell=> {
    cell.addEventListener("mouseenter", handleMouseEnter);
    cell.addEventListener("mouseleave", handleMouseLeave);
})

restart.addEventListener("click", resetGame);

clear.addEventListener("click", clearScores);

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('summer');
    document.body.classList.toggle('winter');

    const isWinter = document.body.classList.contains('winter');
    restart.style.backgroundImage = isWinter ? "url('wrestartBack.png')" : "url('restartBack.png')";
    clear.style.backgroundImage = isWinter ? "url('wclearBack.png')" : "url('clearBack.png')";
});

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

function updateNames() {
  player1 = document.getElementById("player1-label").textContent;
  player2 = document.getElementById("player2-label").textContent;
  document.getElementById("player1-name").textContent = player1;
  document.getElementById("player2-name").textContent = player2;
  document.getElementById("player1-label").innerText = player1;
  document.getElementById("player2-label").innerText = player2;
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
  event.target.classList.remove('preview');

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
    showMessage(`${currentPlayer === 1 ? player1 : player2} wins!`);
 
    launchConfetti(); 
  } else if(!board.includes(null)) {
    gameActive = false;
    showMessage("It's a draw!");
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
   if(gameActive){
    showTurn();
   }
}

function handleMouseEnter(event){
  const index = event.target.dataset.index;
  if(!board[index]&& gameActive && player1Select.value !== player2Select.value){
    const sym = currentPlayer === 1 ? player1Select.value : player2Select.value;
    event.target.innerText = sym;
    event.target.classList.add('preview');
  }
}

function handleMouseLeave(event){
  const index = event.target.dataset.index;
  if(!board[index]){
    event.target.innerText = "";
    event.target.classList.remove('preview');
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

function showTurn() {
  const turnBox = document.getElementById("turn");

  const player1Symbol = player1Select.value;
  const player2Symbol = player2Select.value;
  const symbol = currentPlayer === 1 ? player1Symbol : player2Symbol;

  turnBox.innerHTML = `${currentPlayer === 1 ? player1 : player2}'s Turn: <span class="turn-symbol">${symbol}</span>`;
  turnBox.style.display = "block";

  setTimeout(() => {
    turnBox.style.display = "none";
  }, 1000);
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

function launchConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}