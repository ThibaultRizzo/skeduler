from .models import Shift, Day, Employee, Schedule
from ariadne import QueryType, convert_kwargs_to_snake_case
from .decorators import mutation
from .resolver import datetime_scalar
from sqlalchemy import text

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
        days = [day.to_dict() for day in Day.query.order_by(Day.name.asc()).all()]
        print(days[0])
        payload = {"result": days, "success": True}
    except Exception as error:
        payload = {"errors": [str(error)]}
    return payload


@convert_kwargs_to_snake_case
@query.field("employees")
def resolve_employees(obj, info):
    try:
        employees = [employee.to_dict() for employee in Employee.query.all()]
        payload = {"success": True, "result": employees}
    except Exception as error:
        payload = {"success": False, "errors": [str(error)]}
    return payload


@convert_kwargs_to_snake_case
@query.field("schedule")
def resolve_schedule(obj, info):
    try:
        schedule = Schedule.query.order_by(text("created_at desc")).first()
        payload = {"success": True, "result": schedule.get_schedule_per_day()}
    except Exception as error:
        payload = {"success": False, "errors": [str(error)]}
    return payload
