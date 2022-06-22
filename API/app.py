from flask import Flask, jsonify, request,send_file, json, Response
from flask_cors import CORS, cross_origin
from Validation import validate_participant

app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/add_participant": {"origins": "http://localhost:5000"}})


@app.route('/get_all_concerts', methods=['GET'])
def get_all_concerts():  # put application's code here
    with open('concerts.json', 'r') as f:
        data = f.read()
        response = jsonify(json.loads(data))
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@app.route('/add_participant', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def create_record():
    response = ""
    record = json.loads(request.data)
    if validate_participant(record):
        with open('participants.json', 'r') as f:
            data = f.read()
        if not data:
            records = {'participants': [record]}
        else:
            records = json.loads(data)
            records['participants'].append(record)

        with open('participants.json', 'w') as f:
            f.write(json.dumps(records, indent=2))
        response = jsonify(record)
    else:
        response = Response("The data provided is not valid", status=403, mimetype='application/json')
    return response


if __name__ == '__main__':
    app.run()
