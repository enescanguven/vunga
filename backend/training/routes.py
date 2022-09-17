from bson.json_util import dumps
import json
from flask import Blueprint, current_app, request


training_bp = Blueprint('training_bp', __name__, template_folder='templates')


@training_bp.route('/training', methods=['GET'])
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
    db = current_app.config["db_conn"]
    trainings = db["trainings"]
    print(request.json)

    return 'Start Training'
