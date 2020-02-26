//this file manages the js related to the socket communication

socket = null;

function testFunction(){
    console.log("Button clicked.");
    socket.send("BUTTON");

}

jsUpdateCounter = 0;

//called when the webpage is loaded
function initFunction(){
    document.getElementsByTagName("body")[0].style.backgroundColor = 'grey';
    console.log("Socket Connecting");
    initializeSocket();
    initializeJoystick();
}

//TODO - reevaluate this, it doesn't seem necessary
//subscripbe to the onOpen event instead for initlization logic
//the socket will tell us when its ready
async function initializeSocket(){
    socket = new WebSocket("ws://192.168.4.1:8765");
    startTime = (new Date()).getTime();
    hasConnection = false;

    while((new Date()).getTime()-startTime < connectSpinTime)
    {
        if(socket.readyState == 1)
        {
            hasConnection = true
            break;
        }

        //sleep for 100 ms
        await new Promise(r => setTimeout(r, 100));
    }

    if(!hasConnection)
    {
        //the connection failed to resolve
        console.log("The connection could not be established in the given connection time.");
        document.getElementsByTagName("body")[0].style.backgroundColor = "red";
        return;
    }

    document.getElementsByTagName("body")[0].style.backgroundColor = 'white';
    socket.addEventListener('message', function(event){
        totalCount+=1;
        //console.log('Socket Received: ', event.data);
    })
    socket.send("HELLO!")
}

//called when the webpage is unloaded via closure or reload
function cleanupFunction(){
    //send a goodbye message trigger any server side cleanup
    socket.send("BYE-BYE"); 

    //send a formal closure,
    //NOTE - 1001 is closure by crash/navigation away, but in this instance
    //  that is the standard closure behavior, which is why close 1000 (ok) is used
    socket.close(1000, 'End of application, webpage closed.')

    document.getElementsByTagName("body")[0].style.backgroundColor = "purple";
}

//do any logic to simulate the closure of a webpage (and thus websocket)
function simulateKill(){
    cleanupFunction();
}


const connectSpinTime = 5000; //the time to spin waiting for a connection in milliseconds
const burstTestTime = 5000; //the time of the burst test in milliseconds
totalCount = 0;

async function burstTest(){
    console.log("Beginning burst test.");
    totalCount = 0; //how many ping-pongs have occurred

    startTime = (new Date()).getTime();

    while((new Date()).getTime()-startTime < connectSpinTime)
    {
        socket.send("PING");
    }
    lclCount = totalCount; //grab a local copy in case the processor is still processing response
    console.log("Burst Test Report:");
    console.log("\tTotal time " + String(burstTest/1000) + "s")
    console.log("\tTotal messages " + String(lclCount))
    console.log("\tMessages per second " + String(lclCount/(burstTest/1000)))

}


function updateJoystickPosition(x, y)
{
    msg = "JSPos "+jsUpdateCounter+": (" + x + ", " + y + ")" 
    // console.log(msg);
    if(socket!=null)
    {
        socket.send(msg);
    }
    jsUpdateCounter++;
}
