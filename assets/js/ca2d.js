var board = [],   // board[rows][columns]
    cellSize = 10;

function setup() {
    // Main canvas
    let dimensions = getCanvasSize(document.getElementById('canvasContainer').clientWidth, 350, cellSize);
    let canvas = createCanvas(dimensions.width, dimensions.height);
    canvas.parent('canvasContainer');
    stroke(230);
}

function draw() {
    background(255);
    for (let r = 0; r < board.length; r++) {
        let boardRow = board[r];
        for (let c = 0; c < boardRow.length; c++) {
            if (boardRow[c] == 0) fill(255);
            else fill(0);
            rect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
    }
}

function initCells() {
    let columns = Math.floor(width / cellSize);
    let rows    = Math.floor(height / cellSize);
    document.getElementById('population').innerHTML = columns * rows;

    for (let r = 0; r < rows; r++) {
        let boardRow = [];
        for (let c = 0; c < columns; c++) {
            boardRow.push(Math.floor(Math.random() * 2));
        }
        board.push(boardRow);
    }
}

function initDoc() {
    initCells();
}
