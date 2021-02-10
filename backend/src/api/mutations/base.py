from ariadne import MutationType, convert_kwargs_to_snake_case
from ..errors import InvalidDateError, NoRecordError
from ...solver.errors import SolverException

ariadne_mutation = MutationType()


def mutation(func_name):
    @convert_kwargs_to_snake_case
    def mutation_wrapper(func):
        def decorator(*args, **kwargs):
            try:
                result = func(*args, **kwargs)
                payload = {"success": True, "result": result}
            except ValueError:  # date format errors
                payload = {
                    "success": False,
                    "errors": [
                        f"Incorrect date format provided. Date should be in "
                        f"the format dd-mm-yyyy"
                    ],
                }
            except InvalidDateError:  # date format errors
                payload = {
                    "success": False,
                    "errors": [
                        f"Incorrect date format provided. Date should be in "
                        f"the format dd-mm-yyyy"
                    ],
                }
            except SolverException as err:
                print(err)
                payload = {
                    "success": False,
                    "errors": ["Solver encountered an error: " + err.message],
                }
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

        return ariadne_mutation.field(func_name)(decorator)

    return mutation_wrapper
