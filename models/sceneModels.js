//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//  J. Madeira - November 2018
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	// Transformation parameters

	// Displacement vector

	this.tx = 0.0;

	this.ty = 0.0;

	this.tz = 0.0;

	// Rotation angles	

	this.rotAngleXX = 0.0;

	this.rotAngleYY = 0.0;

	this.rotAngleZZ = 0.0;

	// Scaling factors

	this.sx = 1.0;

	this.sy = 1.0;

	this.sz = 1.0;

	// Animation controls

	this.rotXXOn = false;

	this.rotYYOn = false;

	this.rotZZOn = false;

	this.rotXXSpeed = 1.0;

	this.rotYYSpeed = 1.0;

	this.rotZZSpeed = 1.0;

	this.rotXXDir = 1;

	this.rotYYDir = 1;

	this.rotZZDir = 1;

	// Material features

	this.kAmbi = [0.2, 0.2, 0.2];

	this.kDiff = [0.7, 0.7, 0.7];

	this.kSpec = [0.7, 0.7, 0.7];

	this.nPhong = 100;
}

function singleTriangleModel() {

	var triangle = new emptyModelFeatures();

	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE

		-0.5, -0.5, 0.5,

		0.5, -0.5, 0.5,

		0.5, 0.5, 0.5,
	];

	triangle.normals = [

		// FRONTAL TRIANGLE

		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
	];

	return triangle;
}


function simpleCubeModel() {

	var cube = new emptyModelFeatures();

	cube.vertices = [

		-1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		-1.000000, 1.000000, 1.000000,
		-1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, 1.000000, 1.000000,
		-1.000000, -1.000000, -1.000000,
		-1.000000, 1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,
		-1.000000, -1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		-1.000000, 1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		-1.000000, 1.000000, 1.000000,
		-1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		-1.000000, -1.000000, -1.000000,
		1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, -1.000000,
		1.000000, -1.000000, 1.000000,
	];

	computeVertexNormals(cube.vertices, cube.normals);

	return cube;
}


function cubeModel(subdivisionDepth = 0) {

	var cube = new simpleCubeModel();

	midPointRefinement(cube.vertices, subdivisionDepth);

	computeVertexNormals(cube.vertices, cube.normals);

	return cube;
}


function simpleTetrahedronModel() {

	var tetra = new emptyModelFeatures();

	tetra.vertices = [

		-1.000000, 0.000000, -0.707000,
		0.000000, 1.000000, 0.707000,
		1.000000, 0.000000, -0.707000,
		1.000000, 0.000000, -0.707000,
		0.000000, 1.000000, 0.707000,
		0.000000, -1.000000, 0.707000,
		-1.000000, 0.000000, -0.707000,
		0.000000, -1.000000, 0.707000,
		0.000000, 1.000000, 0.707000,
		-1.000000, 0.000000, -0.707000,
		1.000000, 0.000000, -0.707000,
		0.000000, -1.000000, 0.707000,
	];

	computeVertexNormals(tetra.vertices, tetra.normals);

	return tetra;
}


function tetrahedronModel(subdivisionDepth = 0) {

	var tetra = new simpleTetrahedronModel();

	midPointRefinement(tetra.vertices, subdivisionDepth);

	computeVertexNormals(tetra.vertices, tetra.normals);

	return tetra;
}


function sphereModel(subdivisionDepth = 2) {

	var sphere = new simpleCubeModel();

	midPointRefinement(sphere.vertices, subdivisionDepth);

	moveToSphericalSurface(sphere.vertices)

	computeVertexNormals(sphere.vertices, sphere.normals);

	return sphere;
}

