//this file manages the socket backend

function initFunction(){

    document.getElementsByTagName("body")[0].style.backgroundColor = 'darkgoldenrod';

    const socket = new WebSocket("ws://192.168.1.84:8765");
    // const socket = new WebSocket("ws://192.168.4.1:8765");
    // const socket = new WebSocket("ws://localhost:8765")
    socket.onopen = onSocketOpen;
    socket.onerror = onSocketError;
    socket.onmessage = onSocketReceive;
    socket.onclose = onSocketClose;
}

//called when the websocket is opened
function onSocketOpen(event){
    console.log("Websocket connection established.")

    document.getElementsByTagName("body")[0].style.backgroundColor = 'darkgreen';

    broadcastNewValue = broadcastPostConnection(this)

    sliderInit();
}

//called every time the server sends a message
function onSocketReceive(event){
    console.log('Message from server:', event.data);
}

//called on any error condition such as no connection or improper close
function onSocketError(event){
    console.log("Error: " + event.message)
    document.getElementsByTagName("body")[0].style.backgroundColor = 'darkred';
}

//called on a standard socket close (i.e. server shutdown)
function onSocketClose(event){
    console.log("Socket Closed under normal conditions");
    document.getElementsByTagName("body")[0].style.backgroundColor = 'darkgray';
//TODO
}

//send an update for motor ID to become value val
//used for any connections made prior to a successful connection
//  i.e. for any preemptive connections
function broadcastNewValue(id, val) {
    console.log("Cannot Broadcast, no socket connection");
    // console.log("Broadcast - Slider " + String(id) + ": " + String(val));
}

//new broadcast function factory
//param inSocket should be a reference to the socket
//returns a function that
//  send an update for motor ID to become value val
//  used after a successful connection established
function broadcastPostConnection(inSocket) {
    return function (id, val) {
        if (id < 0 || id >= 4) {
            console.log("Unknown motor ID: " + String(id) + ". Should be integer in [0,3]");
            return;
        }
        if (Math.abs(val) > 1) {
            console.log("Illegal motor value: " + String(val) + ". Should be float in [-1,1]");
            return;
        }

        // console.log("Outgoing update: (" + id + ", " + val + ")");
        inSocket.send(String(id) + String(val));
    }
}

//function broadcastPostConnection(id, val) {
//    if (id < 0 || id >= 4) {
//        console.log("Unknown motor ID: " + String(id) + ". Should be integer in [0,3]");
//        return;
//    }
//    if (Math.abs(val) > 1) {
//        console.log("Illegal motor value: " + String(val) + ". Should be float in [-1,1]");
//        return;
//    }
//
//    console.log("Outgoing update: (" + id + ", " + val + ")");
//    // inSocket.send(String(id) + String(val));
//}
