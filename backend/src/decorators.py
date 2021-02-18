import functools
from ariadne import MutationType, convert_kwargs_to_snake_case
from .api.mutations import mutation
from .api import InvalidDateError

# ariadne_mutation = MutationType()


def error_handler(fn):
    def decorated(*args, **kwargs):
        try:
            payload = fn(*args, **kwargs)
        except InvalidDateError:  # date format errors
            payload = {
                "success": False,
                "errors": [
                    f"Incorrect date format provided. Date should be in "
                    f"the format dd-mm-yyyy"
                ],
            }
        except Error:
            payload = {
                "success": False,
                "errors": [f"Something wrong happened. Try again later"],
            }
        return payload

    return decorated
