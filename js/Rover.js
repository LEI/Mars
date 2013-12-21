	function Rover(viewer)
{
	this.viewer = viewer;

	// Initialisation du rover, x et y optionnels
	Rover.prototype.init = function(json, x, y) {
		this.json = $.parseJSON(json);
		this.size = this.json.size;
		this.map = this.json.map;

		this.E = 10;

		this.position(x,y);
	};

	Rover.prototype.position = function(x,y) {
		// Si x et y ne sont pas renseignés, initialisation à 1,1
		if (x == undefined || y == undefined) {
			x = y = 1;
		}
		this.x = x;
		this.y = y;
		this.refresh();
	}

	// Déplacement du rover
	// Indiquer une direction en paramètre : (1,0) pour aller à droite
	Rover.prototype.doStep = function(x,y) {

		// Calcul des coordonnées du point à tester
		x += this.x;
		y += this.y;

		// Test de la pente
		var slope = this.checkSlope(x,y);

		switch (slope) {
			case 'success':
				//this.E -= 1;
				this.position(x,y);
			break;
			case 'fail':
				this.position();
				console.log('Game over');
			break;
			case 'impossible':
				console.log('Too high');
			break;
			default:
				console.log(this.checkSlope(x,y));
			break;
		}
		// On remonte le résultat pour le Rover
		return slope;
	};

	Rover.prototype.checkSlope = function(x,y) {
		var p, maxSlope = 1.5,
			currentZ = this.getSquare().z,
			nextZ = this.getSquare(x,y).z;

		// Si le point suivant existe sur la carte
		if (nextZ) {
			p = this.getSlope(currentZ,nextZ);
		} else {
			return '404';
		}

		// Tests de la pente
		if (p > -maxSlope && p < maxSlope) {
			return 'success';
		} else if (p <= -maxSlope) {
			return 'fail';
		} else if (p >= maxSlope) {
			return 'impossible';
		}
	};

	Rover.prototype.getSlope = function(z1,z2) {
		return (z2 - z1) / 5; // 5 mètres
	};

	Rover.prototype.getSquare = function(x,y) {
		// Retourne la position actuelle si les paramètres ne sont pas renseignés
		if (x == undefined || y == undefined) {
			x = this.x;
			y = this.y;
		}
		return this.isOnMap(x,y);
	};

	Rover.prototype.isOnMap = function(x,y) {
		if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
			return this.map[x][y];
		}
		return false;
	};

	// Récupération des cases autour du rover
	Rover.prototype.getNearSquares = function(distance) {
		var nearSquares = [];
		for (var i=this.x-distance; i<=this.x+distance; i++) {
			for (var j=this.y-distance; j<=this.y+distance; j++) {
				var square = this.getSquare(i,j);
				if (square) { nearSquares.push( {'x': i, 'y': j, 'p': this.checkSlope(i,j), 'z': square.z } ); }
			}
		}

		this.nearSquares = nearSquares;
	};

	// Déplacement du rover jusqu'à un point précis
	Rover.prototype.goTo = function(x,y) {
		var a, b, step;
		while (x != this.x || y != this.y) {

			// Calcul des coordonnées du vecteur
			X = x - this.x;
			Y = y - this.y;

			if (X>0) {
				a = 1;
			} else if (X<0) {
				a = -1;
			} else {
				a = 0;
			}

			if (Y>0) {
				b = 1;
			} else if (Y<0) {
				b = -1;
			} else {
				b = 0;
			}

			var step = this.doStep(a,b);
			//console.log("dostep("+a+","+b+");");

			if (step != 'success') {
				break;
			}
		}
	};

	Rover.prototype.log = function () {
		var currentSquare = this.getSquare(),
			log = "x:" + this.x + " ,y: " + this.y + "<br/>"
			+ "z: " + currentSquare.z + "<br/>"
			+ "type: " + currentSquare.type;
		$('#log').html(log);
	}

	Rover.prototype.refresh = function() {
		this.log();
		this.getNearSquares(1);
		this.viewer.drawCanvas(this.json, this, this.nearSquares);
	};
}
