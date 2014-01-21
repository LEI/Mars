function Rover(viewer) {
	this.viewer = viewer;

	// Initialisation du rover, x et y optionnels
	Rover.prototype.init = function (json, x, y) {
		this.json = $.parseJSON(json);
		this.size = this.json.size;
		this.map = this.json.map;

		this.E = 100;

		this.position(x, y);
	};

	Rover.prototype.position = function (x, y) {
		// Si x et y ne sont pas renseignés, initialisation à 1,1
		if (x == undefined || y == undefined) {
			x = y = 1;
		}
		this.x = x;
		this.y = y;

		this.refresh();
	}

	// Déplacement du rover jusqu'à un point précis -> client
	Rover.prototype.goTo = function (x, y) {
		var that = this;
		this.tick = setInterval(function(){
			that.move(x,y);
		}, 100);
	};

	// Gestion du trajet
	Rover.prototype.move = function (x, y) {
		var a, b;

		// Calcul des coordonnées du vecteur
		X = x - this.x;
		Y = y - this.y;

		if (X > 0) {
			a = 1;
		} else if (X < 0) {
			a = -1;
		} else {
			a = 0;
		}

		if (Y > 0) {
			b = 1;
		} else if (Y < 0) {
			b = -1;
		} else {
			b = 0;
		}

		var nextX = this.x + a,
			nextY = this.y + b,
			slope = this.testSlope(nextX, nextY);

		if (slope.result != 'success') {

			clearInterval(this.tick);

		} else {

			if (x == this.x && y == this.y) {
				clearInterval(this.tick);
			} else {
				this.doStep(a, b);
			}

		}
		console.log(a+','+b);
		console.log(slope);
	};

	// Déplacement du rover
	// Indiquer une direction en paramètre : (1,0) pour aller à droite
	Rover.prototype.doStep = function (a, b) {

		// Calcul des coordonnées du point à tester
		x = a + this.x;
		y = b + this.y;

		var slope = this.testSlope(x, y);

		// Se déplacer d'une case coute E, à savoir 1 point énergie
		this.E -= 10;

		// Les diagonales coutent 1,4
		if (Math.abs(a) && Math.abs(b)) {
			this.E -= 4;
		}

		// En montée, ou en descente, le cout énergétique est E x (1 + p)
		this.E -= 1 + slope.p;

		// Si c'est une pente sableuse
		if (this.getSquare(x, y).type == 2) {
			if (slope.p > 0) {
				// Monter une pente sableuse demande 0,1 E en plus
				this.E -= 1;
			} else if (slope.p < 0) {
				// Descendre une pente sableuse demande 0,1 E en moins
				this.E += 1;
			}
		}

		// Déplacement
		this.position(x, y);
	};

	// Retourne le résultat du test d'une pente
	Rover.prototype.testSlope = function (x, y) {
		var result, maxSlope = 1.5,
			p = this.getSlope(x, y);

		// Tests de la pente
		if (p > -maxSlope && p < maxSlope) {
			result = 'success';
		} else if (p <= -maxSlope) {
			result = 'fail';
		} else if (p >= maxSlope) {
			result = 'impossible';
		} else {
			result = false;
		}

		return { 'result': result, 'p': p }
	};

	// Retourne la valeur de la pente
	Rover.prototype.getSlope = function (x, y) {
		var current = this.getSquare(),
			next = this.getSquare(x, y);
		// Si le point suivant existe sur la carte
		if (next.z) {
			p = (next.z - current.z) / 5; // 5 mètres;
		} else {
			p = false;
		}

		return p;
	};

	// Détermine la valeur de la pente, coordonnées relatives à la position du Rover
	Rover.prototype.checkSlope = function (a, b) {

		if (Math.abs(a) == 2 || Math.abs(b) == 2) {
			// Case au delà 0,1E
			this.E -= 1;
		}

		return this.testSlope(this.x + a, this.y + b);
	};

	// Détermine la composition du sol, coordonnées relatives à la position du Rover
	Rover.prototype.checkType = function (a, b) {

		// Coup en énergie
		var distX = Math.abs(a),
			distY = Math.abs(b);

		if (distX == 0 && distY == 0) {
			// Case du rover 0,1E
			this.E -= 1;
		} else if (distX <= 1 && distY <= 1) {
			// Case adjacente 0,2E
			this.E -= 2;
		} else if (distX > 1 || distY > 1) {
			// Case au delà 0,4E
			this.E -= 4;
		}

		var type = map[this.x + a][this.y + b].type;

		return type;
	};

	Rover.prototype.getSquare = function (x, y) {
		// Retourne la position actuelle si les paramètres ne sont pas renseignés
		if (x == undefined || y == undefined) {
			x = this.x;
			y = this.y;
		}
		return this.isOnMap(x, y);
	};

	// Récupération des cases autour du rover
	Rover.prototype.getNearSquares = function (distance) {
		this.nearSquares = [];
		for (var i = this.x - distance; i <= this.x + distance; i++) {
			for (var j = this.y - distance; j <= this.y + distance; j++) {
				var square = this.getSquare(i, j);
				if (square) {
					this.nearSquares.push({'x': i, 'y': j, 'p': this.testSlope(i, j).result, 'z': square.z });
				}
			}
		}
	};

	Rover.prototype.isOnMap = function (x, y) {
		if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
			return this.map[x][y];
		}
		return false;
	};

	Rover.prototype.log = function () {
		var currentSquare = this.getSquare(),
			log = "x:" + this.x + " ,y: " + this.y + "<br/>"
				+ "z: " + currentSquare.z + "<br/>"
				+ "type: " + currentSquare.type + "<br/>"
				+ "E: " + this.E / 10;
		/*console.log(this.viewer.context.getImageData(
		 this.x*this.viewer.square,
		 this.y*this.viewer.square,
		 this.viewer.square,
		 this.viewer.square
		 ));*/
		$('#log').html(log);
	}

	Rover.prototype.refresh = function () {
		this.log();
		this.getNearSquares(1);
		this.viewer.drawCanvas(this.json, this, this.nearSquares);
	};
}
