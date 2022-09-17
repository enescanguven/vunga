from contextlib import closing
from signal import SIGKILL
import socket
from flask import Blueprint, current_app, request
from celery import Celery
import os
from subprocess import Popen, PIPE
from os import kill

training_bp = Blueprint('training_bp', __name__, template_folder='templates')

@training_bp.route('/training', methods=['POST'])
def train_model():
    train_config = request.get_json()
    
    try:
        job_id = str(current_app.config["celery"].send_task(
            "cyberdroid_tasks.train", args=[train_config]))

        return {"port": "Model"}, 200

    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500

# celery = current_app.config['celery']

