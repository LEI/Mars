function Rover(viewer) {
	this.viewer = viewer;

	// Initialisation du rover, x et y optionnels
	Rover.prototype.init = function (json, x, y) {
		this.initMap(json);
		this.E = 100;

		this.position(x, y);
	};

	Rover.prototype.initMap = function (json) {
		this.json = $.parseJSON(json);
		this.size = this.viewer.getJsonSize(this.json);
		this.map = this.json.map;
	};

	Rover.prototype.position = function (x, y) {
		// Si x et y ne sont pas renseignés, initialisation à 1,1
		if (x == null || y == null) {
			x = y = 1;
		}
		this.x = x;
		this.y = y;

		this.refresh();
	}

	// Déplacement du rover jusqu'à (x, y)
	Rover.prototype.goTo = function (x, y) {

		console.log('START from '+this.x+','+this.y+' to '+x+','+y);

		//this.memory = [];
		//this.memory.push(this.getNearSquares(1));
		//console.log(this.memory);
		var i = 1, that = this;
		this.tick = setInterval(function(){
			that.move(x,y);
			that.log(i++);
		}, 100);
	};

	// Gestion du trajet jusqu'à
	Rover.prototype.move = function (x, y) {
		var X = x - this.x,
			Y = y - this.y,
			a = this.getVector(X),
			b = this.getVector(Y),
			nextX = this.x + a,
			nextY = this.y + b,
			slope = this.testSlope(nextX, nextY);

		if (slope.result == 'success') {
			if (x == this.x && y == this.y) {
				// Le Rover est arrivé à destination
				clearInterval(this.tick);
				console.log('GG');
			} else {
				// Le Rover avance
				this.doStep(a, b);
			}
		} else {
			// Le Rover ne peut pas avancer
			var direction = this.takeDecision(a,b);

			if (direction != false) {
				a = direction[0];
				b = direction[1];
				this.doStep(a, b);
			} else {
				// Non géré
				console.log('TRY AGAIN '+this.x+','+this.y+' -> '+(this.x+a)+','+(this.x+b));
				clearInterval(this.tick);
			}
		}

	//	console.log(slope.result+': '+a+','+b+' ('+slope.p+')');

	};

	// Retourne les coordonnées relatives au Rover d'une case pratiquable à droite ou à gauche
	Rover.prototype.takeDecision = function (a, b) {
		if (a != 0 && b != 0) {
			switch('success') {
				case this.checkSlope(a,0).result: b = 0; break;
				case this.checkSlope(0,b).result: a = 0; break;
				default: return false;
			}
		} else {
			if (a == 0) {
				switch('success') {
					case this.checkSlope(1,b).result: a = 1; break;
					case this.checkSlope(-1,b).result: a = -1; break;
					default: return false;
				}
			} else if (b == 0) {
				switch('success') {
					case this.checkSlope(a,1).result: b = 1; break;
					case this.checkSlope(a,-1).result: b = -1; break;
					default: return false;
				}
			}
		}

		return [a,b];
	}

	Rover.prototype.getVector = function (n) {
		var v;
		if (n > 0) {
			v = 1;
		} else if (n < 0) {
			v = -1;
		} else {
			v = 0;
		}

		return v;
	};

	// Déplacement du rover, coordonnées relatives à la position du Rover
	Rover.prototype.doStep = function (a, b) {

		// Calcul des coordonnées du point à tester
		x = a + this.x;
		y = b + this.y;

		var slope = this.testSlope(x, y),
			p = slope.p;

		if (slope.result == 'success') {

			// Se déplacer d'une case coute E, à savoir 1 point énergie
			this.E -= 10;

			// Les diagonales coutent 1,4
			if (Math.abs(a) == 1 && Math.abs(b) == 1) {
				this.E -= 4;
			}

			// En montée, ou en descente, le cout énergétique est E x (1 + p)
			this.E -= 1 + p;

			// Si c'est une pente sableuse
			if (this.getSquare(x, y).type == 2) {
				if (p > 0) {
					// Monter une pente sableuse demande 0,1 E en plus
					this.E -= 1;
				} else if (p < 0) {
					// Descendre une pente sableuse demande 0,1 E en moins
					this.E += 1;
				}
			}

			console.log(this.x+','+this.y+' -> '+x+','+y+' ('+slope.p+' '+slope.result+') '+a+','+b);

			// Déplacement
			this.position(x, y);

		} else {
			console.log('Mouvement demandé ' + slope.result);
			clearInterval(this.tick);
		}
	};

	// Retourne le résultat du test d'une pente
	Rover.prototype.testSlope = function (x, y, x2, y2) {

		var result, maxSlope = 1.5,
			p = this.getSlope(x, y, x2, y2);

		// Tests de la pente
		if (p === false) {
			result = 'out of bounds';
		} else if (p > -maxSlope && p < maxSlope) {
			result = 'success';
		} else if (p <= -maxSlope) {
			result = 'fail';
		} else if (p >= maxSlope) {
			result = 'impossible';
		}

		return {
			'result': result,
			'p': p
		}
	};

	// Retourne la valeur de la pente
	Rover.prototype.getSlope = function (x, y, x2, y2) {
		var current = this.getSquare(x2, y2),
			next = this.getSquare(x, y);
		// Si le point suivant existe sur la carte
		if (next === false) {
			p = false;
		} else {
			p = (next.z - current.z) / 5; // 5 mètres
		}

		return p;
	};

	// Détermine la valeur de la pente, coordonnées relatives à la position du Rover
	Rover.prototype.checkSlope = function (a, b) {

		// attention : tester la penter par rapport à une case adjacente
		if (Math.abs(a) > 1 || Math.abs(b) > 1) {
			// Case au delà de 1 coûte 0,1E
			this.E -= 1;
		}
		var slope = this.testSlope(this.x + a, this.y + b);

		return slope;
	};

	// Détermine la composition du sol, coordonnées relatives à la position du Rover
	Rover.prototype.checkType = function (a, b) {

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

		var type = this.getSquare(this.x + a, this.y + b).type;

		return type;
	};

	// Récupération des cases autour du rover
	Rover.prototype.getNearSquares = function (distance) {
		var nearSquares =  {
			'x': this.x,
			'y': this.y,
			'near': []
		}, z =0;
		for (var i = this.x - distance; i <= this.x + distance; i++) {
			for (var j = this.y - distance; j <= this.y + distance; j++) {
				var square = this.getSquare(i, j);
				// Si la case existe
				if (square) {
					nearSquares.near.push({
						'x': i, 'y': j,
						'z': square.z,
						'p': this.testSlope(i, j).result
					});
				}
			}
		}

		this.nearSquares = nearSquares;

		return nearSquares;
	};

	Rover.prototype.getSquare = function (x, y) {
		// Retourne la position actuelle si les paramètres ne sont pas renseignés
		if (x == null || y == null) {
			x = this.x;
			y = this.y;
		}

		return this.isOnMap(x, y);
	};

	Rover.prototype.isOnMap = function (x, y) {
		if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
			return this.map[x][y];
		}
		return false;
	};

	Rover.prototype.log = function (round) {
		if (round != undefined) {
			round = ' {' + round + '}'
		} else {
			round = '';
		}

		var energy = this.E / 10,
			currentSquare = this.getSquare(),
			log = '(' + this.x + ',' + this.y + ') ' +
				'z: ' + currentSquare.z + ' ' +
				'type: ' + currentSquare.type + ' ' +
				'E: ' + energy.toFixed(1) + round;
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
		this.viewer.drawCanvas(viewer.json, this);
	};
}
