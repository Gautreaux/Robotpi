function sliderInit() {
    // console.log("Initialized");
    setAllSlidersToValue(0);

    sliders = document.getElementsByClassName("markerCollider");

    var key = 0;
    for (element of sliders) {
        broadcastNewValue(key, 0);
        sliderStartBuilder(element, key.valueOf())
        // element.addEventListener('touchstart', sliderStartBuilder(element, key), false);

        key += 1;
    }
    key = -1; //this is to help debugging when there are weird references
}

function cleanupFunction() {

}


//function factory for creating touch start instances
//BIG ERROR- FIXME - in move, element is always the last one
//  i.e. this only works because all are same hight and only one touch at a time
function sliderStartBuilder(element, myId) {
    //id definitely varies on input
    //but due to some closure bs, it is persistent across calls?

    console.log(myId)
    //create the scoped items:
    let sliderTouchIdentifier = null;
    let sliderTouchStartLocation = null;

    //TODO
    let moveFunction = function (ev) {
        ev.preventDefault(); //prevent secondary mouse click events

        // console.log("move " + String(myId));

        myTouch = null;
        for (i = 0; i < ev.targetTouches.length; i++) {
            if (ev.targetTouches[i].identifier == sliderTouchIdentifier) {
                myTouch = ev.targetTouches[i];
                break;
            }
        }

        if (myTouch == null) {
            //the master touch could not be found,
            //which should not be possible since the event is unregistered once it ends
            return;
        }

        //find the maximum height and the mid point
        sliderLength = this.parentElement.clientHeight;
        sliderMidpoint = this.parentElement.parentElement.clientHeight / 2.0;

        nowY = myTouch.clientY;

        // console.log(nowY);
        val = (sliderMidpoint - nowY) / sliderLength * 2;

        //bound the result
        if (val > 1) { val = 1; }
        else if (val < -1) { val = -1; }
        //also add a small deadzone to make stopping easier
        if (Math.abs(val) < .05) { val = 0; }

        setSliderToValue(this.parentElement, val)
        broadcastNewValue(myId.valueOf(), val);

    }

    let startFunction = function (ev) {
        ev.preventDefault(); //prevent secondary mouse click events

        // console.log("Touch started on " + String(myId));

        if (ev.targetTouches.length != 0 && sliderTouchIdentifier == null) {

            //assign the first targeting touch point as the value
            myTouch = ev.targetTouches[0];
            sliderTouchIdentifier = myTouch.identifier;
            sliderTouchStartLocation = [myTouch.clientX, myTouch.clientY];

            element.addEventListener('touchmove', moveFunction, false);

            //need to log the range of motion (how much can the slider move?):
            //the max movement has the joystick tangent to the top of the joystick box
            //just assuming that the items are both squares
        }
    }

    resetSlider = function () {
        sliderTouchIdentifier = null;
        sliderTouchStartLocation = null;
    }

    //TODO
    let endFunction = function (ev) {
        // console.log("touch Ended " + String(myId));

        ev.preventDefault(); //prevent secondary mouse click events

        element.removeEventListener('touchmove', moveFunction);


        if (sliderTouchIdentifier == null) {
            //there is no relevant touch, do nothing
            return;
        }

        for (i = 0; i < ev.targetTouches.length; i++) {
            if (ev.targetTouches[i].identifier == sliderTouchIdentifier) //will this work?
            {
                //the touch point we decided was master still exists
                //so do nothing
                return;
            }
        }

        //find the ending point
        //this requires scanning the altered list for the touch object

        //can the master touch be changed and a false touch removed in the same event?
        //  if not- the prior loop is not necessary

        myTouch = null;

        for (i = 0; i < ev.changedTouches.length; i++) {
            if (ev.changedTouches[i].identifier == sliderTouchIdentifier) {
                myTouch = ev.changedTouches[i];
                break;
            }
        }

        //check error conditions
        if (myTouch == null) {
            // console.log("On slider release, could not find matching touch identifier.");
            //reset the object so that error is 'fixed'
            resetSlider();
            return;
        }

        //FIXME
        endPosition = [myTouch.clientX, myTouch.clientY];
        // console.log(myId + ":" + sliderTouchStartLocation + "->" + endPosition);
        resetSlider();

    }

    element.addEventListener('touchstart', startFunction, false);
    element.addEventListener('touchend', endFunction, false);

}

//should take first the sliderTrack element, and second the value in range [-1,1]
function setSliderToValue(slider, value) {
    if (Math.abs(value) > 1) {
        console.log("Attempted to set slider to illegal value: " + String(value));
        value = 0;
    }
    totalHeight = slider.clientHeight;
    parentHeight = slider.parentElement.clientHeight;

    c = slider.children[0];

    ans = 0.0;

    //map value so that 0 - top limit, .5 - middle, 1 - bottom limit
    ans = totalHeight * (((1 - value)) / 2.0);

    //do the base offset for the slider
    ans += (parentHeight - totalHeight) / 2.0;

    c.style.top = String(ans);
}

//call setSliderToValue for each slider
function setAllSlidersToValue(value) {
    sliders = document.getElementsByClassName("sliderTrack");

    for (element of sliders) {
        setSliderToValue(element, value);
    }
}