function cylinderModel() {
	var cylinder = new emptyModelFeatures();

	cylinder.vertices = [
		// Topo
		0.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		0.5, 1.0, -0.866,
		0.0, 1.0, 0.0,
		0.5, 1.0, -0.866,
		-0.5, 1.0, -0.866,
		0.0, 1.0, 0.0,
		-0.5, 1.0, -0.866,
		-1.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		-1.0, 1.0, 0.0,
		-0.5, 1.0, 0.866,
		0.0, 1.0, 0.0,
		-0.5, 1.0, 0.866,
		0.5, 1.0, 0.866,
		0.0, 1.0, 0.0,
		0.5, 1.0, 0.866,
		1.0, 1.0, 0.0,
		//Base
		0.0, -1.0, 0.0,
		0.5, -1.0, -0.866,
		1.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		-0.5, -1.0, -0.866,
		0.5, -1.0, -0.866,
		0.0, -1.0, 0.0,
		-1.0, -1.0, 0.0,
		-0.5, -1.0, -0.866,
		0.0, -1.0, 0.0,
		-0.5, -1.0, 0.866,
		-1.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.5, -1.0, 0.866,
		-0.5, -1.0, 0.866,
		0.0, -1.0, 0.0,
		1.0, -1.0, 0.0,
		0.5, -1.0, 0.866,
		// Faces Laterais
		-0.5, 1.0, 0.866,
		0.5, -1.0, 0.866,
		0.5, 1.0, 0.866,
		-0.5, 1.0, 0.866,
		-0.5, -1.0, 0.866,
		0.5, -1.0, 0.866,
		0.5, 1.0, 0.866,
		0.5, -1.0, 0.866,
		1.0, -1.0, 0.0,
		0.5, 1.0, 0.866,
		1.0, -1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, -1.0, 0.0,
		0.5, 1.0, -0.866,
		1.0, 1.0, 0.0,
		0.5, -1.0, -0.866,
		0.5, 1.0, -0.866,
		1.0, -1.0, 0.0,
		0.5, -1.0, -0.866,
		-0.5, 1.0, -0.866,
		0.5, 1.0, -0.866,
		0.5, -1.0, -0.866,
		-0.5, -1.0, -0.866,
		-0.5, 1.0, -0.866,
		-0.5, -1.0, -0.866,
		-1.0, 1.0, 0.0,
		-0.5, 1.0, -0.866,
		-0.5, -1.0, -0.866,
		-1.0, -1.0, 0.0,
		-1.0, 1.0, 0.0,
		-1.0, -1.0, 0.0,
		-0.5, -1.0, 0.866,
		-1.0, 1.0, 0.0,
		-0.5, -1.0, 0.866,
		-0.5, 1.0, 0.866,
		-1.0, 1.0, 0.0
	];

	computeVertexNormals(cylinder.vertices, cylinder.normals);

	return cylinder;
}






//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// Tabuleiro
const board = new cubeModel(3);

board.sx = 1;
board.sy = 0.04;
board.sz = 1;

console.log(board);

sceneModels.push(board);


let piece;
const sxPiece = syPiece = szPiece = 0.05;
let txPiece;
const tyPiece = 0.05;
let tzPiece = 0.75;

// Player 1 pieces
for(i = 0; i < 3; i++){

	txPiece = (i % 2) !== 0 ? -0.625  : -0.875;

	for (let j = 0; j < 4; j++) {
		piece = new cylinderModel();
	
		piece.sx = sxPiece;
		piece.sy = syPiece;
		piece.sz = szPiece;
	
		piece.tx = txPiece;
		piece.ty = tyPiece;
		piece.tz = tzPiece;
	
		sceneModels.push(piece);
	
		txPiece += 0.5;
	}

	
	tzPiece -= 0.25;
}

// Player 2 pieces
tzPiece = -0.25;
for(i = 0; i < 3; i++){

	txPiece = (i % 2) == 0 ? -0.625  : -0.875;

	for (let j = 0; j < 4; j++) {
		piece = new cylinderModel();
	
		piece.sx = sxPiece;
		piece.sy = syPiece;
		piece.sz = szPiece;
	
		piece.tx = txPiece;
		piece.ty = tyPiece;
		piece.tz = tzPiece;
	
		sceneModels.push(piece);
	
		txPiece += 0.5;
	}

	
	tzPiece -= 0.25;
}

