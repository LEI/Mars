function Rover(x, y)
{
	this.x = x;
	this.y = y;
	this.E = 10;

	Rover.prototype.init = function() {
	};

	Rover.prototype.move = function(x, y) {
		this.x += x;
		this.y += y;
	};

	Rover.prototype.show = function() {

	};
}
