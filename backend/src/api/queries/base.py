from ariadne import QueryType, convert_kwargs_to_snake_case
from ..errors import NoRecordError, InvalidInputError
from loguru import logger

ariadne_query = QueryType()


@logger.catch
def getErrorPayload(e, message):
    logger.error(e)
    return {
        "success": False,
        "errors": [message],
    }


def query(func_name, inject_company_id=True):
    @convert_kwargs_to_snake_case
    def query_wrapper(func):
        def decorator(obj, info, **kwargs):
            try:
                if inject_company_id:
                    # TODO: Find better way to pass company ID
                    company_id = info.context.headers.get("companyId")
                    result = func(obj, info, company_id, **kwargs)
                else:
                    result = func(obj, info, **kwargs)
                payload = {"success": True, "result": result}

            except NoRecordError as e:
                payload = getErrorPayload(e, "NoRecordError")
            except InvalidInputError as e:
                payload = getErrorPayload(e, "InvalidInputError")
            except BaseException as e:
                payload = getErrorPayload(e, "Something went wrong")
                raise e
            return payload

        return ariadne_query.field(func_name)(decorator)

    return query_wrapper
