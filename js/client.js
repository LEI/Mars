$(function() {

	// Initialisation
	var size = 50, //Math.floor( $(window).height() / 2 ),
		square = 10,
		softness = 10,
		amplitude = 50,
		mars = new Map(),
		curiosity = new Rover(),
		viewer = new Viewer(square);

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_softness').attr('value',softness);
	$('#map_amplitude').attr('value',amplitude);

	// Ecoute du formulaire
	$('#settings').submit( function(e) {
		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_softness').val();
		amplitude = $('#map_amplitude').val();

		mars.init(size, softness, amplitude);
		viewer.render(mars.json);

		curiosity.init(mars.json, viewer);

		e.preventDefault();
	});

	// Render au refresh
	$('#settings').submit();

	// Bouton JSON
	$('#download').submit( function(e) {
		viewer.download(mars.url);
		e.preventDefault();
	});

	// Ecoute des touches
	$(document).keydown(function(e) {
		var key = e.keyCode;
		// Gestion des flèches
		switch(key) {
			case 37: curiosity.move(-1,0); break;
			case 38: curiosity.move(0,-1); break;
			case 39: curiosity.move(1,0); break;
			case 40: curiosity.move(0,1); break;
			// Arrêt si aucune correspondance
			default: return;
		}
		e.preventDefault();
	});

});