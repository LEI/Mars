function Viewer()
{

	Viewer.prototype.render = function(json, square) {
		this.renderCanvas(json, square);
		this.renderThree(json);
	};

	Viewer.prototype.renderCanvas = function(json, square) {
		var json = $.parseJSON(json),
			map = json.map,
			size = json.size,
			square = square || 10,
			canvas,
			context;

		// Création du canvas en fonction de la taille totale et de la taille de chaque case
		$('#canvas2d').html('<canvas width="' + (size*square) +
								'" height="' + (size*square) +
								'" id="map"></canvas>');
		canvas = $('#map');
		context = canvas.get(0).getContext('2d');
		for (var x=0; x<size; x++) {
			for (var y=0; y<size; y++) {

				// Teinte en fonction du type
				var h = (map[x][y].type*3),
				// Saturation en fonction du type
				s = ((map[x][y].type*5)+40),
				// Luminosité en fonction de la hauteur
				l = (( (map[x][y].z+50) * 2 )-50);

				context.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';
				context.fillRect(	x * square,
									y * square,
									square,
									square
								);
			}
		}

		// Lien sur le canvas
		var blob = new Blob([json], {type: 'application/json'});
		var blobUrl  = URL.createObjectURL(blob);
		$a = document.createElement('a');
		$a.download = 'map.json';
		$a.href = blobUrl;
		$('#map').wrap($a);
	};

	Viewer.prototype.download = function(url) {
		// Téléchargement depuis une iframe
		var iframe;
		iframe = document.getElementById("hiddenDownloader");
		if (iframe === null) {
			iframe = document.createElement('iframe');  
			iframe.id = "hiddenDownloader";
			iframe.style.display = "none";
			document.body.appendChild(iframe);
		}
		iframe.src = url;
	};

	Viewer.prototype.renderThree = function(json) {

		// TODO

		map = $.parseJSON(json)
		//JSONLoader(map);

		//console.log(map);


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
		$('#viewer').html(renderer.domElement);

		renderer.render(scene, camera);
	};

}
