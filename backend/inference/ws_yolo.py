#!/usr/bin/env python

# WS server that sends camera streams to a web server using opencv

import ssl
import asyncio
import json
import websockets
import cv2
import base64
import base64
from PIL import Image
import numpy as np
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("-p", "--port", required=True, help="sayi giriniz")
ap.add_argument("-m", "--model", required=True, help="sayi giriniz")

args = vars(ap.parse_args())
import torch

# Model
model = torch.hub.load('ultralytics/yolov5', args['model'])  # or yolov5n - yolov5x6, custom


async def time(websocket, path):
    while True:
        print("Sending")

        x = await websocket.recv()
        try:
            data = x.split(',')
            print(len(data))
            print(type(data[1]))

            # print(str(x))
            img = base64.b64decode(str(data[1]))
            jpg_as_np = np.frombuffer(img, dtype=np.uint8)
            img = cv2.imdecode(jpg_as_np, flags=1)

            results= model(img)
            


            await websocket.send(json.dumps(results.pandas().xyxy[0].to_json()))

        except Exception as e:
            print(e)
            pass


ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(
    './cert.pem', './key.pem')
start_server = websockets.serve(time, "0.0.0.0", args['port'], ssl=ssl_context)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
