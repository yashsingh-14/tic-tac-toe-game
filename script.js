document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const statusText = document.getElementById("status");
  const resetBtn = document.getElementById("reset");
  const vsPlayerBtn = document.getElementById("vsPlayer");
  const easyBtn = document.getElementById("easyMode");
  const hardBtn = document.getElementById("hardMode");
  const undoBtn = document.getElementById("undoBtn");
  const hintBtn = document.getElementById("hintBtn");
  const toggleBtn = document.getElementById("toggleTheme");
  const board = document.getElementById("board");

  const moveSound = document.getElementById("moveSound");
  const winSound = document.getElementById("winSound");
  const drawSound = document.getElementById("drawSound");

  let boardState = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = false;
  let vsComputer = false;
  let hardMode = false;
  let lastMove = null;

  const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function playSound(sound) {
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  function startGame(mode) {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    vsComputer = mode !== "player";
    hardMode = mode === "hard";
    statusText.textContent = "Player X's turn";
    board.classList.remove("hidden");
    resetBtn.classList.remove("hidden");
    undoBtn.classList.remove("hidden");
    hintBtn.classList.remove("hidden");
    cells.forEach(c => {
      c.textContent = "";
      c.classList.remove("winning");
    });
  }

  function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || boardState[index] !== "") return;
    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    lastMove = index;
    playSound(moveSound);

    if (checkWin()) {
      statusText.textContent = `Player ${currentPlayer} Wins!`;
      playSound(winSound);
      gameActive = false;
      return;
    }

    if (!boardState.includes("")) {
      statusText.textContent = "It's a Draw!";
      playSound(drawSound);
      gameActive = false;
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (vsComputer && currentPlayer === "O") {
      setTimeout(() => computerMove(), 500);
    }
  }

  function computerMove() {
    const available = boardState.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    let move = hardMode ? findBestMove() : available[Math.floor(Math.random() * available.length)];
    boardState[move] = "O";
    cells[move].textContent = "O";
    lastMove = move;
    playSound(moveSound);

    if (checkWin()) {
      statusText.textContent = `Computer Wins!`;
      playSound(winSound);
      gameActive = false;
      return;
    }

    if (!boardState.includes("")) {
      statusText.textContent = "It's a Draw!";
      playSound(drawSound);
      gameActive = false;
      return;
    }

    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }

  function findBestMove() {
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        if (checkWin()) {
          boardState[i] = "";
          return i;
        }
        boardState[i] = "";
      }
    }
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        if (checkWin()) {
          boardState[i] = "";
          return i;
        }
        boardState[i] = "";
      }
    }
    return boardState.findIndex(v => v === "");
  }

  function checkWin() {
    for (let combo of winConditions) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        cells[a].classList.add("winning");
        cells[b].classList.add("winning");
        cells[c].classList.add("winning");
        return true;
      }
    }
    return false;
  }

  function undoMove() {
    if (lastMove !== null && boardState[lastMove] !== "") {
      boardState[lastMove] = "";
      cells[lastMove].textContent = "";
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Undo! Player ${currentPlayer}'s turn`;
      lastMove = null;
    }
  }

  function giveHint() {
    const available = boardState.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    const hintIndex = available[Math.floor(Math.random() * available.length)];
    if (hintIndex !== null) {
      alert(`💡 Try clicking on cell ${hintIndex + 1}`);
    }
  }

  function toggleTheme() {
    document.body.classList.toggle("dark");
  }

  vsPlayerBtn.addEventListener("click", () => startGame("player"));
  easyBtn.addEventListener("click", () => startGame("easy"));
  hardBtn.addEventListener("click", () => startGame("hard"));
  resetBtn.addEventListener("click", () => startGame(vsComputer ? (hardMode ? "hard" : "easy") : "player"));
  undoBtn.addEventListener("click", undoMove);
  hintBtn.addEventListener("click", giveHint);
  toggleBtn.addEventListener("click", toggleTheme);
  cells.forEach(cell => cell.addEventListener("click", handleCellClick));
});
