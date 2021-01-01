import http.client as htc

from flask.globals import request
from flask.json import jsonify
from flask.wrappers import Response
from flask_restful import Resource
from mongoengine.errors import DoesNotExist, FieldDoesNotExist, ValidationError

from tools.errors import send_err
from models.story import Story
from tools.uid_gen import generate_uid


class CreateStory(Resource):
    def post(self) -> Response:

        try:
            if request.is_json:
                data = request.get_json()
                data['uid'] = generate_uid(data)
                print(data['uid'])
                post_story = Story(**data).save()
                return jsonify({'id': str(post_story.id)})

            else:
                return send_err(htc.BAD_REQUEST)

        except (FieldDoesNotExist, ValidationError):
            return send_err(htc.BAD_REQUEST)

        except:
            return send_err(htc.INTERNAL_SERVER_ERROR)


class ReadStory(Resource):
    def get(self, story_id: str) -> Response:

        try:
            return jsonify(Story.objects.get(uid=story_id.lower()))

        except DoesNotExist:
            return send_err(htc.NOT_FOUND)

        except:
            return send_err(htc.INTERNAL_SERVER_ERROR)
