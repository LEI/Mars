function Map()
{
	/*this.json;*/
	this.groundType = [
		'Roche',
		'Sable',
		'Minerai',
		'Fer',
		'Glace',
		'Autre'];

	this.groundWeight = [
		0.4,
		0.2,
		0.2,
		0.1,
		0.1,
		0.0];

	Map.prototype.init = function(size, softness) {
		this.z = 50;
		this.size = size;
		this.softness = softness;
		this.map = [];
		this.tmp = [];
		for (x=0; x<this.size; x++) {
			this.map[x] = [];
			this.tmp[x] = [];
			for (y=0; y<this.size; y++) {
				// Hauteur entre -50 et 50 (converti en 0-100 pour la luminosité dans renderCanvas)
				this.map[x][y] = { 'z' : this.rand(-this.z,this.z) };
				// Récupération d'un type de matière pour le fichier JSON final
				this.tmp[x][y] = {'type' : this.getGroundType()/*, 'x': x, 'y': y*/ };
			}
		}
		this.create();
	};

	Map.prototype.create = function() {
		while (this.softness >= 0) {
			if (this.softness == 0) {

				this.createJson();

			} else {
				// Lissage
				this.soften(this.map);
			}
			this.softness--;
		}
	};
	
	// Création du fichier JSON
	Map.prototype.createJson = function() {
		// Ajout de la taille de la carte pour exportation
		var data = { "size": this.size, "map": this.map };
		this.json = JSON.stringify(data, undefined, '\t');

		var dataURI = JSON.stringify(data);
		this.url = "data:application/octet-stream;base64," + Base64.encode(dataURI);
		//console.log(json);
	};

	Map.prototype.soften = function(map) {
		var size = this.size;
		for (var x=0; x<size; x++) {
			for (var y=0; y<size; y++) {

				var avg = [];

				/*var squareZ = {
					'left-top': 	map[x-1][y-1].z,
					'top': 			map[x][y-1].z,
					'right-top': 	map[x+1][y-1].z,

					'left': 		map[x-1][y].z,
					'here': 		map[x][y].z,
					'right': 		map[x][y+1].z,

					'left-bot': 	map[x-1][y+1].z,
					'bot': 			map[x][y+1].z,
					'right-bot': 	map[x+1][y+1].z,
				};*/
				/*if (map[x-1][y-1] != undefined) avg.push(map[x-1][y-1].z);
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

	/*
	Map.prototype.render = function(json) {
		if (json) {
			alert(json);
		} else {
			this.createJson();
		}

		this.renderCanvas();
		renderThree(this.json);
	};

	Map.prototype.renderCanvas = function() {
		// Création du canvas
		var map = this.map,
			canvas,
			context;
		// Taille du canvas en fonction de la taille totale et de la taille de chaque case
		$('#canvas').html('<canvas width="' + (this.size*this.square) +
								'" height="' + (this.size*this.square) +
								'" id="map"></canvas>');
		canvas = $('#map');
		context = canvas.get(0).getContext('2d');
		for (var x=0; x<this.size; x++) {
			for (var y=0; y<this.size; y++) {

				// Teinte en fonction du type
				var h = (map[x][y].type*3),
				// Saturation en fonction du type
				s = ((map[x][y].type*5)+40),
				// Luminosité en fonction de la hauteur
				l = (( (map[x][y].z+50) * 2 )-50);

				context.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';
				context.fillRect(	x * this.square,
									y * this.square,
									this.square,
									this.square
								);
			}
		}
	};

	Map.prototype.download = function() {

		//console.log(this.url);

		var url = this.url;
		// Téléchargement depuis une iframe
		var iframe;
		iframe = document.getElementById("hiddenDownloader");
		if (iframe === null) {
			iframe = document.createElement('iframe');  
			iframe.id = "hiddenDownloader";
			iframe.style.display = "none";
			document.body.appendChild(iframe);
		}
		iframe.src = url;
	};*/
}