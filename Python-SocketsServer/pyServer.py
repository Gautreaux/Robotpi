#https://websockets.readthedocs.io/en/stable/intro.html#installation

import asyncio
import websockets

global globalCounter

#this syntax loops until messages are done
# async def consumer_handler(websocket, path):
#     async for message in websocket:
#         await consumer(message)

async def hello(websocket, path):
    global globalCounter
    msgID = globalCounter
    globalCounter+=1
    print("Global counter: " + str(msgID))
    while True:
        #why does the server not wait here? but on send instead?
        try:
            name = await websocket.recv()
        except websockets.exceptions.ConnectionClosedOK:
            return
        except:
            print("Another exception occurred.")
            return

        print(f"{msgID}< {name}")

        greeting = f"Hello {name}! {msgID}"
        try:
            await websocket.send(greeting)
        except websockets.exceptions.ConnectionClosedOK:
            print(f"{msgID} was closed under normal conditions.")
            return
        except:
            print("Another exception occurred.")
            return
        print(f"{msgID}> {greeting}")

if __name__ == "__main__":
    global globalCounter
    globalCounter = 0

    start_server = websockets.serve(hello, "localhost", 8765)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
