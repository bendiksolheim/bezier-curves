function P(x, y, radius) {
	if (typeof radius === 'undefined')
		radius = 5;

	return new Point(x, y, radius);
}

function Point(x, y, radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;
}

Point.prototype.hit = function(x, y) {
	var r = this.radius + 2;
	var hit = (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) < (r * r);
	return hit;
};

Point.prototype.toString = function() {
	return "[" + this.x + ", " + this.y + "]";
};

Point.prototype.distance = function(point) {
	return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
};

module.exports = P;