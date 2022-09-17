import json
import sys
import os
import pymongo
import redis
from celery import Celery
from flask import Flask
from flask_cors import CORS
import datetime
import sys
import pandas as pd

from training.routes import training_bp
from inference.routes import inference_bp

# from stock.stockRoutes import stock_bp
# from model.modelRoutes import model_bp


app = Flask(__name__)
CORS(app)


app.config["celery1"] = client1 = Celery(
    "vunga_tasks_1",
    broker=f"redis://{os.getenv('REDIS_HOST')}/1",
    backend=f"redis://{os.getenv('REDIS_HOST')}/1")

app.config["celery2"] = client2 = Celery(
    "vunga_tasks_2",
    broker=f"redis://{os.getenv('REDIS_HOST')}/2",
    backend=f"redis://{os.getenv('REDIS_HOST')}/2")


app.config["cortex_redis"] = redis.StrictRedis(
    host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), db=1)


app.register_blueprint(training_bp)
app.register_blueprint(inference_bp)
# app.register_blueprint(stock_bp)
# app.register_blueprint(model_bp)


app.config["db_conn"] = pymongo.MongoClient(
    os.getenv("MONGO_HOST"),
    int(os.getenv("MONGO_PORT")),
    username=os.getenv("MONGO_USERNAME"),
    password=os.getenv("MONGO_PASSWORD"))[
    os.getenv("MONGO_DB")]


if __name__ == '__main__':
    if os.getenv("ENVIRONMENT") == "DEV":
        app.run(host=os.getenv("SERVER_HOST"), port=int(
            os.getenv("SERVER_PORT")), debug=True, ssl_context=('cert.pem', 'key.pem'))
    else:
        app.run(host="0.0.0.0", port=5000)
