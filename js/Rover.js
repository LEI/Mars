function Rover(viewer) {
	this.viewer = viewer;

	// Initialisation du rover, x et y optionnels
	Rover.prototype.init = function (json, x, y) {
		this.initMap(json);
		this.maxEnergy = $('#rover_energy').val() * 10;
		this.energy = this.maxEnergy;

		this.visited = [];
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

		this.visited.push(this.getSquare());

		this.refresh();
	}

	// Déplacement du rover jusqu'à (x, y)
	Rover.prototype.goTo = function (x, y) {

		console.log('START from '+this.x+','+this.y+' to '+x+','+y);

		var that = this;
		this.i = 1;
		this.energy = this.maxEnergy;
		clearInterval(this.tick);
		this.tick = setInterval(function(){
			that.move(x,y);
			that.log(that.i++);
		}, 100);
	};

	// Gestion du trajet jusqu'à
	Rover.prototype.move = function (x, y) {
		var X = x - this.x,
			Y = y - this.y,
			a = this.getVector(X),
			b = this.getVector(Y),
			direction = this.getDirection(a,b,X,Y);

		a = direction[0];
		b = direction[1];

		if (x == this.x && y == this.y) {
			// Le Rover est arrivé à destination
			clearInterval(this.tick);
			console.log('GG');
		} else {
			this.doStep(a, b);
		}

	};

	// Retourne les coordonnées relatives au Rover d'une case pratiquable
	Rover.prototype.getDirection = function (a, b, X, Y) {
		var maxSlope, maxBenefit, benefit, items = [],
			near, nearSquares = this.getNearSquares(1).near;

		for (i = 0, len = nearSquares.length; i < len; i++) {
			near = nearSquares[i];
			benefit = 0;
			if (near.result == 'success') {

				if ((near.x-this.x) * X > 0) {
					benefit += 8;
				}
				if ((near.y-this.y) * Y > 0) {
					benefit += 8;
				}
				if ((near.x-this.x) * X < 0) {
					benefit -= 8;
				}
				if ((near.y-this.y) * Y < 0) {
					benefit -= 8;
				}

				for (var v = 0; v < this.visited.length; v++) {
					if (this.visited[v].x == near.x && this.visited[v].y == near.y) {
						benefit -= 24;
					}
				}

				benefit -= near.p;

				// Glace ?
				var type = this.getSquare(near.x, near.y).type;

				if (type == 5) {
					benefit += 4;
				} else if (type == 2 && p < 0) {
					benefit += 2;
				} else if (type == 2 && p > 0) {
					benefit -= 2;
				}

				if (!maxBenefit || benefit > maxBenefit.b) {
					maxBenefit = {
						'x': near.x-this.x,
						'y': near.y-this.y,
						'b': benefit
					};
				}
				items.push({
					'x': near.x-this.x,
					'y': near.y-this.y,
					'b': benefit
				});
			}
		}

		return [maxBenefit.x, maxBenefit.y];
	};

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

		this.E = 0;

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

			if (this.energy + this.E > 0) {

				this.energy += this.E;

			} else {
				// Le rover recharge 10% en 5 tours
				this.i += 5;
				this.energy += this.maxEnergy / 10;
			}

			console.log(this.x+','+this.y+' -> '+x+','+y+' ('+slope.result+' '+slope.p+') '+a+','+b);
			// Déplacement
			this.position(x, y);

		} else {
			console.log('Mouvement demandé ' + slope.result);
			console.log(this.x+','+this.y+' -> '+a+','+b);
			clearInterval(this.tick);
		}
	};

	// Retourne le résultat du test d'une pente
	Rover.prototype.testSlope = function (x, y, x2, y2) {

		var result, maxSlope = 0.5,
			p = this.getSlope(x, y, x2, y2);

		// Tests de la pente
		if (p === false) {
			result = false;
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

		// attention : tester la pente par rapport à une case adjacente
		if (Math.abs(a) > 1 || Math.abs(b) > 1) {
			// Case au delà de 1 coûte 0,1E
			this.E -= 1;
		}
		var slope = this.testSlope(this.x + a, this.y + b);

		return slope.result;
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
					if (!(i - this.x == 0 && j - this.y == 0)) {
						nearSquares.near.push({
							'x': i, 'y': j,
							'z': square.z,
							'p': this.testSlope(i, j).p,
							'result': this.testSlope(i, j).result
						});
					}
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

		var square = this.isOnMap(x, y);
		if (typeof square == 'object') {
			square['x'] = x;
			square['y'] = y;

			return square;
		}

		return false;
	};

	Rover.prototype.isOnMap = function (x, y) {
		if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
			return this.map[x][y];
		}
		return false;
	};

	Rover.prototype.log = function (round) {
		if (round == undefined) {
			round = '';
		}

		var g = new Ground();
		var energy = this.energy / 10,
			currentSquare = this.getSquare(),
			log = '<h3>' + this.x + ',' + this.y + '</h3> ' +
				'<i class="icon-signal"></i> ' + currentSquare.z + '<br/>' +
				'<i class="icon-map-marker"></i> ' + g.groundType[currentSquare.type] + '<br/>' +
				'<i class="icon-flag"></i> ' + round + ' tours';
		$('#log').html(log);
		$('#energy').html(energy.toFixed(1));
	}

	Rover.prototype.refresh = function () {
		this.log();
		this.getNearSquares(1);
		//this.viewer.drawCanvas(viewer.json, this);
		this.viewer.drawRover(this);
	};
}
