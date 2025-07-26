const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const timeLeftDisplay = document.getElementById('timeLeft');
const timerBar = document.getElementById('timerBar');
const scoreboard = document.getElementById('scoreboard');
let currentPlayer = '🌟';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let players = ['🌟', '❤️'];
let currentPlayerIndex = 0;
let scores = { '🌟': 0, '❤️': 0 };
let timer;
let timeLeft = 10;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const moveSound = new Audio('https://www.soundjay.com/buttons/button-09.mp3');
const winSound = new Audio('https://www.soundjay.com/misc/sounds/celebration-2.mp3');

function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timeLeftDisplay.textContent = timeLeft;
  timerBar.style.width = '100%';
  timer = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    timerBar.style.width = `${(timeLeft / 10) * 100}%`;
    if (timeLeft <= 0) {
      status.textContent = `Time's up! Game Over 😺`;
      gameActive = false;
      clearInterval(timer);
      cells.forEach(cell => cell.classList.add('disabled'));
    }
  }, 1000);
}

function updateScoreboard() {
  scoreboard.textContent = players.map(player => `${player}: ${scores[player]}`).join(' | ');
}

function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add('pop');
  moveSound.play();

  if (checkWin()) {
    status.textContent = `Player ${currentPlayer} Wins! 🎉`;
    scores[currentPlayer]++;
    updateScoreboard();
    gameActive = false;
    cells.forEach(cell => cell.classList.add('disabled'));
    clearInterval(timer);
    winSound.play();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    return;
  }

  if (board.every(cell => cell !== '')) {
    status.textContent = "It's a Draw! 😺";
    gameActive = false;
    clearInterval(timer);
    return;
  }

  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  currentPlayer = players[currentPlayerIndex];
  status.textContent = `Player ${currentPlayer}'s Turn`;
  startTimer();
}

function checkWin() {
  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === currentPlayer);
  });
}

function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayerIndex = 0;
  currentPlayer = players[currentPlayerIndex];
  gameActive = true;
  status.textContent = `Player ${currentPlayer}'s Turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('disabled', 'pop');
  });
  startTimer();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

// Initialize scoreboard and timer
updateScoreboard();
startTimer();