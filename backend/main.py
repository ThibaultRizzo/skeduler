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
