import json
import paramiko
from . import admin_blueprint
from flask import jsonify, request

def update_host(host):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, port=22, username='admin', password='admin', timeout=10)

        command = 'cd btns && nohup sudo ./update.sh > update.log 2> update.err < /dev/null &'
        stdin, stdout, stderr = client.exec_command(command)

        exit_code = stdout.channel.recv_exit_status()
        
        client.close()

        if exit_code == 0:
            return {'host': host, 'status': 200}
        else:
            return {'host': host, 'status': 500, 'message': f'Command failed with code {exit_code}'}

    except Exception as e:
        return {'host': host, 'status': 500, 'message': f'Error: {str(e)}'}


@admin_blueprint.route('/update', methods=["POST"])
async def update_nodes():
    data = json.loads(request.data)
    nodes = data.get('nodes', [])

    results = []

    for node in nodes:
        result = update_host(node)
        results.append(result)

    success_results = [result for result in results if result['status'] == 200]

    if len(success_results) == len(results):
        return jsonify({'message': 'Nodes Updated'}), 200
    else:
        return jsonify({'message': 'Some Nodes Update Failed'}), 500
