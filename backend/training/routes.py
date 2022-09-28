from bson.json_util import dumps
import json
from flask import Blueprint, current_app, request


training_bp = Blueprint('training_bp', __name__, template_folder='templates')


@training_bp.route('/trainings', methods=['GET'])
def get_all_trainings():
    try:
        db = current_app.config["db_conn"]
        trainings = db["trainings"]
        cursor = list(trainings.find({}))
        json_data = json.loads(dumps(cursor))
        return {"trainings": json_data}
    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500


@training_bp.route('/training/start', methods=['POST'])
def start_training():
    try:
        db = current_app.config["db_conn"]
        trainings = db["trainings"]
        print(request.json['dataset'])
        print(request.json['model'])
        # print(current_app.config["celery"])
        job_id = str(current_app.config["celery"].send_task(
            "vunga_tasks.train", args=[request.json['dataset'], request.json['model']]))

        return 'Start Training'
    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500
