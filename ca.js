var cells = [],
	cellSize = 10,
	ruleset = [];

function setup() {	
	// Main canvas
	let dimensions = getCanvasSize();
	let canvas = createCanvas(dimensions.width, dimensions.height);
	canvas.parent('canvasContainer');
	// Canvas for illustrating the current rule
	let cr = createGraphics(100,100);
	cr.parent('currentRule');
	cr.show();
	cr.background(255);
	// Fill the cells array with the first generation
	initCells();
	frameRate(10);
	updateGrid();
}

function draw() {
	for (let g = 0; g < cells.length; g++) {
		// Iterate over the cell generations
		for (let i = 0; i < cells[g].length; i++) {
			// Iterate over the cells in this generation.
			if (cells[g][i] == 0) fill(255);
			else fill(0);
			rect(i * cellSize, g * cellSize, cellSize, cellSize);
		}
	}
	if (cells.length >= height / cellSize) cells.shift();
	beget();
}

function beget() {
	// Initialize cells if somehow we haven't done that yet
	if (!cells.length) return initCells();
	// "Beget" a new generation of cells
	let currentGen = cells[cells.length - 1];
	let nextGen = [];
	for (let i = 0; i < currentGen.length; i++) {
		let left   = (i == 0) ? currentGen[currentGen.length - 1] : currentGen[i - 1];
		let middle = currentGen[i];
		let right  = (i == currentGen.length - 1) ? currentGen[0] : currentGen[i + 1];
		nextGen[i] = getState(left, middle, right);
	}
	cells.push(nextGen);
}

function getState(a, b, c) {
	// Combine the three digits into one 3-bit number (string)
	let rule = "" + a + b + c;
	// Convert to decimal
	rule = parseInt(rule, 2);
	// The decimal number happens to be the index of the state we need!
	return ruleset[rule];
}

function initCells() {
	// Fills the cells[] array with a first generation of cells
	// All first generation cells are set to state 0 by default, except the middle one.
	let population = Math.floor(width / cellSize);
	document.getElementById('population').innerHTML = population;
	let middle = Math.floor(population/2);
	let firstGeneration = [];
	for (let i = 0; i < population; i++) {
		firstGeneration[i] = (i == middle) ? 1 : 0;
	}
	cells.push(firstGeneration);
}

function reset() {
	cells = [];
	clear();
	loop();
	document.getElementById('pause').disabled = false;
	document.getElementById('resume').disabled = true;
	document.getElementById('step').disabled = true;
}

function step() {
	redraw();
}

function pause() {
	noLoop();
	document.getElementById('pause').disabled = true;
	document.getElementById('resume').disabled = false;
	document.getElementById('step').disabled = false;
}

function resume() {
	loop();
	document.getElementById('pause').disabled = false;
	document.getElementById('resume').disabled = true;
	document.getElementById('step').disabled = true;
}

function saveCA() {
	saveCanvas('myAutomaton', 'png');
}

function updateRuleset() {
	// Convert the decimal rule # to an array of its digits in binary in reverse
	let newRule = parseInt(document.getElementById('ruleset').value);
	// Convert to binary
	newRule = newRule.toString(2);
	// Pad with 0's
	newRule = newRule.padStart(8, '0');
	// Reverse it
	newRule = newRule.split("");
	ruleset = newRule.reverse();
	reset();
	document.getElementById('rs').innerHTML = newRule;
}

function updateFrameRate() {
	frameRate(parseInt(document.getElementById('frSetting').value));
}

function updateGrid() {
	if (document.getElementById('gridSetting').checked) {
		stroke(230);
	} else {
		noStroke();	
	}
}

function initDoc() {
	// Add event listeners
	document.getElementById('step').addEventListener('click', step);
	document.getElementById('reset').addEventListener('click', reset);
	document.getElementById('pause').addEventListener('click', pause);
	document.getElementById('resume').addEventListener('click', resume);
	document.getElementById('saveCA').addEventListener('click', saveCA);
	document.getElementById('frSetting').addEventListener('mousemove', updateFrameRate);
	document.getElementById('gridSetting').addEventListener('change', updateGrid);
	// Populate ruleset select
	let rsSelect = document.getElementById('ruleset');
	for (let i = 0; i < 256; i++) {
		let option = document.createElement('OPTION');
		option.appendChild(document.createTextNode(`Rule ${i}`));
		option.value = i;
		rsSelect.appendChild(option);
	}
	rsSelect.value = 90;
	rsSelect.addEventListener('change', updateRuleset);
	document.getElementById('rs').innerHTML = ruleset;
	updateRuleset();
}

function getCanvasSize() {
	// Canvas dimensions should be evenly divisible by the cell size.
	let width, height, containerW, defaultCanvasHeight = 400;
	height = (defaultCanvasHeight % cellSize == 0) ? defaultCanvasHeight : defaultCanvasHeight - (defaultCanvasHeight % cellSize);
	containerW = document.getElementById('canvasContainer').clientWidth;
	width = (containerW % cellSize == 0) ? containerW : containerW - (containerW % cellSize);
	return {width:  width,
			height: height};
}

function windowResized() {
	let size = getCanvasSize();
	resizeCanvas(size.width, size.height);
	reset();
}
