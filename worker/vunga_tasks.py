import os
import sys
import pymongo
import redis
from celery import Celery
import requests
import time
from TrainContext import TrainContext

client1 = Celery(
    "vunga_tasks_1",
    broker=f"redis://{os.getenv('REDIS_HOST')}/1",
    backend=f"redis://{os.getenv('REDIS_HOST')}/1")

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


@client1.task
def train(train_conf, celery):
    train = TrainContext(train_conf, celery)
    train.train_test()
    print("train begin")
