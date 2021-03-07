import os
from loguru import logger
from flask import Flask
from flask_migrate import Migrate

# local imports
from src.database import db
from api import init_api
import config


def create_app():
    logger.info(f"Starting app in {config.APP_ENV} environment")
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object("config")

    db.init_app(app)
    init_api(app)
    migrate = Migrate(app, db)


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", debug=True)
