function Map()
{
	/*this.x;
	this.y;*/
	this.z = 100;
	this.size;
	this.square;
	this.smooth;
	this.map;
	this.tmp;
	this.canvas;
	this.context;
	this.groundType = [
		'Roche',
		'Sable',
		'Minerai',
		'Fer',
		'Glace',
		'Autre'
	];
	this.groundWeight = [0.4, 0.2, 0.2, 0.1, 0.1, 0.0];

	/* Construct
	------------ */
	if( typeof Map.initialized == "undefined" ) {

		Map.prototype.init = function(size, square, smooth) {
			this.size = size;
			this.square = square;
			this.smooth = smooth;

			this.map = [];
			this.tmp = [];
			for (x=0; x<this.size; x++) {
				this.map[x] = [];
				this.tmp[x] = [];
				for (y=0; y<this.size; y++) {
					// Traitement des coordonnées
					this.map[x][y] = { 'z' : this.rand(0,this.z), 'type' : this.getGroundType() };
					this.tmp[x][y] = {};
				}
			}

			while (this.smooth-- > 0) {
				this.soften(this.map);
				if (this.smooth == 0)
					this.render(this.map);
			}
		};

	}

	/* Methods
	---------- */
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

				this.tmp[x][y].z =  Math.floor(total/length);
				// Transfert du type de terrain dans le nouveau tableau
				this.tmp[x][y].type = map[x][y].type;
			}
		}

		this.map = this.tmp;
	};

	Map.prototype.render = function(map) {
		// Création du canvas
		$('div').html('<canvas width="'+this.size+'" height="'+this.size+'" id="map"></canvas>');
		this.canvas = $('#map');
		this.context = this.canvas.get(0).getContext('2d');
		for (var x=0; x<this.size; x++) {
			for (var y=0; y<this.size; y++) {
				this.context.fillStyle = 'hsl(10,' + ((map[x][y].type*5) + 40) + '%,' + map[x][y].z + '%)';
				this.context.fillRect(	x * this.square,
									y * this.square,
									this.square,
									this.square
								);
			}
		}
		this.createLink(map);
	};
	
	// data URI?
	Map.prototype.createLink = function(map) {
		// Ajout de la taille de la carte pour exportation
		var json = { "size": this.size, "map": this.map };
		json = JSON.stringify(json, undefined, '\t');
		//console.log(map);
		//console.log(json);
		var blob = new Blob([json], {type: 'application/json'});
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