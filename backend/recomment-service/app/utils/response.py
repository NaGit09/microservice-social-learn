from flask import jsonify


def response_format(status_code=200, message="Success", data=None):
    response = {"statusCode": status_code, "message": message, "data": data}
    return jsonify(response), status_code
