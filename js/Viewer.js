function Viewer(square)
{
	this.square = square;

	Viewer.prototype.render = function(json) {
		var json = $.parseJSON(json),
			map = json.map,
			size = json.size,
			square = this.square || 1; // Taille d'une case

		// Création du canvas en fonction de la taille totale et de la taille de chaque case
		$('#canvas').html('<canvas width="' + (size*square) +
								'" height="' + (size*square) +
								'" id="map"></canvas>');
		this.canvas = $('#map');
		this.context = this.canvas.get(0).getContext('2d');

		this.drawCanvas(json);

		this.addLink(json);
	};

	Viewer.prototype.drawCanvas = function(json, rover) {
		for (var x=0; x<json.size; x++) {
			for (var y=0; y<json.size; y++) {

				// Teinte en fonction du type
				var h = json.map[x][y].type*3,
				// Saturation en fonction du type
				s = (json.map[x][y].type*5)+40,
				// Luminosité en fonction de la hauteur
				l = json.map[x][y].z*50;

				this.context.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';
				if (rover) {
					if (rover.x == x && rover.y == y) {
						this.context.fillStyle = 'rgba(0,0,150,1)';
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
