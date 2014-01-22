$(function() {

	// Initialisation
	var size = 50, //Math.floor( $(window).height() / 2 ),
		square = 10,
		softness = 4,
		Z = 50, // amplitude
		mars = new Map(),
		viewer = new Viewer(),
		curiosity = new Rover(viewer);

	$('#map_settings').submit( function(e) {
		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_softness').val();

		mars.init(size, softness, Z);
		viewer.render(mars.json, square);

		e.preventDefault();
	});

	$('#rover_settings').submit( function(e) {
		var start = $('#rover_start').val().split(','),
			end = $('#rover_end').val().split(','),
			startX = parseInt(start[0],10),
			startY = parseInt(start[1],10);

		viewer.render(mars.json, square);

		curiosity.init(mars.json, startX, startY);
		curiosity.goTo(end[0], end[1]);

		e.preventDefault();
	});

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_softness').attr('value',softness);

	$('#rover_start').attr('value','1,1');
	$('#rover_end').attr('value','10,10');

	// Render au chargement de la page
	$('#map_settings').submit();
	$('#rover_settings').submit();

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
				viewer.render(mars.json, square);
			  };
			})(f);

			reader.readAsText(f, 'application/json');
		}
		e.preventDefault();
	});
});