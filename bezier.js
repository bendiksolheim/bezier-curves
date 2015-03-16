(function(global) {
	CanvasRenderingContext2D.prototype.bezier = bezier; 

	function distance(a, b) {
		return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
	}

	function computeSupportPoints(points) {

		function fact(k) {
			if (k == 0 || k == 1)
				return 1;

			return k * fact(k - 1);
		}

		function B(i, n, t) {
			return fact(n) / (fact(i) * fact(n - i)) * Math.pow(t, i) * Math.pow(1 - t, n - i);
		}

		function ComputeP(t, points) {
			var r = P(0, 0);
			var n = points.length - 1;
			for (var i = 0; i <= n; i++) {
				r.x += points[i].x * B(i, n, t);
				r.y += points[i].y * B(i, n, t);
			}
			
			return r;
		}

		var tLength = 0;
		for (var i = 0; i < points.length - 1; i++) {
			tLength += distance(points[i], points[i+1]);
		}
		var step = 5 / tLength;

		var temp = [];
		for (var t = 0; t <= 1; t = t + step) {
			temp.push(ComputeP(t, points));
		}

		return temp;
	}

	function paintCurve(ctx, points) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		points.slice(1).forEach(function(point) {
			ctx.lineTo(point.x, point.y);
		});
		// for (var i = 1; i < points.length; i++) {
		// 	ctx.lineTo(points[i].x, points[i].y);
		// }

		ctx.stroke();
		ctx.restore();
	}

	function bezier() {
		var points = [];
		if (arguments.length === 1) {
			points = arguments[0];
		} else {
			for (i = 0; i < arguments.length; i++)
				points.push(arguments[i]);
		}

		var supportPoints = computeSupportPoints(points);
		paintCurve(this, supportPoints);
	}

	function Bezier(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.showPoints = true;
		this.showLines = true;
		this.showOnlyOddLines = true;
	}

	Bezier.prototype.draw = function(points) {
		console.log("Starting visualization for points [" + points.toString() + "]");
		
		this.points = points;
		this.mousedown = mousedown(this.canvas, points);
		this.keydown = keydown(this);

		window.addEventListener('mousedown', this.mousedown, false);
		window.addEventListener('keydown', this.keydown, false);
		var bez = this;

		function _draw() {
			bez.timeout = setTimeout(function() {
				bez.drawScene.apply(bez);
				requestAnimationFrame(_draw);
			}, 1000 / 60);
		}

		_draw();
	};

	Bezier.prototype.invalidate = function() {
		console.log("Stopping vizualization for points [" + this.points.toString() + "]");
		clearTimeout(this.timeout);
		window.removeEventListener('mousedown', this.mousedown);
		window.removeEventListener('keydown', this.keydown);
	};

	Bezier.prototype.drawScene = function() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.lineWidth = 3;
			this.ctx.strokeStyle = '#297f79';
			if (this.showLines)
				this.drawLines();

			this.ctx.bezier(this.points);

			if (this.showLines)
				this.drawPoints();
	};

	Bezier.prototype.drawPoints = function() {
		var ctx = this.ctx;
		ctx.save();
		ctx.fillStyle = "#fd5158";
		ctx.beginPath();

		this.points.forEach(function(point) {
			ctx.moveTo(point.x, point.y);
			ctx.arc(point.x, point.y, 5, 0, 2*Math.PI, false);
		});

		ctx.fill();
		ctx.restore();
	};

	Bezier.prototype.drawLines = function() {
		var ctx = this.ctx;
		ctx.save();

		ctx.strokeStyle = "#777";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for (var i = 1; i < this.points.length; i++) {
			if (i % 2 === 0 && this.showOnlyOddLines)
				ctx.moveTo(this.points[i].x, this.points[i].y);
			else
				ctx.lineTo(this.points[i].x, this.points[i].y);
		}
		ctx.stroke();
		ctx.restore();
	};

	function keydown(bez) {
		return function(ev) {
			console.log(ev.keyCode);
			if (ev.keyCode == 83)
				bez.invalidate();
			
			if (ev.keyCode == 186)
				bez.showLines = !bez.showLines;

			if (ev.keyCode == 222)
				bez.showOnlyOddLines = !bez.showOnlyOddLines;
		}
	};

	function mousedown(canvas, points) {
		return function(ev) {
			var node = document.querySelector(".remark-visible .remark-slide-scaler");
			var curTransform = new WebKitCSSMatrix(window.getComputedStyle(node).webkitTransform);
			var boundingRect = canvas.getBoundingClientRect();
			var x = (ev.clientX - boundingRect.left) / curTransform.m11;
			var y = (ev.clientY - boundingRect.top) / curTransform.m11;
			var p;
			for (var i = 0; i < points.length; i++) {
				if (points[i].hit(x, y)) {
					p = points[i];
					break;
				}
			}

			console.log(p);

			if (typeof p === 'undefined')
				return;

			function mousemove(mm) {
				var node = document.querySelector(".remark-visible .remark-slide-scaler");
				var curTransform = new WebKitCSSMatrix(window.getComputedStyle(node).webkitTransform);
				var boundingRect = canvas.getBoundingClientRect();
				var x = (mm.clientX - boundingRect.left) / curTransform.m11;
				var y = (mm.clientY - boundingRect.top) / curTransform.m11;

				p.x = x;
				p.y = y;
			}

			function mouseup(mousemove, mouseup) {
				return function(mu) {
					console.log("mouseup");
					canvas.removeEventListener('mousemove', mousemove);
					setTimeout(0, function() {
						canvas.removeEventListener('mouseup', mouseup);
					});
				}
			}

			canvas.addEventListener('mousemove', mousemove, false);
			canvas.addEventListener('mouseup', mouseup(mousemove, mouseup), false);
		};
	}

	global.Bezier = Bezier;

	global.P = function(x, y, radius) {
		if (typeof radius === 'undefined')
			radius = 5;

		return new Point(x, y, radius);
	};

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
		return "{" + this.x + ", " + this.y + "}";
	};
})(window);