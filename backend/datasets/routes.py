from contextlib import closing
import json
import re
from signal import SIGKILL
import socket
from flask import Blueprint, current_app, request
from celery import Celery
from bson.json_util import dumps
import os
from subprocess import Popen, PIPE, list2cmdline
from os import kill

datasets_bp = Blueprint('datasets_bp', __name__, template_folder='templates')

@datasets_bp.route('/datasets', methods=['POST'])
def dataset_upload():
    
    try:
        print("Request received")
        db = current_app.config["db_conn"]
        datasets_db = db["datasets"]
        print("Request DB")



        file = request.files["file"]
        filename = request.form["fileName"]

        if(".yaml" in filename):

            datasets_write_db = {
                "name":filename,
                "location":"../data/{}".format(filename)
                }
            print("bbbbbbbbbbbbbbbbbbb")
            datasets_db.insert_one(datasets_write_db)
            print("aaaaaaaaaaaaaaaaaaa")

            file.save("../data/{}".format(filename))

            return {"status": "Success"}, 200
        else:
            return {"status": "Wrong Type of File"}, 500

    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500


@datasets_bp.route('/datasets', methods=['GET'])
def dataset_get():
    try:
        db = current_app.config["db_conn"]
        datasets_db = db["datasets"]
        datasets = list(datasets_db.find({}))
        print(datasets)

        json_dat = json.loads(dumps(datasets))

        return {"status": "Success", "datasets": json_dat}, 200
    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500
