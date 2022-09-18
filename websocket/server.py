#!/usr/bin/env python

# WS server that sends camera streams to a web server using opencv

import ssl
import asyncio
import json
import websockets
import cv2
import base64
import io
import base64
from PIL import Image
import numpy as np

from mtcnn import MTCNN


async def time(websocket, path):
    while True:
        print("Sending")
        detector = MTCNN()

        x = await websocket.recv()
        try:
            data = x.split(',')
            print(len(data))
            print(type(data[1]))

            # print(str(x))
            img = base64.b64decode(str(data[1]))
            jpg_as_np = np.frombuffer(img, dtype=np.uint8)
            img = cv2.imdecode(jpg_as_np, flags=1)
            # cv2.imshow("Stream", img)
            # cv2.imwrite('./0.jpg', img)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            print(type(img))
            print(len(img))
            faces = detector.detect_faces(img)
            faces[0]['keypoints']['nose']
            print(faces)

            await websocket.send(json.dumps(faces[0]))
            # I assume you have a way of picking unique filenames
            # filename = 'some_image.jpg'+str(data[1])[5]
            # with open(filename, 'wb') as f:
            #     f.write(img)
            # print(img)
            # with open('readme.txt', 'w') as f:
            #     f.write(x)
            # print(x)
            # exit()
            # npimg = np.fromstring(x, dtype=np.uint8)
            # cv2.imshow("Stream", npimg)
            # print(npimg.shape)
            # source = cv2.imdecode(npimg, 1)
            # cv2.imwrite("data/test.jpg", source)
            # print(npimg)
        except Exception as e:
            print(e)
            pass


ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(
    './cert.pem', './key.pem')
start_server = websockets.serve(time, "0.0.0.0", 3131, ssl=ssl_context)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
