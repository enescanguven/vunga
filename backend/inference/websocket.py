#!/usr/bin/env python

# WS server that sends camera streams to a web server using opencv
import ssl
import pathlib

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
            # os.kill(os.getpid(), 9)
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
            # os.kill(os.getpid(), 9)
            pass

            # image = Image.open(io.BytesIO(img_data))
            # cv2.imwrite('./0.jpg', image)

            # print(len(data))
            # print(data[0])
            # print(type(data[1]))

            # print(str(x))
            # img = base64.b64decode(str(data[1]))
            # jpg_as_np = np.frombuffer(img, dtype=np.uint8)
            # img = cv2.imdecode(jpg_as_np, flags=1)
            # # cv2.imshow("Stream", img)
            # # cv2.imwrite('./0.jpg', img)
            # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            # print(type(img))
            # print(len(img))
            # faces = detector.detect_faces(img)
            # faces[0]['keypoints']['nose']
            # print(faces)

            # await websocket.send(json.dumps(faces[0]))
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
        # except Exception as e:
        #     print(e)
        #     pass
try:
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(
        './cert.pem', './key.pem')
    start_server = websockets.serve(
        time, os.getenv("SERVER_HOST"), args["port"], ssl=ssl_context)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
except Exception as e:
    print(e)
    # os.kill(os.getpid(), 9)

    pass
