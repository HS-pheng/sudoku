var extractedGrid = [];

var board = [];

var generatedBoard;

window.onload = function () {
  generateSudoku();

  generatedBoard.forEach((arr) => {
    let temp = "";
    arr.forEach((e) => {
      if (e === 0) {
        temp += "-";
        return;
      }
      temp += e.toString();
    });
    console.log(temp);
    board.push(temp);
  });

  setGame();
};

const extractGrid = () => {
  extractedGrid = [];
  let temp = [];
  let counter = 0;
  document.querySelectorAll(".tile").forEach((e, i) => {
    temp.push(Number(e.value));
    counter++;

    if (counter % 9 === 0) {
      extractedGrid.push(temp);
      temp = [];
    }
  });
};

function setGame() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("input");
      tile.id = r.toString() + "-" + c.toString();
      if (board[r][c] != "-") {
        tile.value = board[r][c];
        tile.setAttribute("disabled", true);
        tile.classList.add("tile-start");
      }
      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }
      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }

      tile.addEventListener("input", (e) => {
        if (isNaN(e.target.value)) {
          e.target.value = "";
          return;
        }

        e.target.value %= 10;
      });

      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }

  const testBtn = document.querySelector("#test");
  testBtn.addEventListener("click", () => {
    board = [];
    generateSudoku();

    generatedBoard.forEach((arr) => {
      let temp = "";
      arr.forEach((e) => {
        if (e === 0) {
          temp += "-";
          return;
        }
        temp += e.toString();
      });
      console.log(temp);
      board.push(temp);
    });

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const target = document.getElementById(`${y}-${x}`);
        if (board[y][x] !== "-") {
          target.setAttribute("disabled", true);
          target.value = board[y][x];
          target.classList.add("tile-start");
        } else {
          target.removeAttribute("disabled");
          target.classList.remove("tile-start");
          target.value = "";
        }
      }
    }
  });
}

function isValid(y, x, val) {
  for (let i = 0; i < 9; i++) {
    if (val == extractedGrid[y][i]) return false;
  }

  for (let i = 0; i < 9; i++) {
    if (val == extractedGrid[i][x]) return false;
  }

  const x0 = Math.floor(x / 3) * 3;
  const y0 = Math.floor(y / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (extractedGrid[y0 + i][x0 + j] === val) return false;
    }
  }
  return true;
}

function generateSudoku() {
  const grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  function isValid(grid, row, col, k) {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + (i % 3);
      if (grid[row][i] == k || grid[i][col] == k || grid[m][n] == k) {
        return false;
      }
    }
    return true;
  }

  function fillCells(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] == 0) {
          const choices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          while (choices.length > 0) {
            const randomIndex = Math.floor(Math.random() * choices.length);
            const k = choices[randomIndex];
            if (isValid(grid, row, col, k)) {
              grid[row][col] = k;
              if (fillCells(grid)) {
                return true;
              } else {
                grid[row][col] = 0;
                choices.splice(randomIndex, 1);
              }
            } else {
              choices.splice(randomIndex, 1);
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillCells(grid);

  const puzzle = [];
  for (let i = 0; i < 9; i++) {
    puzzle[i] = [];
    for (let j = 0; j < 9; j++) {
      puzzle[i][j] = grid[i][j];
    }
  }

  const toRemove = 50;
  for (let i = 0; i < toRemove; i++) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    while (puzzle[row][col] == 0) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }
    puzzle[row][col] = 0;
  }

  generatedBoard = puzzle;
  console.log(generatedBoard);
  return grid;
}
