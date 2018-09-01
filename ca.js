var cells = [],
	cellSize = 10,
	ruleset = [],
	cr,			// 'current rule' canvas
	looping;	// Doesn't seem to be a way to get the looping state in p5 so let's track it ourselves

function setup() {	
	// Main canvas
	let dimensions = getCanvasSize();
	let canvas = createCanvas(dimensions.width, dimensions.height);
	canvas.parent('canvasContainer');
	// Canvas for illustrating the current rule
	let crDimensions = getCRCanvasSize();
	cr = createGraphics(crDimensions.width,crDimensions.height);
	cr.parent('currentRule');
	cr.show();
	frameRate(10);
	updateGrid();
	noLoop();
	looping = false;
}

function draw() {
	background(255);
	for (let [key, value] of cells.entries()) {
		drawGen(key);
	}
	if (cells.length >= height / cellSize) cells.shift();
	beget();
}

function drawGen(gen) {
	// Draw a single generation of cells
	for (let [cell, state] of cells[gen].entries()) {
		// Iterate over the cells in this generation.
		if (state == 0) fill(255);
		else fill(0);
		rect(cell * cellSize, gen * cellSize, cellSize, cellSize);
	}
}

function drawRule() {
	// Draw the current set of rules in a human-readable form
	cr.clear();
	// Print the rule in text form, showing both binary and decimal versions
	let bin = ruleset.join('');
	let text = 'Rule ' + parseInt(bin, 2) + ' (' + bin + ')';
	const textSize = 16;
	cr.textAlign(LEFT);
	cr.textFont('monospace', 2 * textSize);
	cr.text(text, textSize, 3 * textSize);
	// Define margins and calculate the cell size relative to the canvas size
	const margin = 16;	   						// left & right margins
	const unit = (cr.width - margin * 2) / 31; 	// We'll be drawing 31 columns (24 cells, 7 spaces)
	const top = margin * 4;
	// Iterate through each rule and illustrate	
	for (let i = 0; i < 8; i++) {
		// Draw the sets of 3 cells for each situation
		let left = margin 				// Account for margin
		     	 + (3 * i * unit)		// Account for which neighborhood we're drawing
		     	 + (i * unit);			// Add an extra unit per neighborhood to create a space between each
		// Start by converting i to an array of 3 binary digits
		let neighborhood = decToBinArray(i, 3);
		for (let j = 0; j < neighborhood.length; j++) {
			if (neighborhood[j] == 0) cr.fill(255);
			else cr.fill(0);
			cr.stroke(0);
			let jleft = left + (j * unit);		// Account for where we are in the neighborhood
			cr.rect(jleft, top, unit, unit);
		}
		// Draw the rule cell for this set
		if (ruleset[i] == 0) cr.fill(255);
		else cr.fill(0);
		cr.stroke(0);
		let ileft = left + unit;		// Add one unit to draw it in the center of the neighborhood
		cr.rect(ileft, top + unit, unit, unit);
		cr.textAlign(CENTER);
		cr.textSize(textSize);
		cr.fill(0);
		cr.noStroke();
		cr.text(ruleset[i], ileft + unit/2, top + unit * 2 + textSize);
	}
}

function beget() {
	// Initialize cells if somehow we haven't done that yet
	if (!cells.length) return initCells(false);
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

function initCells(draw = true) {
	// Fills the cells[] array with a first generation of cells
	// All first generation cells are set to state 0 by default, except the middle one.
	let population = Math.floor(width / cellSize);
	document.getElementById('population').innerHTML = population;
	let firstGeneration = [];
	for (let i = 0; i < population; i++) {
		firstGeneration[i] = 0;
	}
	firstGeneration[Math.floor(population/2)] = 1;
	cells = [firstGeneration];
	if (draw) drawGen(0);
}

function reset() {
	clear();
	noLoop();
	looping = false;
	initCells();
	document.getElementById('stop').disabled = true;
	document.getElementById('start').disabled = false;
	document.getElementById('step').disabled = false;
}

function step() {
	let n = (cells.length > 1) ? 1 : 2;
	redraw(n);
}

function stop() {
	noLoop();
	looping = false;
	document.getElementById('stop').disabled = true;
	document.getElementById('start').disabled = false;
	document.getElementById('step').disabled = false;
}

function start() {
	loop();
	looping = true;
	document.getElementById('stop').disabled = false;
	document.getElementById('start').disabled = true;
	document.getElementById('step').disabled = true;
}

function saveCA() {
	saveCanvas('myAutomaton', 'png');
}

function keyTyped() {
	if (key === ' ') {
		if (looping) stop();
		else start();
	}
}

function updateRuleset() {
	// Convert the decimal rule # to an array of its digits in binary
	let newRule = parseInt(document.getElementById('ruleset').value);
	ruleset = decToBinArray(newRule, 8);
	reset();
	drawRule();
}

function updateFrameRate() {
	frameRate(parseInt(document.getElementById('frSetting').value));
}

function updateGrid() {
	if (document.getElementById('gridSetting').checked) stroke(230);
	else noStroke();
}

function initDoc() {
	// Add event listeners
	document.getElementById('step').onclick = step;
	// document.getElementById('step').addEventListener('click', step);
	document.getElementById('reset').onclick = reset;
	document.getElementById('stop').onclick = stop;
	document.getElementById('start').onclick = start;
	document.getElementById('saveCA').onclick = saveCA;
	document.getElementById('frSetting').onmousemove = updateFrameRate;
	document.getElementById('gridSetting').onchange = updateGrid;
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
	updateRuleset();
	initCells();
}

function getCanvasSize() {
	// Calculate the size of the main canvas
	// Returns object with the properties `width` and `height`
	// Canvas dimensions should be evenly divisible by the cell size.
	let width, height, containerW, defaultCanvasHeight = 350;  // 350px wide
	height = (defaultCanvasHeight % cellSize == 0) ? defaultCanvasHeight : defaultCanvasHeight - (defaultCanvasHeight % cellSize);
	containerW = document.getElementById('canvasContainer').clientWidth;
	width = (containerW % cellSize == 0) ? containerW : containerW - (containerW % cellSize);
	width++; height++; 	// Add room for the 1px border around the canvas
	return {width:  width,
			height: height};
}

function getCRCanvasSize() {
	// Calculate the size of the "current rule" canvas
	// Returns object with the properties `width` and `height`
	let width, height;
	width = document.getElementById('currentRule').clientWidth;
	width = (width > 800) ? 800 : width;
	height = 150;
	return {width:  width,
			height: height};
}

function windowResized() {
	let size = getCanvasSize(), crSize = getCRCanvasSize();
	resizeCanvas(size.width, size.height);
	cr.resizeCanvas(crSize.width, crSize.height);
	drawRule();
	reset();
}

function decToBinArray(dec, pad) {
	// Takes a decimal integer and returns a binary integer with the specified # of leading zeros
	return dec.toString(2).padStart(pad, '0').split('');
}
