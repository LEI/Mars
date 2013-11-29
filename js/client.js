$(function() {
	var map;
	
	$("form").submit( function(e) {

		var size = $("#map_size").val();
		var point = $("#map_point").val();
		var smooth = $("#map_smooth").val();

		map = new Map();
		map.init(size, point, smooth);
		e.preventDefault();

	});

});