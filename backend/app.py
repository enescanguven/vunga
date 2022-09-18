import json
import sys
import os
import pymongo
import redis
from celery import Celery
from flask import Flask, Response
from flask_cors import CORS
import datetime
import sys
import pandas as pd

from training.routes import training_bp
from inference.routes import inference_bp
from datasets.routes import datasets_bp

# from stock.stockRoutes import stock_bp
# from model.modelRoutes import model_bp


app = Flask(__name__)
CORS(app)


app.config["celery"] = Celery(
    "vunga_tasks",
    broker=f"redis://{os.getenv('REDIS_HOST')}/0",
    backend=f"redis://{os.getenv('REDIS_HOST')}/0")

# app.config["celery2"] = client2 = Celery(
#     "vunga_tasks_2",
#     broker=f"redis://{os.getenv('REDIS_HOST')}/2",
#     backend=f"redis://{os.getenv('REDIS_HOST')}/2")


app.config["cortex_redis"] = redis.StrictRedis(
    host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), db=1)


app.register_blueprint(training_bp)
app.register_blueprint(inference_bp)
app.register_blueprint(datasets_bp)
# app.register_blueprint(stock_bp)
# app.register_blueprint(model_bp)


app.config["db_conn"] = pymongo.MongoClient(
    os.getenv("MONGO_HOST"),
    int(os.getenv("MONGO_PORT")),
    username=os.getenv("MONGO_USERNAME"),
    password=os.getenv("MONGO_PASSWORD"))[
    os.getenv("MONGO_DB")]

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))

def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        # Figure out how flask returns static files
        # Tried:
        # - render_template
        # - send_file
        # This should not be so non-obvious
        return open(src).read()
    except IOError as exc:
        return str(exc)

@app.route('/camera', methods=['GET'])
def metrics():  # pragma: no cover
    content = get_file('index.html')
    return Response(content, mimetype="text/html")

if __name__ == '__main__':
    print(os.getenv("MONGO_HOST"))
    if os.getenv("ENVIRONMENT") == "DEV":
        app.run(host=os.getenv("SERVER_HOST"), port=int(
            os.getenv("SERVER_PORT")), debug=True, ssl_context=('cert.pem', 'key.pem'))
    else:
        app.run(host="0.0.0.0", port=5000)
