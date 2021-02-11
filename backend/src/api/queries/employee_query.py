from . import query
from ...models import Employee


@query("employees")
def resolve_employees(obj, info):
    employees = [employee.to_dict() for employee in Employee.query.all()]
    return employees
