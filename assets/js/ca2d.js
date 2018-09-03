var board = [],   // board[rows][columns]
    cellSize = 10;

function setup() {
    // Main canvas
    let dimensions = getCanvasSize(document.getElementById('canvasContainer').clientWidth, 350, cellSize);
    let canvas = createCanvas(dimensions.width, dimensions.height);
    canvas.parent('canvasContainer');
    stroke(230);
    frameRate(2);
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
    beget();
}

function initCells() {
    board = [];
    let columns = Math.floor(width / cellSize);
    let rows    = Math.floor(height / cellSize);
    // document.getElementById('population').innerHTML = columns * rows;

    for (let r = 0; r < rows; r++) {
        let boardRow = [];
        for (let c = 0; c < columns; c++) {
            boardRow.push(Math.floor(Math.random() * 2));
        }
        board.push(boardRow);
    }
}

function beget() {
    // Initialize a blank copy of the board
    let next = [];
    for (let x = 0; x < board.length; x++) {
        next[x] = [];
        for (let y = 0; y < board[0].length; y++) {
            next[x][y] = 0;
        }
    }
    // Skip edge cells for now
    for (let r = 1; r < board.length - 1; r++) {
        let boardRow = board[r];
        for (let c = 1; c < boardRow.length - 1; c++) {
            // Calculate the new state for this cell by examining its neighbors
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    neighbors += board[r+i][c+j]
                }
            }
            // Don't include the current cell among its neighbors
            neighbors -= boardRow[c];
            if ((board[r][c] == 1) && (neighbors <  2)) {
                next[r][c] = 0;
            } else if ((board[r][c] == 1) && (neighbors >  3)) {
                next[r][c] = 0;
            } else if ((board[r][c] == 0) && (neighbors == 3)) {
                next[r][c] = 1;
            } else {
                next[r][c] = board[r][c];
            }
        }
    }
    board = next;
}

function initDoc() {
    initCells();
}

function windowResized() {
    let size = getCanvasSize(document.getElementById('canvasContainer').clientWidth, 350, cellSize);
    // Only resize the canvas if the width has changed
    if (size.width !== width) {
        clear();
        resizeCanvas(size.width, size.height);
        initCells();
    }
}
