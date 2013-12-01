$(function() {
	
	// Initialisation
	var size = 200, //Math.floor( $(window).height() / 2 ),
		square = 3,
		smooth = 10,
		newMap;

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_smooth').attr('value',smooth);

	// Ecoute du formulaire
	$('#settings').submit( function(e) {

		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_smooth').val();

		newMap = new Map();
		newMap.init(size, square, softness);
		e.preventDefault();

	});

	// Render canvas au refresh
	$('#settings').submit();

	$('#download').submit( function(e) {
		newMap.download();
		//$(window).open(newMap.json, 'map.json');
		e.preventDefault();
	});

	//$('header').append('<a href="' + renderedMap.url + '" download="map.json">Download JSON</a>');
});