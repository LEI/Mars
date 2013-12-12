function Rover()
{
	Rover.prototype.init = function(json, x, y, viewer) {
		this.x = x;
		this.y = y;
		this.E = 10;

		this.json = $.parseJSON(json);
		this.size = this.json.size;
		this.map = this.json.map;

		this.viewer = viewer;
		this.refreshPosition();
	};

	Rover.prototype.move = function(x, y) {
		this.x += x;
		this.y += y;
		this.refreshPosition();
	};

	Rover.prototype.refreshPosition = function() {
		this.viewer.drawCanvas(this.json, this);
	};
}
