import ssl
import threading
import os
import asyncio
import json
import websockets
import cv2
import base64
import base64
import numpy as np
import argparse

from mtcnn import MTCNN


ap = argparse.ArgumentParser()
ap.add_argument("-p", "--port", required=True, help="sayi giriniz")
args = vars(ap.parse_args())
detector = MTCNN()


async def time(websocket, path):
    while True:
        print("Sending")
        try:
            x = await asyncio.wait_for(websocket.recv(), timeout=3)
            print(x)
        except asyncio.TimeoutError:
            os.kill(os.getpid(), 9)
            print("errorrrrr")
        # x = await websocket.recv()
        try:
            x = json.loads(x)
            img_str = str(x['data'].split(',')[1])
            img = base64.b64decode(img_str)
            jpg_as_np = np.frombuffer(img, dtype=np.uint8)

            img = cv2.imdecode(jpg_as_np, flags=1)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            faces = detector.detect_faces(img)
            await websocket.send(json.dumps(faces))
        except Exception as e:
            print(e)
            print("errorrrrr")
            os.kill(os.getpid(), 9)
            pass


def between_callback():

    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(
        './cert.pem', './key.pem')

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    ws_server = websockets.serve(
        time, os.getenv("SERVER_HOST"), args["port"], ssl=ssl_context)

    loop.run_until_complete(ws_server)
    loop.run_forever()  # this is missing


if __name__ == "__main__":
    # daemon server thread:
    server = threading.Thread(target=between_callback, daemon=True)
    server.start()
