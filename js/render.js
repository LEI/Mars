var threeRender = function(map) {


	// set some camera attributes
	var VIEW_ANGLE = 45,
		ASPECT = 1, //WIDTH / HEIGHT
		NEAR = 0.1,
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





	geometry = new THREE.PlaneGeometry( map.size, map.size, map.square, map.square);
	material = new THREE.MeshBasicMaterial( { color: 0xdd0000 } );
	mesh = new THREE.Mesh( plane, material );
	scene.add(mesh);

	//JSONLoader(map);

	var data = [], i = 0;
	for (var x=0; x<map.size; x++) {
		for (var y=0; y<map.size; y++) {

			data[i] = map.map[x][y].z;
			i++;

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
	renderer.setSize(map.size, map.size);

	// attach the render-supplied DOM element
	$('body').append(renderer.domElement);

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