import functools
from ariadne import MutationType, convert_kwargs_to_snake_case

# ariadne_mutation = MutationType()


def error_handler(fn):
    print("error handler")

    def decorated(*args, **kwargs):
        try:
            payload = fn(*args, **kwargs)
        except NoRecordError:  # date format errors
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


@error_handler
def mutation(_field):
    print(_field)
    # wrapped = ariadne_mutation.field("createShift")

    def decorator(fn):
        def decorated(*args, **kwargs):
            payload = fn(*args, **kwargs)

        return decorated

    # print(ariadne_mutation.field("createShift"))
    return decorator


# def mutation(func):
#     def resolve_mutation(*args, **kwargs):
#         return func(*args, **kwargs)

#     return resolve_mutation
