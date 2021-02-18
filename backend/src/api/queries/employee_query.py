from . import query
from ...models import Employee, EmployeeEvent
from ..errors import InvalidInputError


@query("employees")
def resolve_employees(obj, info, company_id):
    return Employee.get_all_by_company_id(company_id)


@query("employeeEvents")
def resolve_employee_events(obj, info, company_id, employeeId):
    return EmployeeEvent.get_all_by_employee(employeeId)


@query("employeeEventsByInterval")
def resolve_employee_events_by_interval(
    obj, info, company_id, employeeId, startDate, endDate
):
    nb_days = endDate - startDate

    if nb_days.days < 0:
        raise InvalidInputError("End date should be after start date")
    return EmployeeEvent.get_all_by_employee_in_interval(employeeId, startDate, endDate)
