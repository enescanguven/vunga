from contextlib import closing
import re
from signal import SIGKILL
import socket
from flask import Blueprint, current_app, request
from celery import Celery
import os
from subprocess import Popen, PIPE
from os import kill

datasets_bp = Blueprint('datasets_bp', __name__, template_folder='templates')

@datasets_bp.route('/datasets', methods=['POST'])
def dataset_upload():
    
    print(request.f["file"])
        
    try:
        file = request.files['file']
        print(file)

        return {"port": "Model"}, 200

    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500

# celery = current_app.config['celery']

