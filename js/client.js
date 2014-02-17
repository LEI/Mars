$(function() {

	// Initialisation
	var size = 100,
		square = 5,
		amplitude = 50,
		softness = 1,
		noise = 5,
		lumPlus = 50,
		lumCoef = 1,
		mars = new Map(),
		viewer = new Viewer(square),
		curiosity = new Rover(viewer),
		energy = 100,
		start = [1,1],
		end = [20,20];

	$('#generate').click( function(e) {
		size = $('#map_size').val();
		amplitude = $('#map_amplitude').val();
		softness = $('#map_softness').val();
		noise = $('#map_noise').val();

		mars.init(size, amplitude, softness, noise);

		$('#init').click();
		$('#step1').hide();
	});

	$('#init').click( function(e) {
		clearInterval(curiosity.tick);
		$('#log').html('');
		curiosity = new Rover(viewer);
		viewer.square = $('#map_square').val();
		viewer.render(mars.json);
	});


	// Download JSON
	$('#download').click( function(e) {
		mars.createURL(mars.json);
		viewer.download(mars.url);

		e.preventDefault();
	});

	// Upload JSON
	$('#import').click( function(e) {
		$('#upload').click();
		$('#map_render').click();
	});
	$('#upload').change( function(e) {
		var files = e.target.files,
			reader = new FileReader();

		for (var i = 0, f; f = files[i]; i++) {

			reader.onload = (function(theFile) {
			  return function(e) {

			  	$('#step1').hide();
			    mars.json = e.target.result;
				$('#init').click();

			  };
			})(f);

			reader.readAsText(f, 'application/json');
		}
		e.preventDefault();
	});

	$('#rover_init').click( function(e) {
		viewer.render(mars.json);
		curiosity.init(mars.json);
	});

	$('#rover_goto').click( function(e) {
		var startX = parseInt($('#rover_start_x').val(),10),
		startY = parseInt($('#rover_start_y').val(),10),
		endX = parseInt($('#rover_end_x').val(),10),
		endY = parseInt($('#rover_end_y').val(),10);

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
			//	A	Z	E
			//	Q		D
			//	W	X	C
			/*
			case 65: direction = {'x': -1,'y': -1};	break;	// A 	top left
			case 90: direction = {'x': 0,'y': -1}; break;	// Z	top
			case 69: direction = {'x': 1,'y': -1}; break;	// E 	top right
			case 81: direction = {'x': -1,'y': 0}; break;	// Q	left
			case 68: direction = {'x': 1,'y': 0}; break;	// D 	right
			case 87: direction = {'x': -1,'y': 1}; break;	// W 	bot left
			case 88: direction = {'x': 0,'y': 1}; break; 	// X 	bot
			case 67: direction = {'x': 1,'y': 1}; break;	// C 	bot right
			*/
			// Flèches
			case 37: direction = {'x': -1,'y': 0}; break;
			case 38: direction = {'x': 0,'y': -1}; break;
			case 39: direction = {'x': 1,'y': 0}; break;
			case 40: direction = {'x': 0,'y': 1}; break;

			default: return;
		}

		curiosity.doStep(direction.x, direction.y);
		e.preventDefault();
	});

	$('#btn_settings').on('click', function () {
		var $icon = $(this).find('i');
		if ($icon.hasClass('icon-plus')) {
			$icon.removeClass('icon-plus').addClass('icon-minus');
		} else {
			$icon.removeClass('icon-minus').addClass('icon-plus');
		}
		$('#more').slideToggle();
	});

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_amplitude').attr('value',amplitude);
	$('#map_softness').attr('value',softness);
	$('#map_noise').attr('value',noise);

	$('#map_square').attr('value',square);
	$('#map_lum_plus').attr('value',lumPlus);
	$('#map_lum_coef').attr('value',lumCoef);

	$('#rover_energy').attr('value',energy);
	$('#rover_start_x').attr('value',start[0]);
	$('#rover_start_y').attr('value',start[1]);
	$('#rover_end_x').attr('value',end[0]);
	$('#rover_end_y').attr('value',end[1]);

	// Render au chargement de la page
	$('#generate').click();
	$('#rover_goto').click();

});