$(function() {

	// Initialisation
	var size = 50, //Math.floor( $(window).height() / 2 ),
		square = 10,
		softness = 4,
		Z = 50, // amplitude
		mars = new Map(),
		viewer = new Viewer(),
		curiosity = new Rover(viewer),
		start = [1,1],
		end = [20,20];

	$('#map_settings').submit( function(e) {
		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_softness').val();

		mars.init(size, softness, Z);
		viewer.render(mars.json, square);
		curiosity.init(mars.json);

		e.preventDefault();
	});

	$('#map_reset').submit( function(e) {
		viewer.render(mars.json, square);
		curiosity.init(mars.json);

		e.preventDefault();
	});

	$('#map_ds').click( function(e) {
		mars.initDS(129, 10, 3);
		viewer.render(mars.json, 5);
		curiosity.init(mars.json);
	});

	$('#rover_settings').submit( function(e) {
		var startX = parseInt($('#rover_start_x').val(),10),
			startY = parseInt($('#rover_start_y').val(),10),
			endX = $('#rover_end_x').val(),
			endY = $('#rover_end_y').val();

		viewer.render(mars.json, square);

		curiosity.init(mars.json, startX, startY);
		curiosity.goTo(endX, endY);

		e.preventDefault();
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

		X = direction.x + curiosity.x;
		Y = direction.y + curiosity.y;

		curiosity.move(X, Y);

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
				viewer.render(mars.json, $('#map_square').val());
				curiosity.initMap(mars.json);

			  };
			})(f);

			reader.readAsText(f, 'application/json');
		}
		e.preventDefault();
	});

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_softness').attr('value',softness);

	$('#rover_start_x').attr('value',start[0]);
	$('#rover_start_y').attr('value',start[1]);
	$('#rover_end_x').attr('value',end[0]);
	$('#rover_end_y').attr('value',end[1]);

	// Render au chargement de la page
	$('#map_settings').submit();
	//$('#rover_settings').submit();

});