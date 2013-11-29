function Map () 
{
	this.x;
	this.y;
	this.z = 100;
	this.size;
	this.point;
	this.smooth;
	this.renderCount = 0;
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
	this.groundWeight = [0.3, 0.2, 0.2, 0.1, 0.1, 0.1];

	/* Construct
	------------ */
	if( typeof Map.initialized == "undefined" ) {

		Map.prototype.init = function(size, point, smooth) {
			this.size = size;
			this.point = point;
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

				// points = { 'aa' : tab[x-1][y-1], 'ab' : tab[x][y-1], 'ac' : tab[x+1][y-1],
				//		'ba' : tab[x-1][y], 'bb' : tab[x][y], 'bc' : tab[x+1][y],
				// 		'ca' : tab[x-1][y+1], 'cb' : tab[x][y+1], 'cc' : tab[x+1][y+1] };

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

	//data URL
	Map.prototype.createLink = function(map) {
		var json = JSON.stringify(map, undefined, '\t');
		//console.log(map);
		//console.log(json);
		var blob = new Blob([json], {type: 'application/json'});
		var url  = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.download = 'map'+this.renderCount+'.json';
		a.href = url;
		//a.textContent = 'map'+renderCount+'.json';

		$('#map'+this.renderCount).wrap(a);
	};

	Map.prototype.render = function(map) {
		// Création du canvas
		$('div').append('<canvas width="'+this.size+'" height="'+this.size+'" id="map'+this.renderCount+'"></canvas>');
		this.canvas = $('#map'+this.renderCount);
		this.context = this.canvas.get(0).getContext('2d');

		for (var x=0; x<this.size; x++) {
			for (var y=0; y<this.size; y++) {
				this.context.fillStyle = 'hsl(' + map[x][y].type*30 + ',50%,' + map[x][y].z + '%)';
				this.context.fillRect(	x * this.point,
									y * this.point,
									this.point,
									this.point
								);
			}
		}

		this.createLink(map);
		this.renderCount++;
	};

	Map.prototype.getGroundType = function() {
		// Récupère un élément dans le tableau en fonction des probabilités, à améliorer en fonction des coordonnées
		var random_item = this.getRandomItem(this.groundType, this.groundWeight);

		for (var i=0; i<this.groundType.length; i++) {
			if (random_item == this.groundType[i]) {
				// Retour de l'index du terrain
				return i+1;
			}
		}

		//return;
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