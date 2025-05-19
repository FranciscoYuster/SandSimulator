function make2Darray(cols, rows, fillValue = 0) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(fillValue);
  }
  return arr;
}

let grid;
let colors;
let w = 4;
let cols, rows;

function setup() {
  createCanvas(400, 400);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2Darray(cols, rows);
  colors = make2Darray(cols, rows, color(0));
}

function mouseDragged() {
  let col = floor(mouseX / w);
  let row = floor(mouseY / w);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    grid[col][row] = 1; // Solo arena
    colors[col][row] = color(200, 180, 80);
  }
}

function draw() {
  background(0);

  // Dibuja partículas
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] !== 0) {
        noStroke();
        fill(colors[i][j]);
        square(i * w, j * w, w);
      }
    }
  }

  let nextGrid = make2Darray(cols, rows);
  let nextColors = make2Darray(cols, rows, color(0));

  // Inicializar nextGrid y nextColors vacíos
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      nextGrid[i][j] = 0;
      nextColors[i][j] = color(0);
    }
  }

  // Recorremos de abajo hacia arriba para simular gravedad
  for (let i = 0; i < cols; i++) {
    for (let j = rows - 1; j >= 0; j--) {
      let mat = grid[i][j];

      if (mat === 1) {
        // Arena cae y se dispersa lateralmente
        moveParticle(i, j, nextGrid, nextColors, true);
      } else if (mat === 0) {
        // Vacío se copia igual
        if (nextGrid[i][j] === 0) {
          nextGrid[i][j] = 0;
          nextColors[i][j] = color(0);
        }
      }
    }
  }

  grid = nextGrid;
  colors = nextColors;
}

function moveParticle(i, j, nextGrid, nextColors, dispersaLados = true) {
  let below = j + 1;

  if (below < rows && grid[i][below] === 0 && nextGrid[i][below] === 0) {
    nextGrid[i][below] = grid[i][j];
    nextColors[i][below] = colors[i][j];
    return true;
  }

  if (dispersaLados) {
    let options = [];
    if (i > 0 && below < rows && grid[i - 1][below] === 0 && nextGrid[i - 1][below] === 0) options.push({ x: i - 1, y: below });
    if (i < cols - 1 && below < rows && grid[i + 1][below] === 0 && nextGrid[i + 1][below] === 0) options.push({ x: i + 1, y: below });

    if (options.length > 0) {
      let move = random(options);
      nextGrid[move.x][move.y] = grid[i][j];
      nextColors[move.x][move.y] = colors[i][j];
      return true;
    }
  }

  // Si no se pudo mover, se queda en su sitio
  if (nextGrid[i][j] === 0) {
    nextGrid[i][j] = grid[i][j];
    nextColors[i][j] = colors[i][j];
  }
  return false;
}
