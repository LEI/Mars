function Viewer(square)
{
	this.square = square;

	// Peut être appellé avec un JSON externe, square facultatif (1 par défaut)
	Viewer.prototype.render = function(json) {
		this.json = $.parseJSON(json);
		var map = this.json.map,
			size = this.getJsonSize(this.json);

		// Création du canvas en fonction de la taille totale et de la taille de chaque case
		$('#canvas').html('<canvas width="' + (size*this.square) + '" height="' + (size*this.square) + '" id="map"></canvas>');
		this.canvas = $('#map');
        this.canvas_val = $('#log');
		this.context = this.canvas.get(0).getContext('2d');

		this.path = [];

		this.drawCanvas(this.json);
		//this.mapValues(map);

		this.addLink(this.json);
	};

    Viewer.prototype.mapValues = function(map) {
        // Tableau de valeurs de la map
        canvas_val_row = $('#log table tr');
        $("#log table").remove();
        this.canvas_val.append('<table>');

        for (var y=0; y<map.length; y++) {

            this.canvas_val.append('<tr></tr>');
            for (var x=0; x<map.length; x++) {
                canvas_val_row.append('<td>'+map[x][y].z+'</td>');
            }

        }

        this.canvas_val.append('</table>');
    }

	// getImageData() putImageData()
	Viewer.prototype.drawCanvas = function(json, rover) {
		var size = this.getJsonSize(json),
			lumplus = parseInt($('#map_lum_plus').val(),10),
			lumcoef = parseInt($('#map_lum_coef').val(),10);

		for (var x=0; x<size; x++) {
			for (var y=0; y<size; y++) {

				// Teinte en fonction du type
				var h = 10;//json.map[x][y].type*3,
				// Saturation en fonction du type
				s = 60;//(json.map[x][y].type*5)+40,
				// Luminosité en fonction de la hauteur
				l = json.map[x][y].z;

				l = (l + lumplus) * lumcoef;

				// Parcours du Rover
				for (i in this.path) {
					if (this.path[i].x == x && this.path[i].y == y) {
						if (rover.x != x || rover.y != y) {
							l *= 0.7;
						}
					}
				}

				this.context.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';

				if (rover) {
					// Test du terrain
					if (this.testSlopes == true) {
						for (var i = x - 1; i <= x + 1; i++) {
							for (var j = y - 1; j <= y + 1; j++) {
								result = rover.testSlope(i, j, x, y).result;
								if (result == 'fail' || result == 'impossible') {
									this.context.fillStyle = 'rgba(255,0,0,1)';
								}
							}
						}
					}
					// Affichage des pentes autour du Rover
					for (var i in rover.nearSquares.near) {
						slopeTest = rover.nearSquares.near[i];
						if (slopeTest.x == x && slopeTest.y == y) {
							if (slopeTest.result == 'success') {
								//this.context.fillStyle = 'rgba(0,255,0,1)';
							} else if (slopeTest.result == 'fail') {
								this.context.fillStyle = 'rgba(0,0,0,1)';
							} else if (slopeTest.result == 'impossible') {
								this.context.fillStyle = 'rgba(255,255,255,1)';
							}
						}
					}

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
