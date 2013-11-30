var renderThree = function(map) {

	map = $.parseJSON(map)
	//JSONLoader(map);

	console.log(map);


	// set some camera attributes
	var SIZE = map.size,
		VIEW_ANGLE = 45,
		ASPECT = SIZE / SIZE,
		NEAR = 1,//0.1
		FAR = 10000;

	// create a WebGL renderer, camera
	// and a scene
	var renderer = new THREE.WebGLRenderer();
	var camera =
	new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR
	);

	var scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);


	geometry = new THREE.PlaneGeometry( SIZE, SIZE );
	material = new THREE.MeshBasicMaterial( { color: 0xdd0000 } );
	mesh = new THREE.Mesh( plane, material );
	scene.add(mesh);

	var data = [], i = 0;
	for (var x=0; x<SIZE; x++) {
		for (var y=0; y<SIZE; y++) {

			data[i] = map.map[x][y].z;
			i++;
//	console.log(i);

		}
	}
	for (var i = 0, l = geometry.vertices.length; i < l; i++) {
	  geometry.vertices[i].z = data[i] / 65535 * 10;

	}

	var material = new THREE.MeshPhongMaterial({
	  color: 0xdddddd, 
	  wireframe: true
	});

	var plane = new THREE.Mesh(geometry, material);
	scene.add(plane);






	/*// set up the sphere vars
	var radius = 50,
	segments = 16,
	rings = 16;

	var sphereMaterial =
		new THREE.MeshLambertMaterial(
			{
				color: 0xCC0000
			});

	// create a new mesh with sphere geometry
	var sphere = new THREE.Mesh(

		new THREE.SphereGeometry(
			radius,
			segments,
			rings),

	sphereMaterial);

	// add the sphere to the scene
	scene.add(sphere);*/

	// create a point light
	var pointLight =
		new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	// add to the scene
	scene.add(pointLight);

	// the camera starts at 0,0,0
	// so pull it back
	camera.position.z = 300;

	// start the renderer
	renderer.setSize(SIZE, SIZE);

	// attach the render-supplied DOM element
	$('div').append(renderer.domElement);

	renderer.render(scene, camera);

	// Création du canvas
	/*$('div').html('<canvas width="'+this.size+'" height="'+this.size+'" id="map"></canvas>');
	this.canvas = $('#map');
	this.context = this.canvas.get(0).getContext('2d');
	for (var x=0; x<this.size; x++) {
		for (var y=0; y<this.size; y++) {
			this.context.fillStyle = 'hsl(10,' + ((map[x][y].type*5) + 40) + '%,' + map[x][y].z + '%)';
			this.context.fillRect(	x * this.square,
								y * this.square,
								this.square,
								this.square
							);
		}
	}
	this.createLink(map);*/

	/*var camera, scene, renderer;
	var plane, geometry, material, mesh;

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 250;

    scene = new THREE.Scene();


	plane = new THREE.PlaneGeometry( this.size, this.size, this.square, this.square);
	material = new THREE.MeshBasicMaterial( { color: 0xdd0000 } );
	mesh = new THREE.Mesh( plane, material );
	scene.add(mesh);

	//JSONLoader(this);

	var data = [], i = 0;
	for (var x=0; x<this.size; x++) {
		for (var y=0; y<this.size; y++) {

			data[i] = this.map[x][y].z;
			i++;

		}
	}

	var geometry = new THREE.PlaneGeometry(this.size, this.size, 10, 10);

	for (var i = 0, l = geometry.vertices.length; i < l; i++) {
	  geometry.vertices[i].z = data[i] / 65535 * 10;

	}

	var material = new THREE.MeshPhongMaterial({
	  color: 0xdddddd, 
	  wireframe: true
	});

	var plane = new THREE.Mesh(geometry, material);
	scene.add(plane);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    var render = function () {
		requestAnimationFrame(render);


		renderer.render(scene, camera);
	};

	render();*/





};






/*var renderThree2 = function(map) {

	// standard global variables
	var container, scene, camera, renderer, controls;
	// custom global variables
	var cube;

	init();
	animate();

}


// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	
	// RENDERER
		renderer = new THREE.WebGLRenderer( {antialias:true} );
		//renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = $('body');
	container.append( renderer.domElement );
	// EVENTS
	//THREEx.WindowResize(renderer, camera);
	//THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	//controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

	////////////
	// CUSTOM //
	////////////
	
	//////////////////////////////////////////////////////////////////////
	
	// this material causes a mesh to use colors assigned to faces
	var cubeMaterial = new THREE.MeshBasicMaterial( 
	{ color: 0xffffff, vertexColors: THREE.FaceColors } );
	
	var cubeGeometry = new THREE.CubeGeometry( 80, 80, 80, 3, 3, 3 );
	for ( var i = 0; i < cubeGeometry.faces.length; i++ ) 
	{
		face  = cubeGeometry.faces[ i ];	
		face.color.setRGB( Math.random(), Math.random(), Math.random() );		
	}
	cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set(-100, 50, 0);
	scene.add(cube);
	
	//////////////////////////////////////////////////////////////////////

	// this material causes a mesh to use colors assigned to vertices
	//   different colors at face vertices create gradient effect
	var cubeMaterial = new THREE.MeshBasicMaterial( 
	{ color: 0xffffff, vertexColors: THREE.VertexColors } );
	
	var color, face, numberOfSides, vertexIndex;
	
	// faces are indexed using characters
	var faceIndices = [ 'a', 'b', 'c', 'd' ];
	
	// randomly color cube
	var cubeGeometry = new THREE.CubeGeometry( 80, 80, 80, 3, 3, 3 );
	for ( var i = 0; i < cubeGeometry.faces.length; i++ ) 
	{
		face  = cubeGeometry.faces[ i ];	
		// determine if current face is a tri or a quad
		numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
		// assign color to each vertex of current face
		for( var j = 0; j < numberOfSides; j++ ) 
		{
			vertexIndex = face[ faceIndices[ j ] ];
			// initialize color variable
			color = new THREE.Color( 0xffffff );
			color.setHex( Math.random() * 0xffffff );
			face.vertexColors[ j ] = color;
		}
	}
	cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set(0, 50, 0);
	scene.add(cube);

	//////////////////////////////////////////////////////////////////////
	
	// RGB color cube
	var size = 80;
	var point;
	var cubeGeometry = new THREE.CubeGeometry( size, size, size, 1, 1, 1 );
	for ( var i = 0; i < cubeGeometry.faces.length; i++ ) 
	{
		face = cubeGeometry.faces[ i ];
		// determine if current face is a tri or a quad
		numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
		// assign color to each vertex of current face
		for( var j = 0; j < numberOfSides; j++ ) 
		{
			vertexIndex = face[ faceIndices[ j ] ];
			// store coordinates of vertex
			point = cubeGeometry.vertices[ vertexIndex ];
			// initialize color variable
			color = new THREE.Color( 0xffffff );
			color.setRGB( 0.5 + point.x / size, 0.5 + point.y / size, 0.5 + point.z / size );
			face.vertexColors[ j ] = color;
		}
	}
	cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set( 100, 50, 0 );
	scene.add(cube);
	
}

function animate() 
{
    requestAnimationFrame( animate );
	renderT();		
	update();
}

function update()
{
	if ( keyboard.pressed("z") ) 
	{ 
		// do something
	}
	
	//controls.update();
	//stats.update();
}

function renderT() 
{
	renderer.render( scene, camera );
}*/