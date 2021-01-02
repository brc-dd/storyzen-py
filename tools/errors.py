import http.client as httplib
import traceback

from flask.json import jsonify
from flask.wrappers import Response


def send_err(status: int) -> Response:

    resp = {
        'blocks': [{
            'type': 'header',
            'data': {
                'text': httplib.responses[status],
                'level': 2
            }
        }]
    }

    resp = jsonify(resp)
    resp.status_code = status

    if status == httplib.INTERNAL_SERVER_ERROR:
        traceback.print_exc()

    return resp