function initFunction(){
    console.log("Initialized");
    sliders = document.getElementsByClassName("sliderTrack");

    var key = 0;
    for(element of sliders)
    {
        setSliderToValue(element, 0);
        element.addEventListener('touchstart', sliderStartBuilder(key), false);

        key+=1;
    }
}

function cleanupFunction(){

}

//function factory for creating touch start instances
function sliderStartBuilder(id){
    return function() {sliderTouchStart(id)};
    //TODO-inita and close colliders
}

function sliderTouchStart(id=-1){
    console.log("Touch started on " + String(id));
}

//should take first the sliderTrack element, and second the value in range [-1,1]
function setSliderToValue(slider, value){
    totalHeight = slider.clientHeight;
    console.log(totalHeight);
    c = slider.children[0];

    //so its just a liner function where
    //1 -> c.clientHeight
    //-1 -> c.clientHeight + totalHeight
    
    c.style.top = String((1-value)*(totalHeight/2)+c.clientHeight);
}