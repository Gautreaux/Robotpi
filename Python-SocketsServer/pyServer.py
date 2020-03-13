#https://websockets.readthedocs.io/en/stable/intro.html#installation

import asyncio
import websockets

global globalCounter #to give each connection a unique value

#this syntax loops until messages are done
# async def consumer_handler(websocket, path):
#     async for message in websocket:
#         await consumer(message)

async def hello(websocket, path):
    global globalCounter
    clientID = globalCounter
    globalCounter+=1
    print("New connection #" + str(clientID))
    clientLogicalClock = 0 #what is the client's logical clock
    while True:
        #why does the server not wait here? but on send instead?
        try:
            msg = await websocket.recv()
        except websockets.exceptions.ConnectionClosedOK:
            return
        except:
            print("Another exception occurred.")
            return

        if(msg[0] == "J"):
            #parse out the logical clock value
            #note- this is not necessary if can guarantee in-order delivery
            thisClock = int(msg[msg.find(" ")+1:msg.find(":")])
            if(thisClock > clientLogicalClock):
                clientLogicalClock = thisClock;
                print(f"#{clientID}:{msg}")
            else:
                print(f"#{clientID}:received message out of order, ignoring.")
            continue

        print(f"Client #{clientID}< {msg}")

        

        greeting = f"ECHO {clientID}:{msg}"
        try:
            #comment out response for testing
            await websocket.send(greeting)
            pass
        except websockets.exceptions.ConnectionClosedOK:
            print(f"Client #{clientID} was closed under normal conditions.")
            return
        except:
            print("Another exception occurred.")
            return
        print(f"{clientID}> {greeting}")

if __name__ == "__main__":
    global globalCounter
    globalCounter = 0

    hostname = "0.0.0.0"
    port = 8765

    start_server = websockets.serve(hello, hostname, port)

    print(f"Server ready to accept connections on {hostname}:{port}")

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
