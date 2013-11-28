$(function() {

	var x, y, z = 100,
		size = 300,
		point = 10,
		smooth = 5,
		renderCount = 0,
		map,
		tmp,
		canvas,
		context,
		groundType = {
			'1' : 'Roche',
			'2' : 'Sable',
			'3' : 'Minerai',
			'4' : 'Fer',
			'5' : 'Glace',
			'6' : 'Autre'
		};

	function initMap() {
		map = [];
		tmp = [];
		for (x=0; x<size; x++) {
			map[x] = [];
			tmp[x] = [];
			for (y=0; y<size; y++) {
				// Traitement des coordonnées
				map[x][y] = { 'z' : Math.floor((Math.random() * z)) + 1, 'type' : initGroundType() };
				tmp[x][y] = {};
			}
		}
	}

	function initGroundType() {
		// Traitement du type de terrain

		var rand = Math.floor(Math.random() * Object.keys(groundType).length) + 1;

		return rand;
	}

	function soften(array) {
		for (x=0; x<size; x++) {
			for (y=0; y<size; y++) {
				var avg = [];

				// points = { 'aa' : tab[x-1][y-1], 'ab' : tab[x][y-1], 'ac' : tab[x+1][y-1],
				//		'ba' : tab[x-1][y], 'bb' : tab[x][y], 'bc' : tab[x+1][y],
				// 		'ca' : tab[x-1][y+1], 'cb' : tab[x][y+1], 'cc' : tab[x+1][y+1] };

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
				for (var i=0; i<length; i++) {
					total += avg[i];
				}

				tmp[x][y].z =  Math.floor(total/length);
				tmp[x][y].type = array[x][y].type;

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
				context.fillStyle = 'hsl(10,50%,' + array[x][y].z + '%)';
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

	//data url
	function createLink(array) {
		var json = JSON.stringify(array, undefined, '\t');
		//console.log(array);
		console.log(json);
		var blob = new Blob([json], {type: 'application/json'});
		var url  = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.download = 'map'+renderCount+'.json';
		a.href = url;
		//a.textContent = 'map'+renderCount+'.json';

		$('#map'+renderCount).wrap(a);
	}

	initMap();
	//render(map);

	while (smooth-- > 0) {
		map = soften(map);
		if (smooth == 0)
			render(map);
	}

});