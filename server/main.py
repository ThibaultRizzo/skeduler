import os
import logging
from flask import Flask
from flask_migrate import Migrate

# local imports
from ..database import db
from api import init_api
import config

logging.basicConfig(
    level=logging.DEBUG,
    format="[%(asctime)s]: {} %(levelname)s %(message)s".format(os.getpid()),
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger()

# config_name = os.getenv("FLASK_CONFIG")
# app = create_app(config_name)


def create_app():
    logger.info(f"Starting app in {config.APP_ENV} environment")
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object("config")
    # app.config.from_pyfile("config.py")

    db.init_app(app)
    init_api(app)
    migrate = Migrate(app, db)


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", debug=True)
# import os
# from ariadne import (
#     gql,
#     load_schema_from_path,
#     make_executable_schema,
#     graphql_sync,
#     snake_case_fallback_resolvers,
#     ObjectType,
# )
# from ariadne.constants import PLAYGROUND_HTML
# from flask import request, jsonify, redirect

# from api import create_app, queries, mutations
# from api.queries import resolve_shifts
# from api.resolver import datetime_scalar
# from api.models import db


# type_defs = gql(load_schema_from_path("schema.graphql"))

# schema = make_executable_schema(
#     type_defs, datetime_scalar, queries.query, mutations.mutation
# )


# @app.route("/", methods=["GET"])
# def index():
#     return redirect("/graphql")


# @app.route("/graphql", methods=["GET"])
# def graphql_playground():
#     """Serve GraphiQL playground"""
#     return PLAYGROUND_HTML, 200


# @app.route("/graphql", methods=["POST"])
# def graphql_server():
#     data = request.get_json()
#     success, result = graphql_sync(schema, data, context_value=request, debug=app.debug)
#     status_code = 200 if success else 400
#     return jsonify(result), status_code


# if __name__ == "__main__":
#     app.run()
