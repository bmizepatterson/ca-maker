// Initialize the array of cells
var cells = [],
	cellWidth = 30,
	ruleset = [0,1,0,1,1,0,1,0],
	generations = 10;

function setup() {
	createCanvas(720, 400);
	// Fill the cells array and define the initial state
	cells = [[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]];
	// cellWidth = (width - 2) / cells[0].length;
	stroke(0);
}

function draw() {
	for (let g = 0; g < cells.length; g++) {
		// Iterate over the cell generations
		for (let i = 0; i < cells[g].length; i++) {
			// Iterate over the cells in this generation
			if (cells[g][i] == 0) fill(255);
			else fill(0);
			rect(i * cellWidth, g * cellWidth, cellWidth, cellWidth);
		}
	}
	if (cells.length < generations) beget();
}

function beget() {
	// "Beget" a new generation of cells
	let currentGen = cells[cells.length - 1];
	let nextGen = [];
	// Skip the edge cases for now
	nextGen[0] = nextGen[currentGen.length - 1] = 0;
	for (let i = 1; i < currentGen.length - 1; i++) {
		let left   = currentGen[i - 1];
		let middle = currentGen[i];
		let right  = currentGen[i + 1];
		nextGen[i] = getState(left, middle, right);
	}
	cells.push(nextGen);
}

function getState(a, b, c) {
	// Combine the three digits into one 3-bit number
	let rule = "" + a + b + c;
	// Convert to decimal
	rule = parseInt(rule, 2);
	// The decimal number happens to be the index of the state we need!
	return ruleset[rule];
}
