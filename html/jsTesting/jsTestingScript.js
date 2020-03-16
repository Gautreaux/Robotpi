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

function initFunction(){
    div = document.getElementsByClassName("divTest");
    var key = 0;
    for(element of div){
        console.log("DING" + key)
        divStartBuilder(element, key.valueOf())
        key +=1;
    }
    key = -1;
}

function cleanupFunction() {

}


//function factory for creating touch start instances
//BIG ERROR- FIXME - in move, element is always the last one
//  i.e. this only works because all are same hight and only one touch at a time
function divStartBuilder(element, myId) {
    //id definitely varies on input
    //but due to some closure bs, it is persistent across calls?

    console.log(myId)

    new function(){
    let secret = new Object();
    secret.value = 0;

    //TODO
    moveFunction = function (ev) {
            console.log("Move: " + myId)
            secret.value+=1;
    }

    startFunction = function (ev) {
        console.log("Start: " + myId)
        ev.preventDefault(); //prevent secondary mouse click events

        // console.log("Touch started on " + String(myId));

        // element.addEventListener('touchmove', function (ev){console.log("Move: " + myId)}, false);
    }

    //TODO
    endFunction = function (ev) {
        // console.log("touch Ended " + String(myId));

        ev.preventDefault(); //prevent secondary mouse click events

        // element.removeEventListener('touchmove');
        console.log("Touch end: " + myId + " " + secret.value)
    }

    element.addEventListener('touchstart', startFunction, false);
    element.addEventListener('touchmove', moveFunction, false);
    element.addEventListener('touchend', endFunction, false);
    }
}