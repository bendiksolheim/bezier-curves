(function(global) {
	// CanvasRenderingContext2D.prototype.bezier = bezier; 

	function factorial(n) {
		if (n == 0 || n == 1)
			return 1;

		return n * factorial(n - 1);
	}

	function B(i, n, t) {
		return factorial(n) / (factorial(i) * factorial(n - i)) * Math.pow(t, i) * Math.pow(1 - t, n - i);
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

	function computeSupportPoints(points) {

		var tLength = 0;
		for (var i = 0; i < points.length - 1; i++) {
			tLength += points[i].distance(points[i+1]);
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

	function Bezier(canvas, showOnlyOddLines) {
		if (typeof showOnlyOddLines === 'undefined')
			showOnlyOddLines = true;

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.showPoints = true;
		this.showLines = true;
		this.showOnlyOddLines = showOnlyOddLines;
		this.showCurve = true;
		this.showImage = false;
		this.showHelpLines = false;
		this.img = new Image();
		this.img.src = 'fish.png';
	}

	Bezier.prototype.draw = function(points) {
		console.log("Starting visualization for points [" + points.toString() + "]");
		
		this.points = points;
		this.mousedown = mousedown(this);
		this.keydown = keydown(this);

		window.addEventListener('mousedown', this.mousedown, false);
		window.addEventListener('keydown', this.keydown, false);
		var bez = this;

		var animDuration = 3000;
		var last = new Date();
		function _draw() {
			bez.timeout = setTimeout(function() {
				var now = new Date();
				bez.drawScene.apply(bez, [((now - last) % animDuration) / animDuration]);
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

	Bezier.prototype.drawScene = function(t) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.lineWidth = 5;
			this.ctx.strokeStyle = '#5F505B';
			if (this.showLines)
				this.drawLines();

			this.drawCurve(this.ctx, t, this.points);

			if (this.showLines)
				this.drawPoints();

			if (this.showHelpLines)
				this.drawHelpLines(t);
	};

	Bezier.prototype.drawCurve = function(ctx, t) {
		var points = [];
		if (arguments.length === 3) {
			points = arguments[2];
		} else {
			for (i = 2; i < arguments.length; i++)
				points.push(arguments[i]);
		}

		var supportPoints = computeSupportPoints(points);
		if (this.showCurve)
			paintCurve(ctx, supportPoints);

		if (this.showImage) {
			var p = supportPoints[Math.floor(t * supportPoints.length)];
			this.drawImage(p);
		}
	};

	Bezier.prototype.drawHelpLines = function(t) {
		var ctx = this.ctx;
		ctx.save();
		var helpPoints = [];

		var tmp = this.points;

		ctx.strokeStyle = '#777';
		ctx.strokeWidth = 1;
		while (tmp.length > 1) {
			var curtmp = [];
			for (var i = 0; i < tmp.length - 1; i++) {
				var p1 = tmp[i];
				var p2 = tmp[i + 1];
				var x = p1.x + (p2.x - p1.x) * t;
				var y = p1.y + (p2.y - p1.y) * t;
				curtmp.push(P(x, y));
			}

			ctx.beginPath();
			for (var q = 0; q < curtmp.length - 1; q++) {
				p1 = curtmp[q];
				p2 = curtmp[q + 1];
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
			}
			ctx.stroke();

			tmp = curtmp.slice(0); //helpPoints.slice(0);
			helpPoints = helpPoints.concat(curtmp.slice(0));
		}

		ctx.fillStyle = "#398999";
		ctx.beginPath();
		for (var j = 0; j < helpPoints.length; j++) {
			var p = helpPoints[j];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI, false);
		}
		ctx.fill();
		ctx.restore();
	};

	Bezier.prototype.drawPoints = function() {
		var ctx = this.ctx;
		ctx.save();
		ctx.fillStyle = "#398999";
		ctx.beginPath();

		this.points.forEach(function(point) {
			ctx.moveTo(point.x, point.y);
			ctx.arc(point.x, point.y, 7, 0, 2*Math.PI, false);
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

	Bezier.prototype.drawImage = function(p) {
		var ctx = this.ctx;
		ctx.save();

		ctx.drawImage(this.img, p.x - (this.img.width / 2), p.y - (this.img.height / 2));

		ctx.restore();
	};

	Bezier.prototype.update = function(node) {
		this.updateNode = node;

		var x1 = transform(this.points[1].x);
		var y1 = transform(this.points[1].y, true);
		var x2 = transform(this.points[2].x);
		var y2 = transform(this.points[2].y, true);
		this.updateNode.innerText = "cubic-bezier(" + x1 + ", " + y1 + ", " + x2 + ", " + y2 + ")";
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

			if (ev.keyCode == 220)
				bez.showCurve = !bez.showCurve;

			if (ev.keyCode == 76)
				bez.showHelpLines = !bez.showHelpLines;
		}
	};

	function mousedown(bez) {
		var canvas = bez.canvas;
		var points = bez.points;
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

				if (!bez.updateNode)
					return;

				var x1 = transform(points[1].x);
				var y1 = transform(points[1].y, true);
				var x2 = transform(points[2].x);
				var y2 = transform(points[2].y, true);
				bez.updateNode.innerText = "cubic-bezier(" + x1 + ", " + y1 + ", " + x2 + ", " + y2 + ")";
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

	function transform(p, isY) {
		var ret = -1;
		if (isY)
			ret = (1 - ((p - 100) / 300)).toFixed(2);
		else
			ret = ((p - 100) / 300).toFixed(2);

		return ret;
	}

	global.Bezier = Bezier;
})(window);