$(function() {

	// Initialisation
	var size = 9, //Math.floor( $(window).height() / 2 ),
		square = 50,
		softness = 2,
		Z = 50, // amplitude
		mars = new Map(),
		viewer = new Viewer(),
		curiosity = new Rover(viewer);

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_softness').attr('value',softness);

	// Ecoute du formulaire
	$('#settings').submit( function(e) {
		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_softness').val();

		mars.init(size, softness, Z);
		viewer.render(mars.json, square);

		curiosity.init(mars.json);
		//curiosity.goTo(10,10);

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