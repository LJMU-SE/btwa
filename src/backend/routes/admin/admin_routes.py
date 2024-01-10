import json
import paramiko
from . import admin_blueprint
from flask import jsonify, request
import concurrent.futures
from utils.database import get_captures_by_email

def update_host(host):
    ssh = paramiko.SSHClient()
    ssh.load_system_host_keys()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, username='admin', password='admin')

    command = 'cd btns && nohup sudo ./update.sh > update.log 2> update.err < /dev/null &'
    stdin, stdout, stderr = ssh.exec_command(command)

    exit_code = stdout.channel.recv_exit_status()
    ssh.close()

    if exit_code == 0:
        return {'host': host, 'status': 200}, 200
    else:
        return {'host': host, 'status': 500, 'message': f'Command failed with code {exit_code}'}, 500


@admin_blueprint.route('/update', methods=["POST"])
async def update_nodes():
    data = json.loads(request.data)
    nodes = data.get('nodes', [])

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(update_host, nodes))

    success_results = [result for result in results if result['status'] == 200]

    if len(success_results) == len(results):
        return jsonify({'message': 'Nodes Updated'}), 200
    else:
        return jsonify({'message': 'Some Nodes Update Failed'}), 500
    
@admin_blueprint.route('/search', methods=["GET"])
async def search_for_capture():
    try:
        searches = get_captures_by_email(request.args.get('email'))
        return jsonify({"message": "Success", 'results': searches}), 200
    except Exception as e:
        return jsonify({ 'message': f'Error in search_for_capture: {e}' }), 500