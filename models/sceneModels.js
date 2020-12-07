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

// // Model 0 --- Top Left

// sceneModels.push( new singleTriangleModel() );

// sceneModels[0].tx = -0.5; sceneModels[0].ty = 0.5;

// sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.5;

// // Model 1 --- Top Right

// sceneModels.push( new simpleCubeModel() );

// sceneModels[1].tx = 0.5; sceneModels[1].ty = 0.5;

// sceneModels[1].sx = sceneModels[1].sy = sceneModels[1].sz = 0.25;

// // Model 2 --- Bottom Right

// sceneModels.push( new tetrahedronModel( 1 ) );

// sceneModels[2].tx = 0.5; sceneModels[2].ty = -0.5;

// sceneModels[2].sx = sceneModels[2].sy = sceneModels[2].sz = 0.25;

// // Model 3 --- Bottom Left

// sceneModels.push( new cubeModel( 1 ) );

// sceneModels[3].tx = -0.5; sceneModels[3].ty = -0.5;

// sceneModels[3].sx = 0.4; sceneModels[3].sy = sceneModels[3].sz = 0.25;

// // Model 4 --- Middle

// sceneModels.push( new simpleCubeModel() );

// sceneModels[4].sx = 0.1; sceneModels[4].sy = 0.75; sceneModels[4].sz = 0.1;

// // Model 5 --- Middle

// sceneModels.push( new sphereModel( 3 ) );

// sceneModels[5].sx = 0.25; sceneModels[5].sy = 0.25; sceneModels[5].sz = 0.25;


// Tabuleiro
const board = new cubeModel(3);

board.sx = 1;
board.sy = 0.04;
board.sz = 0.75;

console.log(board);

sceneModels.push(board);


let piece;
const sxPiece = syPiece = szPiece = 0.05;
let txPiece;
const tyPiece = 0.05;
let tzPiece = 0.625;

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


