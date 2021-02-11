from ariadne import QueryType, convert_kwargs_to_snake_case
from ..errors import NoRecordError

ariadne_query = QueryType()


def query(func_name):
    @convert_kwargs_to_snake_case
    def query_wrapper(func):
        def decorator(*args, **kwargs):
            try:
                result = func(*args, **kwargs)
                payload = {"success": True, "result": result}

            except NoRecordError:
                payload = {
                    "success": False,
                    "errors": ["Given ID does not match any persisted entity"],
                }
            except BaseException as e:
                print(str(e))
                payload = {
                    "success": False,
                    "errors": ["Something went wrong"],
                }

            return payload

        return ariadne_query.field(func_name)(decorator)

    return query_wrapper
