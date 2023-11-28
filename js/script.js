window.onload = apply;
let n_rows = 12;
let n_cols = 16;
let side = 50;
let state = [];
let run = false;
let timeout = 1000;

function init_state() {
  state = [];
  for (i = 0; i < n_rows; i++) {
    state.push([]);
    for (j = 0; j < n_cols; j++) {
      state[i].push(0);
    }
  }
}

function apply() {
  n_rows = document.getElementById("rows").value;
  n_cols = document.getElementById("cols").value;
  let side = document.getElementById("side").value;
  timeout = document.getElementById("timeout").value;
  let width = side;
  let height = side;
  let canvas = document.getElementById("canvas");
  canvas.style.width = side * n_cols + "px";
  canvas.style.height = side * n_rows + "px";

  canvas.innerHTML = "";
  for (i = 0; i < n_rows; i++) {
    let row = document.createElement("div");
    row.className = "row";
    row.style.height = side + "px";
    row.style.width = side * n_cols + "px";
    for (j = 0; j < n_cols; j++) {
      let box = document.createElement("div");
      box.className = "box";
      box.x = i;
      box.y = j;
      box.addEventListener("click", function () {
        this.classList.toggle("active");
        let i = this.x;
        let j = this.y;
        state[i][j] = 1 - state[i][j];
      });
      box.style.width = width + "px";
      box.style.height = height + "px";
      box.id = "box-" + i + "-" + j;
      row.appendChild(box);
    }
    canvas.appendChild(row);
  }
  init_state();
}

function clear_grid() {
  for (i = 0; i < n_rows; i++) {
    for (j = 0; j < n_cols; j++) {
      box_id = "box-" + i + "-" + j;
      box = document.getElementById(box_id);
      box.classList.remove("active");
    }
  }
}

function sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function start() {
  run = true;
  while (run) {
    next_iteration();
    await sleep(timeout);
  }
}

function next_iteration() {
  var new_state = [];
  for (var i = 0; i < state.length; i++) new_state[i] = state[i].slice();
  if (n_rows == 0 && n_cols == 0) return;
  for (i = 0; i < n_rows; i++) {
    for (j = 0; j < n_cols; j++) {
      let vecinos = cantidad_vecinos(i, j, n_rows, n_cols);
      box = document.getElementById("box-" + i + "-" + j);
      if (new_state[i][j] == 1) {
        // Si esta viva
        // Si tiene menos de dos vecinos, muere
        // Si tiene mas de 3 vecinos, muere
        if (vecinos != 2 && vecinos != 3) {
          new_state[i][j] = 0;
          box.classList.remove("active");
        }
        // Si tiene 2 o 3 vecinos, vive
      } else {
        // Si esta muerta
        // Si tiene exactamente 3 vecinos, revive
        if (vecinos == 3) {
          new_state[i][j] = 1;
          box.classList.add("active");
        }
      }
    }
  }
  state = new_state;
}

async function stop() {
  run = false;
}

function clear_matrix() {
  init_state();
  clear_grid();
}

function vecino(i, j, x, y) {
  if (i == -1 || i == x) return 0;
  if (j == -1 || j == y) return 0;
  return state[i][j];
}

function cantidad_vecinos(i, j, x, y) {
  let sum = 0;
  console.log(i, j);
  sum += vecino(i - 1, j - 1, x, y);
  sum += vecino(i - 1, j, x, y);
  sum += vecino(i - 1, j + 1, x, y);

  sum += vecino(i, j - 1, x, y);
  console.log(vecino(i, j - 1, x, y));
  sum += vecino(i, j + 1, x, y);
  console.log(vecino(i, j + 1, x, y));

  sum += vecino(i + 1, j - 1, x, y);
  sum += vecino(i + 1, j, x, y);
  sum += vecino(i + 1, j + 1, x, y);
  return sum;
}
