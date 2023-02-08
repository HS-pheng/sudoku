var extractedGrid = [];

var sudoSolution;

var board = [
  "---------",
  "---------",
  "---------",
  "---------",
  "---------",
  "---------",
  "---------",
  "---------",
  "---------",
];

window.onload = function () {
  extractGrid();

  setGame();
};

var solutions = [];
var counter = 0;

function solve() {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (extractedGrid[y][x] === 0) {
        for (let i = 1; i < 10; i++) {
          if (isValid(y, x, i)) {
            extractedGrid[y][x] = i;
            counter++;
            if (solutions.length === 1) {
              return;
            }
            if (solve()) {
              return true;
            }
            extractedGrid[y][x] = 0;
          }
        }
        return;
      }
    }
  }
  solutions.push(JSON.stringify(extractedGrid));
  sudoSolution = [...extractedGrid];
  return true;
}

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
    extractGrid();
    const error = document.getElementById("error");
    if (!checkValidInput()) {
      console.log(extractedGrid);
      console.log("invalid input");
      error.innerText = "Invalid Input";
      return;
    } else {
      error.innerText = "";
    }
    solve();

    console.log(sudoSolution);
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const target = document.getElementById(`${y}-${x}`);
        target.value = sudoSolution[y][x];
      }
    }
  });

  const clearBtn = document.querySelector("#clear");
  clearBtn.addEventListener("click", clearBoard);
}

function clearBoard() {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const target = document.getElementById(`${y}-${x}`);
      target.value = "";
    }
  }
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

function isRepeat(grid, y, x, val) {
  let counter = 0;
  for (let i = 0; i < 9; i++) {
    if (val == grid[y][i]) counter++;
  }

  if (counter > 1) {
    return true;
  }

  for (let i = 0; i < 9; i++) {
    if (val == grid[i][x]) counter++;
  }

  if (counter > 2) {
    return true;
  }

  const x0 = Math.floor(x / 3) * 3;
  const y0 = Math.floor(y / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[y0 + i][x0 + j] === val) counter++;
    }
  }

  if (counter > 3) {
    return true;
  }

  return false;
}

function checkValidInput() {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (extractedGrid[y][x] === 0) {
        continue;
      }

      if (isRepeat(extractedGrid, y, x, extractedGrid[y][x])) {
        console.log(y, x, extractedGrid[y][x]);
        return false;
      }
    }
  }
  return true;
}
