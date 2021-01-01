import http.client as htc
import traceback

from flask.json import jsonify
from flask.wrappers import Response


def send_err(status: int) -> Response:
    resp = jsonify({'error': htc.responses[status]})
    resp.status_code = status

    if status == htc.INTERNAL_SERVER_ERROR:
        traceback.print_exc()

    return resp