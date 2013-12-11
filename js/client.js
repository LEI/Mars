$(function() {

	// Initialisation
	var size = 50, //Math.floor( $(window).height() / 2 ),
		square = 10,
		softness = 10,
		amplitude = 50,
		mars = new Map(),
		viewer = new Viewer();

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
		viewer.render(mars.json, square);

		mars.addRover();
		viewer.renderRover(mars, square);

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