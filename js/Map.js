function Map() {
	this.ground = new Ground()

	Map.prototype.init = function (size, amplitude, softness, noise) {
		var	ds = new DiamondSquare(),
			i,j,z;
		this.z = amplitude;
		this.size = size;
		this.softness = softness;
		this.map = this.stuff();
		var diamondSquareMap = ds.generate(size, amplitude, noise),
		randMap = this.create();

		this.map = this.mergeMap(randMap, diamondSquareMap);

		this.createJson();
	};

	Map.prototype.stuff = function () {
		var map = [], randmin = 0, randmax = 100, // espacement des points-clés
		z_smooth = Math.floor(this.z/(this.softness*3));
		var space = Math.floor(this.rand(randmin,randmax));
		cnt = space;
		for (i = 0; i < this.size * this.size; i++) {
			if(cnt == 0) {
				value = Math.floor(this.rand(-this.z, this.z));
				space = Math.floor(this.rand(randmin,randmax));
				cnt = space;
			} else {
				value = Math.floor(this.rand(-z_smooth, z_smooth));
				cnt--;
			}

			// Hauteur entre -50 et 50 (converti en 0-100 pour la luminosité dans renderCanvas)
			map[i] = {
				'z': value,
				'type': this.ground.getType()
			};
		}
		return map;
	}

	// Création du fichier JSON
	Map.prototype.createJson = function () {
		// Ajout de la taille de la carte pour exportation
		var data = {
			"size": {"x":this.size,"y":this.size},
			"map": this.map
		};
		this.json = JSON.stringify(data);//, undefined, '\t');
		this.createURL(this.json);
	};

	Map.prototype.create = function () {
		while (this.softness >= 0) {
			if (this.softness == 0) {
				this.map = this.xyArray(this.map, this.size);

				return this.map;
			} else {
				// Lissage
				this.soften(this.map);
			}
			this.softness--;
		}
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

			var z = Math.floor(total / avg.length);

			// Mise à jour de la hauteur
			tmp[i] = { 'z': z, 'type': map[i].type };
		}

		this.map = tmp;

		//console.log(this.checkArea(2,2,5));
	};

	Map.prototype.mergeMap = function (map1, map2) {
		var newMap = [];
		for (i = 0; i < map1.length; i++) {
			newMap[i] = [];
			for (j = 0; j < map1[i].length; j++) {
				z = (map1[i][j].z + map2[i][j].z) / 2;
				newMap[i][j] = {
					'z': Math.floor(z),
					'type': map1[i][j].type
				}
			}
		}

		return newMap;
	}

	// Retourne un tableau à une dimension
	Map.prototype.mergeArray = function (array) {
		var newArray = [];
		for (var x = 0; x < array.length; x++) {
			for (var y = 0; y < array.length; y++) {
				newArray.push(array[x][y]);
			}
			//Array.prototype.push.apply(newArray, array[x]);
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