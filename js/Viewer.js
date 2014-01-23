function Viewer()
{
	// Peut être appellé avec un JSON externe, square facultatif (1 par défaut)
	Viewer.prototype.render = function(json, square) {
		var json = $.parseJSON(json),
			map = json.map,
			size = json.size,
			square = square || 1; // Taille d'une case

		this.square = square;

		// Création du canvas en fonction de la taille totale et de la taille de chaque case
		$('#canvas').html('<canvas width="' + (size*square) + '" height="' + (size*square) + '" id="map"></canvas>');
		this.canvas = $('#map');
		this.context = this.canvas.get(0).getContext('2d');

		this.path = [];

		this.drawCanvas(json);

		this.addLink(json);
	};

	// getImageData() putImageData()
	Viewer.prototype.drawCanvas = function(json, rover, slope) {
		for (var x=0; x<json.size; x++) {
			for (var y=0; y<json.size; y++) {

				// Teinte en fonction du type
				var h = 10;//json.map[x][y].type*3,
				// Saturation en fonction du type
				s = 60;//(json.map[x][y].type*5)+40,
				// Luminosité en fonction de la hauteur
				l = (json.map[x][y].z+20)*1.5;

				// Parcours du Rover
				for (i in this.path) {
					if (this.path[i].x == x && this.path[i].y == y) {
						if (rover.x != x || rover.y != y) {
							l *= 0.7;
						}
					}
				}

				this.context.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';

				// Affichage des pentes autour du Rover
				if (slope) {
					for (var i in slope) {
						if (slope[i].x == x && slope[i].y == y) {
							if (slope[i].p == 'success') {
								//this.context.fillStyle = 'rgba(0,255,0,1)';
							} else if (slope[i].p == 'fail') {
								this.context.fillStyle = 'rgba(0,0,0,1)';
							} else if (slope[i].p == 'impossible') {
								this.context.fillStyle = 'rgba(255,255,255,1)';
							}
						}
					}
				}

				// Affichage du Rover
				if (rover) {
					if (rover.x == x && rover.y == y) {
						this.context.fillStyle = 'rgba(255,0,0,1)';
						this.path.push({'x': x, 'y': y});
					}
				}

				this.context.fillRect(
					x * this.square,
					y * this.square,
					this.square,
					this.square
				);
			}
		}
	}

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
