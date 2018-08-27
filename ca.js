// Initialize the array of cells
var cells = [],
	cellWidth;

function setup() {
	createCanvas(720, 400);
	// Fill the cells array and define the initial state
	cells = [0, 0, 0, 0, 1, 0, 0, 0, 0];
	cellWidth = (width - 2) / cells.length;
	stroke(0);
}

function draw() {
	// Draw the initial state
	for (let i = 0; i < cells.length; i++) {
		if (cells[i] == 0) fill(255);
		else fill(0);
		rect(i*cellWidth,0,cellWidth,cellWidth);
	}
}
