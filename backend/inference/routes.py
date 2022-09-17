from flask import Blueprint, current_app, request
from flask import Flask
from flask_cors import CORS, cross_origin
from celery import Celery
import os

inference_bp = Blueprint('inference_bp', __name__, template_folder='templates')



db = current_app.config['db_conn']
celery = Celery(
    "crn_kapar_tasks",
    broker=f"redis://{os.getenv('REDIS_HOST')}/0",
    backend=f"redis://{os.getenv('REDIS_HOST')}/0")

app = Flask(__name__)
CORS(app, supports_credentials=True)


@inference_bp.route('/inference', methods=['POST'])
def inference():
    client_dict = {"clientID":"port"}
    
    try:
        clientID = request.json["clientID"]
        if (clientID in client_dict.keys):
            client_port = client_dict[clientID]

        job_id_1 = str(celery.send_task(
        "vunga_tasks.inference_1", args=[]).id)
        
        return {"status": "success"}, 200

    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500

