from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# https://github.com/cookiecutter-flask/cookiecutter-flask/blob/master/%7B%7Bcookiecutter.app_name%7D%7D/%7B%7Bcookiecutter.app_name%7D%7D/extensions.py
db = SQLAlchemy()
migrate = Migrate()
