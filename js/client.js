$(function() {

	// Initialisation
	var size = 70,
		square = 5,
		softness = 2,
		amplitude = 50,
		noise = 5,
		lumPlus = 50,
		lumCoef = 1,
		mars = new Map(),
		viewer = new Viewer(square),
		curiosity = new Rover(viewer),
		start = [1,1],
		end = [20,20];

	$('#map_init').click( function(e) {
		viewer.square = $('#map_square').val();
		viewer.render(mars.json);
	});

	$('#map_render').click( function(e) {
		size = $('#map_size').val();
		amplitude = $('#map_amplitude').val();
		softness = $('#map_softness').val();
		noise = $('#map_noise').val();

		if ($('#map_rand').is(':checked')) {
			mars.init(size, amplitude, softness);
		} else if ($('#map_ds').is(':checked')) {
			mars.initDS(size, amplitude, noise);
		}

		$('#map_init').click();
	});

	$('#rover_init').click( function(e) {
		if ($('#map_test').is(':checked')) {
			// Affiche en rouge les pentes > 150%
			viewer.testSlopes = true;
		} else {
			viewer.testSlopes = false;
		}
		viewer.render(mars.json);
		curiosity.init(mars.json);
	});

	$('#rover_goto').click( function(e) {
		var startX = parseInt($('#rover_start_x').val(),10),
		startY = parseInt($('#rover_start_y').val(),10),
		endX = $('#rover_end_x').val(),
		endY = $('#rover_end_y').val();

        viewer.render(mars.json);

        curiosity.init(mars.json, startX, startY);
        curiosity.goTo(endX, endY);
	});

	$('#rover_stop').click( function(e) {
		console.log('Arrêt d\'urgence')
		clearInterval(curiosity.tick);
	});

	// Ecoute des touches
	$(document).keydown(function(e) {
		var X, Y, direction, key = e.keyCode;
		switch(key) {
			case 65: direction = {'x': -1,'y': -1};	break;	// A 	top left
			case 90: direction = {'x': 0,'y': -1}; break;	// Z	top
			case 69: direction = {'x': 1,'y': -1}; break;	// E 	top right
			case 81: direction = {'x': -1,'y': 0}; break;	// Q	left
			case 68: direction = {'x': 1,'y': 0}; break;	// D 	right
			case 87: direction = {'x': -1,'y': 1}; break;	// W 	bot left
			case 88: direction = {'x': 0,'y': 1}; break; 	// X 	bot
			case 67: direction = {'x': 1,'y': 1}; break;	// C 	bot right

			// Flèches
			case 37: direction = {'x': -1,'y': 0}; break;
			case 38: direction = {'x': 0,'y': -1}; break;
			case 39: direction = {'x': 1,'y': 0}; break;
			case 40: direction = {'x': 0,'y': 1}; break;

			default: return;
		}

		//X = direction.x + curiosity.x;
		//Y = direction.y + curiosity.y;

		curiosity.doStep(direction.x, direction.y);

		e.preventDefault();
	});

	// Download JSON
	$('#download').submit( function(e) {
		mars.createURL(mars.json);
		viewer.download(mars.url);

		e.preventDefault();
	});

	// Upload JSON
	$('#upload input').change( function(e) {
		var files = e.target.files,
			reader = new FileReader();

		for (var i = 0, f; f = files[i]; i++) {

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
			  return function(e) {

			    mars.json = e.target.result;
				$('#map_init').click();

			  };
			})(f);

			reader.readAsText(f, 'application/json');
		}
		e.preventDefault();
	});

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_amplitude').attr('value',amplitude);
	$('#map_softness').attr('value',softness);
	$('#map_noise').attr('value',noise);

	$('#map_square').attr('value',square);
	$('#map_lum_plus').attr('value',lumPlus);
	$('#map_lum_coef').attr('value',lumCoef);

	$('#rover_start_x').attr('value',start[0]);
	$('#rover_start_y').attr('value',start[1]);
	$('#rover_end_x').attr('value',end[0]);
	$('#rover_end_y').attr('value',end[1]);

	// Render au chargement de la page
	$('#map_render').click();
	$('#rover_goto').click();

});