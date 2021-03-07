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
from src.enums import all_enums

type_defs = gql(load_schema_from_path("schema.graphql"))

schema = make_executable_schema(
    type_defs,
    datetime_scalar,
    queries.base.ariadne_query,
    mutations.base.ariadne_mutation,
    [e.to_graph() for e in all_enums],
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
