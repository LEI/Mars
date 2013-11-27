$(function() {

	var x, y, z = 100,
		size = 250,
		point = 1,
		smooth = 3,
		renderCount = 0,
		canvas,
		context;

	function initMap() {
		map = {},
		tmp = {};
		for (x=0; x<size; x++) {
			map[x] = {};
			tmp[x] = {};
			for (y=0; y<size; y++) {
				// Traitement du type de terrain
				map[x][y] = { 'z' : Math.floor((Math.random() * z)) + 1, 'type' : '' };
				tmp[x][y] = { 'z' : 0, 'type' : '' };
			}
		}

	}

	function soften(array) {
		for (x=0; x<size; x++) {
			for (y=0; y<size; y++) {

				// points = { 'aa' : tab[x-1][y-1], 'ab' : tab[x][y-1], 'ac' : tab[x+1][y-1],
				//		'ba' : tab[x-1][y], 'bb' : tab[x][y], 'bc' : tab[x+1][y],
				// 		'ca' : tab[x-1][y+1], 'cb' : tab[x][y+1], 'cc' : tab[x+1][y+1] };

				var avg = [];
				avg.push(array[x][y].z);

				if (x!=0) {
					if (y!=0) {
						//avg.push(array[x][y-1].z);
						avg.push(array[x-1][y-1].z);
					}
					if (y!=(size-1)) {
						//avg.push(array[x][y+1].z);
						avg.push(array[x-1][y+1].z);
					}
					avg.push(array[x-1][y].z);
				}

				if (x!=(size-1)) {
					if (y!=0) {
						//avg.push(array[x][y-1].z);
						avg.push(array[x+1][y-1].z);
					}
					if (y!=(size-1)) {
						//avg.push(array[x][y+1].z);
						avg.push(array[x+1][y+1].z);
					}
					avg.push(array[x+1][y].z);
				}

				if (y!=0) {
					avg.push(array[x][y-1].z);
				}

				if (y!=(size-1)) {
					avg.push(array[x][y+1].z);
				}

				var total = 0;
				var length = avg.length;
				for (var i=0; i<avg.length; i++) {
					total += avg[i];
				}

				tmp[x][y].z =  Math.floor(total/length);

			}
		}

		return tmp;
	}

	function render(array) {

		// Création du canvas
		$('div').append('<canvas width="'+size+'" height="'+size+'" id="map'+renderCount+'"></canvas>');
		canvas = $('#map'+renderCount);
		context = canvas.get(0).getContext('2d');

		for (x=0; x<size; x++) {
			for (y=0; y<size; y++) {
				context.fillStyle = 'hsl(25,50%,' + array[x][y].z + '%)';
				context.fillRect(	x * point,
									y * point,
									point,
									point
								);
			}
		}

		createLink(array);
		renderCount++;
	}

	function createLink(array) {
		var json = JSON.stringify(array, undefined, '\t');
		//console.log(array);
		//console.log(json);
		var blob = new Blob([json], {type: 'application/json'});
		var url  = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.download = 'map'+renderCount+'.json';
		a.href = url;
		//a.textContent = 'map'+renderCount+'.json';

		$('#map'+renderCount).wrap(a);
	}

	initMap();
	render(map);

	while (smooth-- > 0) {
		map = soften(map);
		//if (smooth == 0)
			render(map);
	}

});