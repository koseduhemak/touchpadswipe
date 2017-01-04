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
var sensivity = 25;
// when to clear counters (in ms)
var resetCounterThreshold = 800;
// animations disabled?
var enableAnimation = true;

// sloth to dont shake browsers content if user accidently scrolls horizontal
var sloth = 5;

var isDebug = false;

var currentDirection = false;
var htmlBody = $("body");
var unload = false;

// timeOutFuction
var timeOut = false;


var options;

// apply options
function applyOptions() {
    chrome.storage.sync.get({
        animationsEnabled: true
    }, function(items) {
        enableAnimation = items.animationsEnabled;

        if (enableAnimation) {
            $(window).on("beforeunload", animateBrowserPaging);
        }
    });
}

// listen for changes in options
chrome.storage.onChanged.addListener(function(changes, namespace) {
    applyOptions();
});


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
					animateBody(-1);
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

				if (counterRight >= sloth) {
                    animateBody(1);
				}

				counterRight++
			}

			if (timeOut == false) {
				timeOutFunc(true);
			}
		} else {
			clearTimeoutAdvanced();
		}
}

$(document).ready(function() {
    applyOptions();
	$(document).scroll();
	htmlBody.addClass("touchpadSwipeAnimationCore");
});

function animateBrowserPaging() {
	if (currentDirection != false) {
        if (currentDirection > 0) {
            var animClass = "touchpadSwipeAnimateTransitionBrowserPagingOutgoingForward";
        } else {
            var animClass = "touchpadSwipeAnimateTransitionBrowserPagingOutgoingBack";
        }
        htmlBody.addClass(animClass);
    }
}

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
	animateBody(0, true);
	timeOut = false;
}

function animateBody(leftOrRight, force) {
	if ((enableAnimation && !$(htmlBody).is(':animated')) || force) {

		if (leftOrRight > 0) {
			// forwards
			if (htmlBody.hasClass("touchpadSwipeAnimateLeft50px")) {
                htmlBody.removeClass("touchpadSwipeAnimateLeft50px");
			}
			if (!htmlBody.hasClass("touchpadSwipeAnimateRight50px")) {
				htmlBody.addClass("touchpadSwipeAnimateRight50px");
            }
		} else if (leftOrRight < 0) {
            // backwards
            if (htmlBody.hasClass("touchpadSwipeAnimateRight50px")) {
                htmlBody.removeClass("touchpadSwipeAnimateRight50px");
            }
            if (!htmlBody.hasClass("touchpadSwipeAnimateLeft50px")) {
                htmlBody.addClass("touchpadSwipeAnimateLeft50px");
            }
		} else {
			// reset
            if (htmlBody.hasClass("touchpadSwipeAnimateLeft50px")) {
                htmlBody.removeClass("touchpadSwipeAnimateLeft50px");
            }
            if (htmlBody.hasClass("touchpadSwipeAnimateRight50px")) {
                htmlBody.removeClass("touchpadSwipeAnimateRight50px");
            }
		}
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