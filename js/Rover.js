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

    // Déplacement du rover
    // Indiquer une direction en paramètre : (1,0) pour aller à droite
    Rover.prototype.doStep = function (x, y) {

        // Calcul des coordonnées du point à tester
        x += this.x;
        y += this.y;

        // Test de la pente
        var slope = this.testSlope(x, y);

        switch (slope.result) {
            case 'success':

            	// Se déplacer d'une case coute E, à savoir 1 point énergie
            	this.E -= 10;

            	// Les diagonales coutent 1,4
            	if (Math.abs(x - this.x) && Math.abs(y - this.y)) {
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
                break;
            case 'fail':
            	// !Reset
                this.position();
                console.log('Game over');
                break;
            case 'impossible':
                console.log('Too high');
                break;
            default:
                console.log('false :');
                console.log(this.testSlope(x, y));
                break;
        }
        // On remonte le résultat pour le Rover
        return slope;
    };

    // Déplacement du rover jusqu'à un point précis
    Rover.prototype.goTo = function (x, y) {
        var a, b, step;
        while (x != this.x || y != this.y) {

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

            var step = this.doStep(a, b);
            //console.log("dostep("+a+","+b+");");

            if (step.result != 'success') {
                break;
            }
        }
    };

    // Retourne le résultat du test d'une pente
    Rover.prototype.testSlope = function (x, y) {
    	var result, maxSlope = 1.5,
    	    current = this.getSquare(),
    	    next = this.getSquare(x, y),
    	    p = this.getSlope(current.z, next.z);

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
	Rover.prototype.getSlope = function (currentZ, nextZ) {
		// Si le point suivant existe sur la carte
		if (nextZ) {
		    p = (nextZ - currentZ) / 5; // 5 mètres;
		} else {
		    p = false;
		}

		return p;
	};

	// Détermine la valeur de la pente, coordonnées relatives à la position du Rover
	Rover.prototype.checkSlope = function (x, y) {

		if (Math.abs(x) == 2 || Math.abs(y) == 2) {
			// Case au delà 0,1E
			this.E -= 1;
		}

		return this.testSlope(this.x + x, this.y + y);
	};

	// Détermine la composition du sol, coordonnées relatives à la position du Rover
	Rover.prototype.checkType = function (x, y) {

		if (Math.abs(x) == 0 || Math.abs(y) == 0) {
			// Case du rover 0,1E
			this.E -= 1;
		}
		if (Math.abs(x) == 1 || Math.abs(y) == 1) {
			// Case adjacente 0,2E
			this.E -= 2;
		} else if (Math.abs(x) == 2 || Math.abs(y) == 2) {
			// Case au delà 0,4E
			this.E -= 4;
		}

		return map[this.x + x][this.y + y].type;
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
