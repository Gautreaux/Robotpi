//jaja

const socket = new WebSocket("ws://localhost:8765");


function testFunction(){
    console.log("Button clicked.");
    socket.send("TEST");
}

socket.addEventListener('message', function(event){
    console.log('Socket Received: ', event.data);
})