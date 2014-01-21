$(function() {

	// Initialisation
	var size = 50, //Math.floor( $(window).height() / 2 ),
		square = 10,
		softness = 5,
		Z = 50, // amplitude
		mars = new Map(),
		viewer = new Viewer(),
		curiosity = new Rover(viewer);

	// Ecoute du formulaire
	$('#settings').submit( function(e) {
		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_softness').val();

		mars.init(size, softness, Z);
		viewer.render(mars.json, square);

		curiosity.init(mars.json);
		curiosity.goTo(2,2);

		e.preventDefault();
	});

	// Bouton JSON
	$('#download').submit( function(e) {
		viewer.download(mars.url);
		e.preventDefault();
	});

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_softness').attr('value',softness);
	// Render au chargement de la page
	$('#settings').submit();

	// Ecoute des touches
	$(document).keydown(function(e) {
		var key = e.keyCode;
		switch(key) {

			// Flèches
			case 37: curiosity.doStep(-1,0); break;
			case 38: curiosity.doStep(0,-1); break;
			case 39: curiosity.doStep(1,0); break;
			case 40: curiosity.doStep(0,1); break;

			case 97: curiosity.doStep(-1, 1); break; 	// 1
			case 98: curiosity.doStep(0, 1); break; 	// 2
			case 99: curiosity.doStep(1, 1); break; 	// 3
			case 100: curiosity.doStep(-1, 0); break; 	// 4
			case 102: curiosity.doStep(1, 0); break; 	// 6
			case 103: curiosity.doStep(-1, -1); break; 	// 7
			case 104: curiosity.doStep(0, -1); break; 	// 8
			case 105: curiosity.doStep(1, -1); break; 	// 9

			default: return;
		}
		e.preventDefault();
	});
});