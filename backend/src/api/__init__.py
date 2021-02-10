from ariadne import (
    gql,
    load_schema_from_path,
    make_executable_schema,
    graphql_sync,
)
from ariadne.constants import PLAYGROUND_HTML
from flask import request, jsonify, redirect, Blueprint
from . import queries, mutations
from .resolver import datetime_scalar
from flask_cors import CORS


type_defs = gql(load_schema_from_path("schema.graphql"))

schema = make_executable_schema(
    type_defs, datetime_scalar, queries.query, mutations.base.ariadne_mutation
)


def init_api(app):
    CORS(app)

    @app.route("/", methods=["GET"])
    def index():
        return redirect("/graphql")

    @app.route("/graphql", methods=["GET"])
    def graphql_playground():
        """Serve GraphiQL playground"""
        return PLAYGROUND_HTML, 200

    @app.route("/graphql", methods=["POST"])
    def graphql_server():
        data = request.get_json()
        success, result = graphql_sync(
            schema, data, context_value=request, debug=app.debug
        )
        status_code = 200 if success else 400
        return jsonify(result), status_code

    # logging.basicConfig(
    #     level=logging.DEBUG,
    #     format="[%(asctime)s]: {} %(levelname)s %(message)s".format(os.getpid()),
    #     datefmt="%Y-%m-%d %H:%M:%S",
    #     handlers=[logging.StreamHandler()],
    # )
    # logger = logging.getLogger()

    # def create_app(config_name=None):
    #     logger.info(f"Starting app in {config.APP_ENV} environment")
    #     app = Flask(__name__, instance_relative_config=True)
    #     app.config.from_object(app_config[config_name])
    #     # app.config.from_pyfile("config.py")

    #     db.init_app(app)
    #     migrate = Migrate(app, db)
    #     from api import models

    #     return app
