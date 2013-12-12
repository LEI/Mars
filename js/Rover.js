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

	Rover.prototype.move = function(x, y) {
		this.x += x;
		this.y += y;
		this.refreshPos();
	};

	Rover.prototype.refreshPos = function() {
		console.log(this.getCurrentSquare());
		this.viewer.drawCanvas(this.json, this);
	};

	Rover.prototype.getCurrentSquare = function() {
		for (var x=0; x<this.size; x++) {
			for (var y=0; y<this.size; y++) {
				if (this.x == x && this.y == y) {

					return this.map[x][y];

				}
			}
		}
	}

	Rover.prototype.testSquare = function() {
		// pente?
	}
}
