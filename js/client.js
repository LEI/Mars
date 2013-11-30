$(function() {
	
	// Initialisation
	var size = 200;
	var square = 3;
	var smooth = 6;

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('placeholder',size).attr('value',size);
	$('#map_square').attr('placeholder',square).attr('value',square);
	$('#map_smooth').attr('placeholder',smooth).attr('value',smooth);

	// Ecoute du formulaire
	$('form').submit( function(e) {

		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_smooth').val();

		map = new Map();
		map.init(size, square, softness);
		e.preventDefault();

	});

	// Render canvas au refresh
	$('form').submit();

	// Three.js
	threeRender(map);

});