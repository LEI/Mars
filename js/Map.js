function Map() {
	Map.prototype.init = function (size, softness, amplitude) {
		var ground = new Ground();
		this.z = amplitude;
		this.size = size;
		this.softness = softness;
		this.map = [];

		for (var i = 0; i < size * size; i++) {
			// Hauteur entre -50 et 50 (converti en 0-100 pour la luminosité dans renderCanvas)
			this.map[i] = {
				'z': this.rand(-this.z, this.z),
				'type': ground.getType()
			};
		}
		this.create();
	};

	Map.prototype.initDS = function(size, amplitude, noise) {
		var ds = new DiamondSquare();
		ds = ds.generate(size, amplitude, noise);

		this.size = size;
		this.map = ds;

		var data = {
			"size": this.size,
			"map": this.map
		};
		this.json = JSON.stringify(data);
		this.createURL(this.json);
	}

	Map.prototype.create = function () {
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
	Map.prototype.createJson = function () {
		// Ajout de la taille de la carte pour exportation
		var data = {
			"size": this.size,
			"map": this.xyArray(this.map, this.size)
		};
		this.json = JSON.stringify(data, undefined, '\t');
		this.createURL(this.json);
	};

	Map.prototype.createURL = function (json) {
		this.url = "data:application/octet-stream;base64," + Base64.encode(json);
	};

	Map.prototype.soften = function (map) {

		function ifindex(array, index) {
			if (array[index]) {
				avg.push(array[index].z);
			}
		}

		var tmp = [],
			t = -this.size, // top
			b = this.size,	// bot
			l = -1,			// left
			r = +1;			// right

		for (var i = 0; i < map.length; i++) {

			var avg = [];
			avg.push(map[i].z);

			// Pas de gestion des bords
			ifindex(map, i + t + l);
			ifindex(map, i + t);
			ifindex(map, i + t + r);
			ifindex(map, i + l);
			ifindex(map, i + r);
			ifindex(map, i + b + l);
			ifindex(map, i + b);
			ifindex(map, i + b + r);

			var total = 0;
			for (var j = 0; j < avg.length; j++) {
				total += avg[j];
			}
			var z = total / avg.length;

			// Mise à jour de la hauteur
			tmp[i] = { 'z': z, 'type': map[i].type };
		}

		this.map = tmp;
	};

	// Retourne un tableau à une dimension
	Map.prototype.mergeArray = function (array) {
		var newArray = [];
		for (var x = 0; x < array.length; x++) {
			/*for (var y = 0; y < array.length; y++) {
				newArray.push(array[x][y]);
			}*/
			Array.prototype.push.apply(newArray, array[x]);
		}

		return newArray;
	};

	// Retourne un tableau à deux dimensions
	Map.prototype.xyArray = function (array, size) {
		// square length
		var i = 0, newArray = [];
		for (var x = 0; x < size; x++) {
			newArray[x] = [];
			for (var y = 0; y < size; y++) {
				newArray[x].push({
					"z": Math.floor(array[i].z),
					"type": array[i].type
				});
				i++;
			}
		}
		return newArray;
	};

	Map.prototype.rand = function (min, max) {
		return Math.random() * (max - min) + min;
	};
}