# flask packages
from flask.app import Flask
from flask_restful import Api
from flask_mongoengine import MongoEngine

# project resources
from api.story import CreateStory, ReadStory

# default mongodb configuration
default_config = {
    'MONGODB_SETTINGS': {
        'db': 'storyzen',
        'host': 'localhost',
        'port': 27017
    }
}


def create_routes(api: Api):

    # add resources to the api
    api.add_resource(CreateStory, '/')
    api.add_resource(ReadStory, '/<story_id>')


def get_flask_app(config: dict = None) -> Flask:

    # init flask
    flask_app = Flask(__name__)

    # configure app
    config = default_config if config is None else config
    flask_app.config.update(config)

    # init api and routes
    api = Api(app=flask_app)
    create_routes(api=api)

    # init mongoengine
    db = MongoEngine(app=flask_app)

    return flask_app


if __name__ == '__main__':

    # main entry point when run in stand-alone mode
    app = get_flask_app()
    app.run(debug=True)