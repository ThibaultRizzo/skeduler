import os
from api import create_app, db
from api import models, queries, mutations

from ariadne import (
    gql,
    load_schema_from_path,
    make_executable_schema,
    graphql_sync,
    snake_case_fallback_resolvers,
    ObjectType,
)
from ariadne.constants import PLAYGROUND_HTML
from flask import request, jsonify, redirect
from api.queries import resolve_shifts

config_name = os.getenv("FLASK_CONFIG")
app = create_app(config_name)

type_defs = gql(load_schema_from_path("schema.graphql"))

schema = make_executable_schema(type_defs, queries.query, mutations.mutation)


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
    success, result = graphql_sync(schema, data, context_value=request, debug=app.debug)
    status_code = 200 if success else 400
    return jsonify(result), status_code


if __name__ == "__main__":
    app.run()
