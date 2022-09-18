from contextlib import closing
from signal import SIGKILL
import socket
from flask import Blueprint, current_app, request
from celery import Celery
import os
from subprocess import Popen, PIPE
from os import kill

inference_bp = Blueprint('inference_bp', __name__, template_folder='templates')

port_map = {}


def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(('', 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


@inference_bp.route('/inference', methods=['POST'])
def inference():
    available_port = 3131
    inference_config = request.get_json()
    port_map[inference_config['client_id']] = {
        'port': available_port, 'status': 'running'}
    inference_config['port'] = available_port
    print('selam')
    cmd = 'nohup python3 inference/websocket.py -p '+str(available_port)+' &'
    print(cmd)
    # os.system(cmd)
    # process = Popen(['python3', 'websocket.py', '-p', str(available_port)], shell=True, start_new_session=True,
    #                 stdout=PIPE, stderr=PIPE)
    # print(process.pid)
    # port_map[inference_config['client_id']]['pid'] = process.pid

    print('selam2')
    # stdout, stderr = process.communicate()
    # print(stdout)
    print(inference_config)
    print(port_map)
    try:
        return {"port": available_port}, 200

    except Exception as e:
        print(str(e))
        return {
            "status": "fail",
            "reason": str(e),
        }, 500

# celery = current_app.config['celery']


@inference_bp.route('/inference/<client_id>', methods=['GET'])
def get_inference_status(client_id):
    if client_id in port_map:
        return port_map[client_id], 200
    else:
        return {"status": "fail", "reason": "client_id not found"}, 404


@inference_bp.route('/inference/<client_id>', methods=['DELETE'])
def stop_inference(client_id):
    if client_id in port_map:
        kill(port_map[client_id]['pid'], SIGKILL)
        port_map[client_id]['status'] = 'stopped'

        return {"status": "success"}, 200
    else:
        return {"status": "fail", "reason": "client_id not found"}, 404
