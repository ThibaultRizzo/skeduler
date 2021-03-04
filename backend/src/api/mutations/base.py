from ariadne import MutationType, convert_kwargs_to_snake_case
from ..errors import InvalidDateError, NoRecordError, InvalidInputError
from src.solver.errors import SolverException
from src.database import db
from psycopg2 import Error
from psycopg2.errorcodes import UNIQUE_VIOLATION
from psycopg2.errors import UniqueViolation, ForeignKeyViolation
from sqlalchemy.exc import IntegrityError
import logging

_logger = logging.getLogger()

ariadne_mutation = MutationType()


def getErrorPayload(e, message):
    _logger.error(e)
    return {
        "success": False,
        "errors": [message],
    }


def getPostgreSQLMessage(err):
    if isinstance(err.orig, UniqueViolation):
        return "A similar record already exists"
    elif isinstance(err.orig, ForeignKeyViolation):
        return "A referenced foreign was invalid"
    else:
        return "Persistence error"


def mutation(func_name, inject_company_id=True):
    def mutation_wrapper(func):
        @convert_kwargs_to_snake_case
        def decorator(obj, info, **kwargs):
            try:
                if inject_company_id:
                    # TODO: Find better way to pass company ID
                    company_id = info.context.headers.get("companyId")
                    result = func(obj, info, company_id, **kwargs)
                else:
                    result = func(obj, info, **kwargs)
                payload = {"success": True, "result": result}
            except IntegrityError as e:
                payload = getErrorPayload(e, getPostgreSQLMessage(e))
            except ValueError as e:  # date format errors
                payload = getErrorPayload(e, "ValueError" + str(e))
            except InvalidDateError as e:  # date format errors
                payload = getErrorPayload(
                    e,
                    f"Incorrect date format provided. Date should be in "
                    f"the format dd-mm-yyyy",
                )
            except SolverException as e:
                payload = getErrorPayload(
                    e,
                    "Solver encountered an error: " + e.message
                    if hasattr(e, "message")
                    else e,
                )
            except NoRecordError as e:
                payload = getErrorPayload(e, "NoRecordError" + e)
            except TypeError as e:
                payload = getErrorPayload(e, e.message if hasattr(e, "message") else e)
            except BaseException as e:
                payload = getErrorPayload(e, "Something went wrong")
                raise e

            return payload

        return ariadne_mutation.field(func_name)(decorator)

    return mutation_wrapper


@convert_kwargs_to_snake_case
def create_entity(cls, **kwargs):
    """Create a new record and save it the database."""
    excluded_keys = ["id"]
    fields = filter(excluded_keys, kwargs)

    instance = cls(**fields)
    db.session.add(instance)
    db.session.commit()
    return instance.to_dict()


def delete_entity(id, cls, name):
    entity = cls.query.get(id)
    if entity is None:
        raise NoRecordError(f"Could not find {name} with ID: " + id)
    else:
        cls.query.filter_by(id=id).delete()
        db.session.commit()
        return True
