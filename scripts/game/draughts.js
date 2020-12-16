//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_24_GPU_per_vertex.js 
//
//  Phong Illumination Model on the GPU - Per vertex shading - Several light sources
//
//  Reference: E. Angel examples
//
//  J. Madeira - November 2017 + November 2018
//
//////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;

var triangleVertexColorBuffer = null;

// The GLOBAL transformation parameters

var globalTx = 0.0;

var globalTy = 0.0;

var globalTz = -3.5;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;

// To allow choosing the projection type

var projectionType = 1;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [0.0, 0.0, 0.0, 1.0];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();


function countFrames() {

	var now = new Date().getTime();

	frameCount++;

	elapsedTime += (now - lastfpsTime);

	lastfpsTime = now;

	if (elapsedTime >= 1000) {

		fps = frameCount;

		frameCount = 0;

		elapsedTime -= 1000;

		document.getElementById('fps').innerHTML = 'fps:' + fps;
	}
}


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers(model) {

	// Coordinates

	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = model.vertices.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
		triangleVertexPositionBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

	// Colors

	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = model.colors.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
		triangleVertexColorBuffer.itemSize,
		gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel(model,
	mvMatrix,
	primitiveType) {

	// The the global model transformation is an input

	// Concatenate with the particular model transformations

	// Pay attention to transformation order !!

	mvMatrix = mult(mvMatrix, translationMatrix(model.tx, model.ty, model.tz));

	mvMatrix = mult(mvMatrix, rotationZZMatrix(model.rotAngleZZ));

	mvMatrix = mult(mvMatrix, rotationYYMatrix(model.rotAngleYY));

	mvMatrix = mult(mvMatrix, rotationXXMatrix(model.rotAngleXX));

	mvMatrix = mult(mvMatrix, scalingMatrix(model.sx, model.sy, model.sz));

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// Associating the data to the vertex shader

	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Color Vectors

	initBuffers(model);

	// Drawing 

	// primitiveType allows drawing as filled triangles / wireframe / vertices

	if (primitiveType == gl.LINE_LOOP) {

		// To simulate wireframe drawing!

		// No faces are defined! There are no hidden lines!

		// Taking the vertices 3 by 3 and drawing a LINE_LOOP

		var i;

		for (i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++) {

			gl.drawArrays(primitiveType, 3 * i, 3);
		}
	} else {

		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);

	}
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {

	var pMatrix;

	var mvMatrix = mat4();

	// Clearing the frame-buffer and the depth-buffer

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Computing the Projection Matrix

	// A standard view volume.

	// Viewer is at (0,0,0)

	// Ensure that the model is "inside" the view volume

	pMatrix = perspective(45, 1, 0.05, 15);

	// NEW --- The viewer is on (0,0,0)

	pos_Viewer[0] = 0.0;
	pos_Viewer[1] = 0.0;
	pos_Viewer[2] = 0.0;

	pos_Viewer[3] = 1.0;

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// NEW --- Passing the viewer position to the vertex shader

	gl.uniform4fv(gl.getUniformLocation(shaderProgram, "viewerPosition"),
		flatten(pos_Viewer));

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE

	mvMatrix = mult(mvMatrix, translationMatrix(globalTx, globalTy, globalTz));
	mvMatrix = mult(mvMatrix, rotationXXMatrix(30));

	// Instantianting all scene models

	for (var i = 0; i < sceneModels.length; i++) {
		drawModel(sceneModels[i],
			mvMatrix,
			primitiveType);
	}

	for (var i = 0; i < boardTileModels.length; i++) {
		drawModel(boardTileModels[i],
			mvMatrix,
			primitiveType);
	}

	for (var i = 0; i < pieceModels.length; i++) {
		drawModel(pieceModels[i],
			mvMatrix,
			primitiveType);
	}


	// NEW - Counting the frames

	countFrames();
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

function animate() {

	let timeNow = new Date().getTime();

	if (lastTime != 0) {

		if (locked === 0) {
			globalDirection = "";

		} else {
			switch (globalDirection) {
				case "northwest":
					pieceModels[currentPiece].tx -= 0.01;
					pieceModels[currentPiece].tz -= 0.01;
					break;
				case "northeast":
					pieceModels[currentPiece].tx += 0.01;
					pieceModels[currentPiece].tz -= 0.01;
					break;
				case "southwest":
					pieceModels[currentPiece].tx -= 0.01;
					pieceModels[currentPiece].tz += 0.01;
					break;
				case "southeast":
					pieceModels[currentPiece].tx += 0.01;
					pieceModels[currentPiece].tz += 0.01;
					break;
			}
			locked -= 1;
			if (locked === 0) {
				const nextTurn = globalBoard.isWhiteTurn;
				globalBoard.isWhiteTurn = !nextTurn;
				highlightPiece(nextTurn * 11 + 1);
				highlightMoves(nextTurn * 11 + 1);
			}
		}
	}

	lastTime = timeNow;

}
//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com
let currentPiece = 0;
pieceModels[currentPiece].changeColor(1, 0, 1);
const globalBoard = new Board(8);
let highlightedTiles = [];
let moves = globalBoard.getMoveOpts(currentPiece);
let lastTime = 0;
let globalDirection = "";
let locked = 0;

function makeMove(direction) {
	clearHighlightedTiles();
	const [r, g, b] = pieceModels[currentPiece].defaultColor;
	globalBoard.move(currentPiece, direction,  moves[direction].maxMoves);

	pieceModels[currentPiece].changeColor(r, g, b);

	globalDirection = direction;
	locked = 25 * moves[direction].maxMoves;
}

function highlightMoves(pieceId) {
	moves = globalBoard.getMoveOpts(pieceId);
	for (const value of Object.values(moves)) {
		if (value.maxMoves > 0) {
			boardTileModels[value.position].changeColor(0, 1, 0);
			highlightedTiles.push(boardTileModels[value.position]);
		}
	}
}

function clearHighlightedTiles() {
	for (let t = 0; t < highlightedTiles.length; t++) {
		const [tr, tg, tb] = highlightedTiles[t].defaultColor;
		highlightedTiles[t].changeColor(tr, tg, tb);
	}
	highlightedTiles = [];
}

function highlightPiece(newPieceId) {
	const [r, g, b] = pieceModels[currentPiece].defaultColor;

	if (globalBoard.isWhiteTurn && newPieceId >= 0 && newPieceId < 12) {
		pieceModels[currentPiece].changeColor(r, g, b);
		currentPiece = newPieceId;
		pieceModels[currentPiece].changeColor(1, 0, 1);

		clearHighlightedTiles();
		highlightMoves(newPieceId);
	} else if (!globalBoard.isWhiteTurn && newPieceId >= 12 && newPieceId < 24) {
		pieceModels[currentPiece].changeColor(r, g, b);
		currentPiece = newPieceId;
		pieceModels[currentPiece].changeColor(1, 0, 1);

		clearHighlightedTiles();
		highlightMoves(newPieceId);
	}
}

// dicionario de peças
const keys = {
	"PageUp": {
		isPressed: false,
		performAction: () => {
			globalTz += 0.25;
		}
	},
	"PageDown": {
		isPressed: false,
		performAction: () => {
			globalTz -= 0.25;
		}
	},
	"q": {
		isPressed: false,
		performAction: () => {
			keys["q"].isPressed = false;
			makeMove("northwest");
		}
	},
	"w": {
		isPressed: false,
		performAction: () => {
			keys["w"].isPressed = false;
			makeMove("northeast");
		}
	},
	"a": {
		isPressed: false,
		performAction: () => {
			keys["a"].isPressed = false;
			makeMove("southwest");
		}
	},
	"s": {
		isPressed: false,
		performAction: () => {
			keys["s"].isPressed = false;
			makeMove("southeast");
		}
	},
	"ArrowLeft": {
		isPressed: false,
		performAction: () => {
			keys["ArrowLeft"].isPressed = false;
			highlightPiece(currentPiece - 1);
		}
	},
	"ArrowRight": {
		isPressed: false,
		performAction: () => {
			keys["ArrowRight"].isPressed = false;
			highlightPiece(currentPiece + 1);
		}
	},
	"ArrowUp": {
		isPressed: false,
		performAction: () => {
			keys["ArrowUp"].isPressed = false;
			highlightPiece(currentPiece + 4);
		}
	},
	"ArrowDown": {
		isPressed: false,
		performAction: () => {
			keys["ArrowDown"].isPressed = false;
			highlightPiece(currentPiece - 4);
		}
	},
}


function handleKeys() {
	if (locked > 0) return;
	for (const value of Object.values(keys)) {
		if (value.isPressed) {
			value.performAction();
		}
	}
}

//----------------------------------------------------------------------------

// Handling mouse events

var mouseDown = false;

var lastMouseX = null;

var lastMouseY = null;

function handleMouseDown(event) {

	mouseDown = true;

	lastMouseX = event.clientX;

	lastMouseY = event.clientY;
}

function handleMouseUp(event) {

	mouseDown = false;
}

function handleMouseMove(event) {

	if (!mouseDown) {

		return;
	}

	// Rotation angles proportional to cursor displacement

	var newX = event.clientX;

	var newY = event.clientY;

	var deltaX = newX - lastMouseX;

	angleYY += radians(10 * deltaX)

	var deltaY = newY - lastMouseY;

	angleXX += radians(10 * deltaY)

	lastMouseX = newX

	lastMouseY = newY;
}

//----------------------------------------------------------------------------

// Timer

function tick() {

	requestAnimFrame(tick);

	// NEW --- Processing keyboard events 

	if (locked === 0) {
		handleKeys();
	}

	drawScene();

	animate();
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos() {

}

//----------------------------------------------------------------------------

function setEventListeners(canvas) {

	// NEW ---Handling the mouse

	canvas.onmousedown = handleMouseDown;

	document.onmouseup = handleMouseUp;

	document.onmousemove = handleMouseMove;

	// NEW ---Handling the keyboard
	document.onkeydown = (event) => {
		if (keys[event.key]) {
			keys[event.key].isPressed = true;
		}
	}

	document.onkeyup = (event) => {
		if (keys[event.key]) {
			keys[event.key].isPressed = false;
		}
	}

	// Dropdown list

	var list = document.getElementById("rendering-mode-selection");

	list.addEventListener("click", function () {

		// Getting the selection

		var mode = list.selectedIndex;

		switch (mode) {

			case 0:
				primitiveType = gl.TRIANGLES;
				break;

			case 1:
				primitiveType = gl.LINE_LOOP;
				break;

			case 2:
				primitiveType = gl.POINTS;
				break;
		}
	});


}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL(canvas) {
	try {

		// Create the WebGL context

		// Some browsers still need "experimental-webgl"

		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		// DEFAULT: The viewport occupies the whole canvas 

		// DEFAULT: The viewport background color is WHITE

		// NEW - Drawing the triangles defining the model

		primitiveType = gl.TRIANGLES;

		// DEFAULT: Face culling is DISABLED

		// Enable FACE CULLING

		gl.enable(gl.CULL_FACE);

		// DEFAULT: The BACK FACE is culled!!

		// The next instruction is not needed...

		gl.cullFace(gl.BACK);

		// Enable DEPTH-TEST

		gl.enable(gl.DEPTH_TEST);

	} catch (e) {}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}
}

//----------------------------------------------------------------------------
function runWebGL() {

	let canvas = document.getElementById("checkers");

	console.log("Board", globalBoard);

	console.log(globalBoard.getMoveOpts(0))
	console.log(globalBoard.getMoveOpts(8))
	console.log(globalBoard.getMoveOpts(16));
	console.log(globalBoard.getMoveOpts(23));

	initWebGL(canvas);

	shaderProgram = initShaders(gl);

	setEventListeners(canvas);

	tick(); // A timer controls the rendering / animation    

	outputInfos();
}