var Bezier = require('./bezier.js')
var Point = require('./point');

window.startSlideshow = function() {
	var slideshow = remark.create({
		ratio: "16:9"
	});

	slideshow.on('showSlide', function(slide) {
		var index = slide.getSlideIndex();
		var canvas = document.querySelector("#c" + index);
		if (index == 1)
			slideOne(canvas, slide);

		if (index == 2)
			slideTwo(canvas, slide);

		if (index == 3)
			slideThree(canvas, slide);

		if (index == 4)
			slideFour(canvas, slide);

		if (index == 5)
			slideFive(canvas, slide);

		if (index == 6)
			slideSix(canvas, slide);

		if (index == 7)
			slideSeven(canvas, slide);
	});
	slideshow.on('hideSlide', function(slide) {
		if (slide.bezier) {
			slide.bezier.invalidate();
			delete slide.bezier;
		}
	});

	function slideOne(canvas, slide) {
		var points = [Point(100, 250), Point(250, 100), Point(250, 400), Point(400, 250)];
		slide.bezier = new Bezier(canvas);
		slide.bezier.draw(points);
	}

	function slideTwo(canvas, slide) {
		var points = [Point(100, 250), Point(400, 250)];
		slide.bezier = new Bezier(canvas);
		slide.bezier.draw(points);
	}

	function slideThree(canvas, slide) {
		var points = [Point(100, 250), Point(250, 100), Point(400, 250)];
		slide.bezier = new Bezier(canvas);
		slide.bezier.draw(points);
	}

	function slideFour(canvas, slide) {
		var points = [Point(100, 250), Point(250, 100), Point(250, 400), Point(400, 250)];
		slide.bezier = new Bezier(canvas);
		slide.bezier.draw(points);
	}

	function slideFive(canvas, slide) {
		var points = [Point(50, 250), Point(150, 150), Point(250, 150), Point(350, 150), Point(450, 250)];
		slide.bezier = new Bezier(canvas, false);
		slide.bezier.draw(points);
	}

	function slideSix(canvas, slide) {
		var points = [Point(100, 400), Point(100, 100), Point(400, 400), Point(400, 100)];
		slide.bezier = new Bezier(canvas, false);
		slide.bezier.draw(points);
		slide.bezier.update(document.querySelector('#cubic-bezier-x1-y1-x2-y2-'));
	}

	function slideSeven(canvas, slide) {
		var points = [Point(50, 250), Point(150, 150), Point(250, 150), Point(350, 150), Point(450, 250)];
		slide.bezier = new Bezier(canvas, false);
		slide.bezier.draw(points);
		slide.bezier.showImage = true;
	}
}