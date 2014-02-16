function Viewer(square)
{
	this.square = square;

	// Peut être appellé avec un JSON externe, square facultatif (1 par défaut)
	Viewer.prototype.render = function(json) {
		this.json = $.parseJSON(json);
		this.map = this.json.map;
		this.size = this.getJsonSize(this.json);

		// Création du canvas en fonction de la taille totale et de la taille de chaque case
		$('#canvas').html('<canvas width="' + (this.size*this.square) + '" height="' + (this.size*this.square) + '" id="map"></canvas>');
		this.canvas = $('#map');
		this.context = this.canvas.get(0).getContext('2d');

		this.path = [];

		this.drawCanvas(this.json);

		this.addLink(this.json);
	};

	Viewer.prototype.drawCanvas = function(json, rover) {
		var size = this.size,
			lumplus = parseInt($('#map_lum_plus').val(),10),
			lumcoef = parseInt($('#map_lum_coef').val(),10);

		for (var x = 0; x < size; x++) {
			for (var y = 0; y < size; y++) {

				// Teinte en fonction du type
				var h = 10;//json.map[x][y].type*3,
				// Saturation en fonction du type
				s = 60;//(json.map[x][y].type*5)+40,
				// Luminosité en fonction de la hauteur
				l = json.map[x][y].z;

				l = (l + lumplus) * lumcoef;

				this.context.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';

				this.context.fillRect(
					x * this.square,
					y * this.square,
					this.square,
					this.square
				);
			}
		}

		// Enregistrement de l'image de la carte
		this.imageData = this.context.getImageData(0, 0, this.size * this.square, this.size * this.square);
		this.originalData = this.context.createImageData(this.imageData);
		for (var i = 0; i < this.imageData.data.length; i++) {
			this.originalData.data[i] = this.imageData.data[i];
		}
	};

	Viewer.prototype.drawSquare = function(x, y, fn) {
		// Récupération de l'image
		var newData = this.context.getImageData(
			x * this.square,
			y * this.square,
			this.square,
			this.square
		),
		newPx = newData.data,
		oldData = this.originalData,
		oldPx = oldData.data
		len = newPx.length,
		res = [];

		// Remplacement des données des pixels
		for (var i = 0; i < len; i += 4) {
			res = fn.call(oldPx[i], oldPx[i+1], oldPx[i+2], oldPx[i+3]);
			newPx[i] = res[0]; 		// r
			newPx[i+1] = res[1]; 	// g
			newPx[i+2] = res[2]; 	// b
			newPx[i+3] = res[3]; 	// a
		}

		// Mise à jour du canvas
		this.context.putImageData(
			newData,
			x * this.square,
			y * this.square
		);
	};

	Viewer.prototype.drawRover = function(rover) {
		var newData = this.context.getImageData(
			rover.x * this.square,
			rover.y * this.square,
			this.square,
			this.square
		)
		// Reset de l'image de la carte
		this.context.putImageData(this.originalData, 0, 0);

		var i, test;
		for (i in rover.nearSquares.near) {
			test = rover.nearSquares.near[i];
			if (test.result == 'success') {
				//[0,255,0,255];
			} else if (test.result == 'fail') {
				this.drawSquare(test.x, test.y, function(r, g, b, a) {
					return [0, 0, 0, 255];
				});
			} else if (test.result == 'impossible') {
				this.drawSquare(test.x, test.y, function(r, g, b, a) {
					return [255, 255, 255, 255];
				});
			}
		}

		// Parcours du Rover
		/*this.path.push({'x': rover.x, 'y': rover.y});
		for (var j = 0, len = this.path.length; j < len; j++) {
			this.drawSquare(this.path[j].x, this.path[j].y, function(r, g, b, a) {
				//console.log(r,g,b,a)
				r = 0;
				g = 0;
				b = 0;
				a = 100;
				return [Math.floor(r), Math.floor(g), Math.floor(b), a];
			});
		}*/

		this.drawSquare(rover.x, rover.y, function(r, g, b, a) {
			return [0, 0, 255, 255];
		});

	};

	Viewer.prototype.getJsonSize = function(json) {
		var size = json.size;

		if (typeof size == 'object') {
			size = size.x;
		}

		return size;
	};

	// Téléchargement depuis une iframe (bouton JSON)
	Viewer.prototype.download = function(url) {
		var iframe;
		iframe = document.getElementById("hiddenDownloader");
		if (iframe === null) {
			iframe = document.createElement('iframe');
			iframe.id = "hiddenDownloader";
			iframe.style.display = "none";
			document.body.appendChild(iframe);
		}
		iframe.src = url;
	};

	// Lien sur le canvas
	Viewer.prototype.addLink = function(json) {
		var data = JSON.stringify(json, undefined, '\t');
		var blob = new Blob([data], {type: 'application/json'});
		var blobUrl  = URL.createObjectURL(blob);
		$a = document.createElement('a');
		$a.download = 'map.json';
		$a.href = blobUrl;
		$('#map').wrap($a);
	};
}
