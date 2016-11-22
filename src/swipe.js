// scrollRight
$.fn.extend({
    scrollRight: function (val) {
        if (val === undefined) {
            return this[0].scrollWidth - (this[0].scrollLeft + this[0].clientWidth) + 1;
        }
        return this.scrollLeft(this[0].scrollWidth - this[0].clientWidth - val);
    }
});

var counterLeft = 0;
var counterRight = 0;
var isLeft = false;
var isRight = false;
// how long user have to scroll left/right before history back / forward
var sensivity = 10;
// when to clear counters (in ms)
var resetCounterThreshold = 2000;
// animations disabled?
var enableAnimation = true;
var animationSteps = {
	back: {
		swipe: "+=100",
		opacity: "-=0.3"
	},
	forward: {
		swipe: "-100",
		opacity: "-=0.3"
	}
};

// sloth to dont shake browsers content if user accidently scrolls horizontal
var sloth = 5;

var isDebug = false;

var currentDirection = -1;
var htmlBody = $("body");
var previousPosition = htmlBody.css("position");

var unload = false;

// timeOutFuction
var timeOut = false;

$(document).scroll(function() {
	var left = $("body").scrollLeft();
	var right = $("body").scrollRight();
	
	debug("scrollLeft: "+left);
	debug("scrollRight: "+right);
	if (left == 0) {
		debug("i am left!");
		isLeft = true;
	} else {
		isLeft = false;
		counterLeft = 0;
	}
	
	if (right == 0) {
		counterRight = true;
	} else {
		isRight = true;
		counterRight = 0;
	}
});


var timeOutFunc = function() {
	debug("timeout called");
	if (counterLeft > sloth || counterRight > sloth) {
		reset();
		return;
	}

	timeOut = setTimeout(timeOutFunc, resetCounterThreshold);
};

$(document).on('mousewheel', swipe);

function swipe(event) {
		if ((isLeft || isRight) && Math.abs(event.deltaX) > 0) {

			// back
			if (event.deltaX < 0 && isLeft) {
				debug("left "+counterLeft);
				if (counterLeft > sensivity) {
					$(document).off("mousewheel");
					debug("going back");
					counterLeft = 0;

					currentDirection = -1;

					history.go(-1);
					setTimeout(function() {reattachEvent(-1);}, 500);
				}

				if (counterLeft >= sloth) {
					animateBody(animationSteps.back.swipe, animationSteps.back.opacity);
				}

				counterLeft++;
			}

			if (event.deltaX > 0 && isRight) {
				debug("right "+counterRight);
				if (counterRight > sensivity) {
					debug("going forward");
					$(document).off("mousewheel");
					counterRight = 0;

					currentDirection = 1;

					history.go(1);
					setTimeout(function() {reattachEvent(1);}, 500);
				}

				if (counterRight == sloth) {
					swipeRight = $("body").scrollRight()+parseInt(animationSteps.forward.swipe)
				} else {
					swipeRight = "-="+Math.abs(parseInt(animationSteps.forward.swipe));
				}

				if (counterRight >= sloth) {
					animateBody(swipeRight, animationSteps.forward.opacity);
				}

				counterRight++;
			}


			if (timeOut == false) {
				timeOutFunc(true);
			}
		} else {
			clearTimeoutAdvanced();
		}
}

$(document).ready(function() {
	$(document).scroll();	
});

$(window).on("beforeunload", function() {
	unload = true;

	htmlBody.animate({
		left: currentDirection*(-1000),
		opacity: 0
	}, 200);
});

function reattachEvent(direction) {
	// reattach if not refreshing page
	if (!unload) {
		$(document).on("mousewheel", swipe);
		reset();
	}
}

function reset() {
	counterLeft = 0;
	counterRight = 0;
	debug("timeout: resetting...");
	animateBody(0, 1, true);
	timeOut = false;
}

function animateBody(howMuchLeftRight, howMuchOpacity, force) {
	if ((enableAnimation && !$(htmlBody).is(':animated')) || force) {
		htmlBody.css("position", "absolute");
		
		if (force) {
			htmlBody.clearQueue();
		}
		
		htmlBody.animate({
			left: howMuchLeftRight,
			opacity: howMuchOpacity
		}, 200, function() {
			if (howMuchOpacity == 1) {
				htmlBody.css("position", previousPosition);
			}
		});
	}
}

function clearTimeoutAdvanced() {
	clearTimeout(timeOut);
	timeOut = false;

}

function debug(str) {
	if (isDebug) {
		console.log(str);
	}
}