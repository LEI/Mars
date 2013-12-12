function Rover()
{
	Rover.prototype.init = function(json, viewer) {
		this.E = 10;

		this.json = $.parseJSON(json);
		this.size = this.json.size;
		this.map = this.json.map;

		this.initPos(2,2);

		this.viewer = viewer;
		this.refreshPos();
	};

	Rover.prototype.initPos = function(x,y) {
		this.x = x;
		this.y = y;
	}

	Rover.prototype.move = function(x,y) {
		var currentZ = this.getSquare().z,
			nextZ = this.getSquare(x,y).z,
			p = this.checkSlope(currentZ,nextZ);

		if (p > -0.5 && p < 0.5) {
			this.x += x;
			this.y += y;
			this.refreshPos();
		} else {
			console.log(p);
		}
	};

	Rover.prototype.refreshPos = function() {
		this.viewer.drawCanvas(this.json, this);
	};

	Rover.prototype.getSquare = function(x,y) {
		if (x != undefined && y != undefined) {
			x = this.x + x;
			y = this.y + y;
		} else {
			x = this.x;
			y = this.y;
		}
		for (var i=0; i<this.size; i++) {
			for (var j=0; j<this.size; j++) {
				if (x == i && y == j) {

					//if (this.map[x][y] != undefined) {
						return this.map[x][y];
					//}

				}
			}
		}
	}

	// Retourne la pente pour une distance de 1
	Rover.prototype.checkSlope = function(a,b) {
		return b-a;
	}

	Rover.prototype.goTo = function(x,y) {

	}
}
