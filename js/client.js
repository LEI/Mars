$(function() {

	// Initialisation
	var size = 100, //Math.floor( $(window).height() / 2 ),
		square = 3,
		softness = 10,
		mars = new Map(),
		viewer = new Viewer();

	// Injection des valeurs par défaut dans le formulaire
	$('#map_size').attr('value',size);
	$('#map_square').attr('value',square);
	$('#map_softness').attr('value',softness);

	// Ecoute du formulaire
	$('#settings').submit( function(e) {
		size = $('#map_size').val();
		square = $('#map_square').val();
		softness = $('#map_softness').val();

		mars.init(size, softness);
		viewer.render(mars.json, square);

		e.preventDefault();
	});

	// Render au refresh
	$('#settings').submit();

	// Bouton JSON
	$('#download').submit( function(e) {
		viewer.download(mars.url);
		e.preventDefault();
	});

});