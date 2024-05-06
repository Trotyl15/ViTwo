import asyncio
import websockets

connected = set()

async def server(websocket, path):
    # Register.
    connected.add(websocket)
    print("connection added")
    try:
        async for message in websocket:
            for conn in connected:
                if conn != websocket:
                    await conn.send(message)
            print("broadcasted:", message)
    finally:
        # Unregister.
        connected.remove(websocket)
        print("connection removed")
    

start_server = websockets.serve(server, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()