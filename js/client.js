$(function() {
	
	// Initialisation
	var size = 200;
	var square = 3;
	var smooth = 6;
	var map = new Map();
	map.init(size, square, smooth);

	// Injection des valeurs par défaut dans le formulaire
	$("#map_size").attr('placeholder',size).attr('value',size);
	$("#map_square").attr('placeholder',square).attr('value',square);
	$("#map_smooth").attr('placeholder',smooth).attr('value',smooth);

	// Ecoute du formulaire
	$("form").submit( function(e) {

		size = $("#map_size").val();
		square = $("#map_square").val();
		smooth = $("#map_smooth").val();

		map = new Map();
		map.init(size, square, smooth);
		e.preventDefault();

	});

	threeRender(map);

});