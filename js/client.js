$(function() {
	
	// Initialisation
	var size = 100, //Math.floor( $(window).height() / 2 ),
		square = 3,
		smooth = 10,
		mars = new Map();

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_smooth').attr('value',smooth);

	// Ecoute du formulaire
	$('#settings').submit( function(e) {
		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_smooth').val();

		mars.init(size, square, softness);

		e.preventDefault();
	});

	// Render canvas au refresh
	$('#settings').submit();

	// Bouton JSON
	//$('header').append('<a href="' + renderedMap.url + '" download="map.json">Download JSON</a>');
	$('#download').submit( function(e) {
		mars.download();
		//$(window).open(mars.json, 'map.json');
		e.preventDefault();
	});

});