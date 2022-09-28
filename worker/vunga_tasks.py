import os
import sys
import pymongo
import redis
from celery import Celery
import requests
import time
from TrainContext import TrainContext
from yolov5.train import main 
from yolov5.train import parse_opt
client = Celery(
    "vunga_tasks",
    broker=f"redis://{os.getenv('REDIS_HOST')}/0",
    backend=f"redis://{os.getenv('REDIS_HOST')}/0")


def initialize():
    try:
        print("Initializing mongo connection")
        db = pymongo.MongoClient(
            os.getenv("MONGO_HOST"),
            int(os.getenv("MONGO_PORT")),
            username=os.getenv("MONGO_USERNAME"),
            password=os.getenv("MONGO_PASSWORD"))[
            os.getenv("MONGO_DB")]
    except Exception as e:
        print("Error while connecting mongo", str(e))
        sys.exit(1)
    try:
        print("Initializing redis connection")
        r = redis.StrictRedis(host=os.getenv("REDIS_HOST"),
                              port=os.getenv("REDIS_PORT"), db=1)
    except Exception as e:
        print("Error while connecting redis", str(e))
        sys.exit(1)
    return db, r


@client.task
def train(dataset, model):
    db, r = initialize()
    trainings = db["trainings"]
    print("Training started")
    print(dataset.split('/')[0])
    print(model)
    print(list(trainings.find({})))
    trainings.insert_one({"dataset":dataset,"model":model,"status":"started",'created_at':time.time(),'progress':20})
    cmd = "python3 yolov5/train.py --data"+dataset.split('/')[0]+" --cfg "+model+" --weights '' --batch-size 128"
    os.system(cmd)
    trainings.insert_one({"dataset":dataset,"model":model,"status":"started",'time':time.time(),'progress':0})



    # opt = parse_opt()
    # main(opt)
    # print("Training started")


    # print(model)
    # print(dataset)
    # train = TrainContext(train_conf, celery)
    # train.train_test()
    # print("train begin")
