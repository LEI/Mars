function Map()
{
	//if( typeof Map.initialized == "undefined" ) {

	Map.prototype.init = function(size, square, softness) {

		this.z = 50;
		this.size;
		this.square;

		this.map;
		this.tmp;

		this.softness;
		this.json;
		this.canvas;
		this.context;

		this.groundType = [
			'Roche',
			'Sable',
			'Minerai',
			'Fer',
			'Glace',
			'Autre'];

		this.groundWeight = [0.4, 0.2, 0.2, 0.1, 0.1, 0.0];

		this.size = size;
		this.square = square;
		this.softness = softness;

		this.map = [];
		this.tmp = [];

		for (x=0; x<this.size; x++) {
			this.map[x] = [];
			this.tmp[x] = [];
			for (y=0; y<this.size; y++) {
				// Hauteur entre -50 et 50 (converti en 0-100 pour la luminosité dans renderCanvas)
				this.map[x][y] = { 'z' : this.rand(-this.z,this.z) };
				// Récupération d'un type de matière
				this.tmp[x][y] = {'type' : this.getGroundType()/*, 'x': x, 'y': y*/ };
			}
		}

		while (this.softness >= 0) {

			// On applique soften() jusqu'à que softness soit à 0 -> render
			if (this.softness == 0) {
				this.renderCanvas(this.map);
				// Three.js
				renderThree(this.json);
			} else {
				this.soften(this.map);
			}

			this.softness--;

		}
	};

	//}

	Map.prototype.soften = function(map) {
		var size = this.size;
		for (var x=0; x<size; x++) {
			for (var y=0; y<size; y++) {
				var avg = [];

				// Interpréter top comme "front" et bot comme "behind"
				/*var squareZ = {
					'left-top': 	if (tmpZ = map[x-1][y-1] != undefined) avg.push(tmpZ.z),
					'top': 			if (tmpZ = map[x][y-1] != undefined) avg.push(tmpZ),
					'right-top': 	if (tmpZ = map[x+1][y-1] != undefined) avg.push(tmpZ),

					'left': 		if (tmpZ = map[x-1][y] != undefined) avg.push(tmpZ),
					'here': 		if (tmpZ = map[x][y] != undefined) avg.push(tmpZ),
					'right': 		if (tmpZ = map[x][y+1] != undefined) avg.push(tmpZ),

					'left-bot': 	if (tmpZ = map[x-1][y+1] != undefined) avg.push(tmpZ),
					'bot': 			if (tmpZ = map[x][y+1] != undefined) avg.push(tmpZ),
					'right-bot': 	if (tmpZ = map[x+1][y+1] != undefined) avg.push(tmpZ),
				};*/
				/*alert(map[x][y].z);
				if (map[x-1][y-1] != undefined) avg.push(map[x-1][y-1].z);
				if (map[x][y-1] != undefined) avg.push(map[x][y-1].z);
				if (map[x+1][y-1] != undefined) avg.push(map[x+1][y-1].z);

				if (map[x-1][y] != undefined) avg.push(map[x-1][y].z);
				if (map[x][y] != undefined) avg.push(map[x][y].z);
				if (map[x][y+1] != undefined) avg.push(map[x][y+1].z);

				if (map[x-1][y+1] != undefined) avg.push(map[x-1][y+1].z);
				if (map[x][y+1] != undefined) avg.push(map[x][y+1].z);
				if (map[x+1][y+1] != undefined) avg.push(map[x+1][y+1].z);*/

				avg.push(map[x][y].z);

				if (x!=0) {
					if (y!=0) {
						//avg.push(map[x][y-1].z);
						avg.push(map[x-1][y-1].z);
					}
					if (y!=(size-1)) {
						//avg.push(map[x][y+1].z);
						avg.push(map[x-1][y+1].z);
					}
					avg.push(map[x-1][y].z);
				}

				if (x!=(size-1)) {
					if (y!=0) {
						//avg.push(map[x][y-1].z);
						avg.push(map[x+1][y-1].z);
					}
					if (y!=(size-1)) {
						//avg.push(map[x][y+1].z);
						avg.push(map[x+1][y+1].z);
					}
					avg.push(map[x+1][y].z);
				}

				if (y!=0) {
					avg.push(map[x][y-1].z);
				}

				if (y!=(size-1)) {
					avg.push(map[x][y+1].z);
				}

				var total = 0;
				var length = avg.length;
				for (var i=0; i<length; i++) {
					total += avg[i];
				}

				// Mise à jour de la hauteur
				this.tmp[x][y].z =  Math.floor(total/length);

				// Transfert du type de terrain dans le nouveau tableau (déjà enregistré dans tmp lors de init)
				//this.tmp[x][y].type = map[x][y].type;
			}
		}

		this.map = this.tmp;
	};

	Map.prototype.renderCanvas = function(map) {
		// Création du canvas
		$('div').html('<canvas width="'+this.size+'" height="'+this.size+'" id="map"></canvas>');
		this.canvas = $('#map');
		this.context = this.canvas.get(0).getContext('2d');
		for (var x=0; x<this.size; x++) {
			for (var y=0; y<this.size; y++) {
				this.context.fillStyle = 'hsl(10,' + ((map[x][y].type*5) + 40) + '%,' + (( (map[x][y].z+50) * 2 )-50) + '%)';
				this.context.fillRect(	x * this.square,
									y * this.square,
									this.square,
									this.square
								);
			}
		}
		this.createJson(map);
	};
	
	// data URI?
	Map.prototype.createJson = function(map) {
		// Ajout de la taille de la carte pour exportation
		var data = { "size": this.size, "map": this.map };
		this.json = JSON.stringify(data, undefined, '\t');
		//console.log(map);
		//console.log(json);

		var blob = new Blob([this.json], {type: 'application/json'});
		var url  = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.download = 'map.json';
		a.href = url;
		//a.textContent = 'map.json';
		$('#map').wrap(a);
	};


	Map.prototype.getGroundType = function() {

		// Gestion de la répartition du terrain (en fonction des coordonnées ?)

		// Récupère un élément dans le tableau en fonction des probabilités
		var random_item = this.getRandomItem(this.groundType, this.groundWeight);

		for (var i=0; i<this.groundType.length; i++) {
			if (random_item == this.groundType[i]) {
				// Retour de l'index du terrain
				return i+1;
			}
		}
	};

	Map.prototype.getRandomItem = function(list, weight) {
		var total_weight = weight.reduce(function (prev, cur, i, arr) {
			return prev + cur;
		});
		var random_num = this.rand(0, total_weight);
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

	Map.prototype.rand = function(min, max) {
		return Math.random() * (max - min) + min;
	};

}