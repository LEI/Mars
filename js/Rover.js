function Rover(viewer)
{
	this.viewer = viewer;

	// Initialisation du rover, x et y optionnels
	Rover.prototype.init = function(json, x, y) {
		this.E = 10;

		this.json = $.parseJSON(json);
		this.size = this.json.size;
		this.map = this.json.map;

		this.initPos(x,y);
	};

	Rover.prototype.initPos = function(x,y) {
		// Si x et y ne sont pas renseignés, initialisation à 1,1
		if (x == undefined || y == undefined) {
			x = y = 1;
		}
		this.x = x;
		this.y = y;
		this.refreshPos();
	}

	// Déplacement du rover
	// Indiquer une direction en paramètre : (1,0) pour aller à droite
	Rover.prototype.doStep = function(x,y) {

		// Calcul des coordonnées du point à tester
		x += this.x;
		y += this.y;

		switch (this.checkSlope(x,y)) {
			case 'success':
				this.initPos(x,y);
			break;
			case 'fail':
				this.initPos();
				console.log('Game over');
			break;
			case 'impossible':
				console.log('Too high');
			break;
			default:
				console.log(this.checkSlope(x,y));
			break;
		}
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
		if (x >= 0 && x <= this.size && y >= 0 && y <= this.size) {
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

	Rover.prototype.refreshPos = function() {
		this.getNearSquares(1);
		this.viewer.drawCanvas(this.json, this, this.nearSquares);
	};

	Rover.prototype.goTo = function(x,y) {

		x -= this.x;
		y -= this.y;
		this.doStep(x,y);

		// Déplacement du rover

		// brute force
		while (x!=0) {
			x > 0 ? x-- : x++;
			this.doStep(x,0);
		}
		while (y!=0) {
			y > 0 ? y-- : y++;
			this.doStep(0,y);
		}

	};
}
