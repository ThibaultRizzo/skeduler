from .models import Shift, Day, Employee
from ariadne import QueryType, convert_kwargs_to_snake_case

query = QueryType()


@convert_kwargs_to_snake_case
@query.field("shifts")
def resolve_shifts(obj, info):
    try:
        shifts = [shift.to_dict() for shift in Shift.query.all()]
        payload = {"success": True, "result": shifts}
    except Exception as error:
        payload = {"success": False, "errors": [str(error)]}
    return payload


@convert_kwargs_to_snake_case
@query.field("days")
def resolve_days(obj, info):
    try:
        days = [day.to_dict() for day in Day.query.order_by(Day.order.asc()).all()]
        payload = {"result": days, "success": True}
    except Exception as error:
        payload = {"errors": [str(error)]}
    return payload


@convert_kwargs_to_snake_case
@query.field("employees")
def resolve_employees(obj, info):
    try:
        print(Employee.query.all())
        employees = [employee.to_dict() for employee in Employee.query.all()]
        payload = {"success": True, "result": employees}
    except Exception as error:
        payload = {"success": False, "errors": [str(error)]}
    return payload
