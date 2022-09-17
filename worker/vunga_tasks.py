import os
import sys
import pymongo
import redis
from celery import Celery
import requests
import time
client = Celery(
    "crn_kapar_tasks",
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
def inference_1(inference_conf):
    print("inference begin")

@client.task
def inference_2():
    print("inference begin")

@client.task
def trainference_3():
    print("inference begin")

@client.task
def trainference_4():
    print("inference begin")