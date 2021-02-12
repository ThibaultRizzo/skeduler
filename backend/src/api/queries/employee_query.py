from . import query
from ...models import Employee, EmployeeEvent
from ..errors import InvalidInputError
from sqlalchemy import or_, and_


@query("employees")
def resolve_employees(obj, info):
    employees = [employee.to_dict() for employee in Employee.query.all()]
    return employees


@query("employeeEvents")
def resolve_employee_events(obj, info, employeeId):
    return [
        event.to_dict()
        for event in EmployeeEvent.query.filter_by(employee_id=employeeId).all()
    ]


@query("employeeEventsByInterval")
def resolve_employee_events_by_interval(obj, info, id, startDate, endDate):
    nb_days = endDate - startDate
    if nb_days.days < 0:
        raise InvalidInputError("End date should be after start date")
    events = EmployeeEvent.query.filter(
        and_(
            EmployeeEvent.employee_id == id,
            or_(
                and_(
                    EmployeeEvent.start_date >= startDate,
                    EmployeeEvent.start_date <= endDate,
                ),
                and_(
                    EmployeeEvent.start_date <= startDate,
                    EmployeeEvent.end_date >= startDate,
                ),
            ),
        )
    ).all()
    return [event.to_dict() for event in events]
