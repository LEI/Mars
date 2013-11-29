$(function() {

	var x, y, z = 100,
		size = 1000,
		point = 3,
		smooth = 3,
		renderCount = 0,
		map,
		tmp,
		canvas,
		context,
		groundType = [
			'Roche',
			'Sable',
			'Minerai',
			'Fer',
			'Glace',
			'Autre'
		],
		groundWeight = [0.3, 0.2, 0.2, 0.1, 0.1, 0.1];

	function initMap() {
		map = [];
		tmp = [];
		for (x=0; x<size; x++) {
			map[x] = [];
			tmp[x] = [];
			for (y=0; y<size; y++) {
				// Traitement des coordonnées
				map[x][y] = { 'z' : rand(0,z), 'type' : getGroundType() };
				tmp[x][y] = {};
			}
		}
	}

	var rand = function(min, max) {
		return Math.random() * (max - min) + min;
	};

	var getRandomItem = function(list, weight) {
		var total_weight = weight.reduce(function (prev, cur, i, arr) {
			return prev + cur;
		});
		var random_num = rand(0, total_weight);
		var weight_sum = 0;
		//console.log(random_num)
		for (var i = 0; i < list.length; i++) {
			weight_sum += weight[i];
			weight_sum = +weight_sum.toFixed(2);

			if (random_num <= weight_sum) {
				return list[i];
			}
		}
	};

	var getGroundType = function() {

		// Récupère un élément dans le tableau en fonction des probabilités, à améliorer en fonction des coordonnées
		var random_item = getRandomItem(groundType, groundWeight);

		for (i=0; i<groundType.length; i++) {
			if (random_item == groundType[i]) {
				// Retour de l'index du terrain
				return i+1;
			}
		}

		//return;
	};

	function render(array) {

		// Création du canvas
		$('div').append('<canvas width="'+size+'" height="'+size+'" id="map'+renderCount+'"></canvas>');
		canvas = $('#map'+renderCount);
		context = canvas.get(0).getContext('2d');

		for (x=0; x<size; x++) {
			for (y=0; y<size; y++) {
				context.fillStyle = 'hsl(' + array[x][y].type*30 + ',50%,' + array[x][y].z + '%)';
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
		//console.log(json);
		var blob = new Blob([json], {type: 'application/json'});
		var url  = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.download = 'map'+renderCount+'.json';
		a.href = url;
		//a.textContent = 'map'+renderCount+'.json';

		$('#map'+renderCount).wrap(a);
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
				// Transfert du type de terrain dans le nouveau tableau
				tmp[x][y].type = array[x][y].type;

			}
		}

		return tmp;
	}

	initMap();
	//render(map);

	while (smooth-- > 0) {
		map = soften(map);
		if (smooth == 0)
			render(map);
	}

});