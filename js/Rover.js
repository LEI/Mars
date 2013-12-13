function Rover(viewer)
{
	this.viewer = viewer;

	Rover.prototype.init = function(json, x, y) {
		this.E = 10;

		this.json = $.parseJSON(json);
		this.size = this.json.size;
		this.map = this.json.map;

		// Si x et y ne sont pas renseignés, initialisation à 1;1
		if (x == undefined || y == undefined) {
			x = y = 1;
		}
		this.initPos(x,y);
	};

	Rover.prototype.initPos = function(x,y) {
		this.x = x;
		this.y = y;
		this.refreshPos();
	}

	Rover.prototype.move = function(x,y) {

		// Tableau des cases autour de la position du rover
		//console.log(this.getNearSquares(1));

		if (this.checkSlope(x,y)) {
			this.x += x;
			this.y += y;
			this.refreshPos();
		} else {
			console.log('Z');
		}
	};

	Rover.prototype.checkSlope = function(x,y) {
		var p, maxSlope = 1.5,
			currentZ = this.getSquare().z,
			nextZ = this.getNextSquare(x,y).z;
		if (nextZ) {
			p = this.getSlope(currentZ,nextZ);
		} else {
			// 404 Map not found
			return false;
		}
		// Test de la pente
		if (p > -maxSlope && p < maxSlope) {
			//this.x += x;
			//this.y += y;
			//this.refreshPos();
			return true;
		} else if (p < -maxSlope) {
			//console.log("GAME OVER (pente : " + p + ")");
			//this.initPos(1,1);
			return false;
		} else if (p > maxSlope) {
			//console.log("Infranchissable (pente : " + p + ")");
			return false;
		}
	};

	// Retourne la pente pour une distance de 1 ?
	Rover.prototype.getSlope = function(z1,z2) {
		return (z2 - z1) / 5; // 5 mètres
	};

	Rover.prototype.goTo = function(x,y) {

		// Déplacement du rover

		x -= this.x;
		y -= this.y;
		this.move(x,y);

		/*while (x!=0) {
			x > 0 ? x-- : x++;
			this.move(x,0);
		}
		while (y!=0) {
			y > 0 ? y-- : y++;
			this.move(0,y);
		}*/

	};

	Rover.prototype.getSquare = function(x,y) {
		if (x == undefined || y == undefined) {
			x = this.x;
			y = this.y;
		}
		return this.isOnMap(x,y);
	};

	Rover.prototype.getNextSquare = function(x,y) {
		if (x != undefined && y != undefined) {
			x = this.x + x;
			y = this.y + y;
		} else {
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

	Rover.prototype.getNearSquares = function(distance) {
		var nearSquares = [];
		for (var i=this.x-distance; i<=this.x+distance; i++) {
			for (var j=this.y-distance; j<=this.y+distance; j++) {
				if (this.checkSlope(this.x-i, this.y-j)) {
					var square = this.getSquare(i,j);
					if (square) { nearSquares.push( {'x': i, 'y': j, 'ground': square } ); }
				}
			}
		}

		return nearSquares;
	};

	Rover.prototype.refreshPos = function() {
		this.viewer.drawCanvas(this.json, this, this.getNearSquares(1));
	};
}
