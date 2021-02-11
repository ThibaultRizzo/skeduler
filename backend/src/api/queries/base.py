from ariadne import QueryType, convert_kwargs_to_snake_case
from ..errors import NoRecordError, InvalidInputError

ariadne_query = QueryType()


def returnError(message):
    return {
        "success": False,
        "errors": [message],
    }


def query(func_name):
    @convert_kwargs_to_snake_case
    def query_wrapper(func):
        def decorator(*args, **kwargs):
            try:
                result = func(*args, **kwargs)
                payload = {"success": True, "result": result}

            except NoRecordError as e:
                payload = {
                    "success": False,
                    "errors": ["NoRecordError", e],
                }
            except InvalidInputError as e:
                payload = returnError(e)
            except BaseException as e:
                print(str(e))
                payload = {
                    "success": False,
                    "errors": ["Something went wrong", e],
                }

            return payload

        return ariadne_query.field(func_name)(decorator)

    return query_wrapper
