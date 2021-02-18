import os
import sys
import logging
from flask import Flask

# local imports
from src import commands, api
from src.extensions import db, migrate


def create_app(config_object="src.settings"):
    app = Flask(__name__)
    app.config.from_object(config_object)
    register_extensions(app)
    register_shellcontext(app)
    register_commands(app)
    configure_logger(app)

    return app


def register_extensions(app):
    """Register Flask extensions."""
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_api(app)

    return None


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db}

    app.shell_context_processor(shell_context)


def register_commands(app):
    """Register Click commands."""
    commands.init_app(app)
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)


def configure_logger(app):
    """Configure loggers."""
    logging.basicConfig(
        level=logging.DEBUG,
        format="[%(asctime)s]: {} %(levelname)s %(message)s".format(os.getpid()),
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler()],
    )
    # logger = logging.getLogger()
    # handler = logging.StreamHandler(sys.stdout)
    # if not app.logger.handlers:
    #     app.loggeraddHandler(handler)
