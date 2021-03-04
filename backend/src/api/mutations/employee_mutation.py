from . import mutation
from src.database import db
from src.models import Day, Employee, EmployeeSkill, Shift, EmployeeEvent
from src.enums import EventStatus
from ..errors import NoRecordError
from src.utils import pop_keys


@mutation("createEmployee")
def resolve_create_employee(_, info, company_id, input):
    input["company_id"] = company_id
    skills, rest = pop_keys(input, ["skills"])
    rest["skills"] = [
        EmployeeSkill(level=s["level"], shift_id=s["shift_id"]) for s in skills
    ]
    return Employee.create(**rest).to_dict()


@mutation("updateEmployee")
def resolve_update_employee(_, info, company_id, input):
    employee_id = input["id"]
    skills, rest = pop_keys(input, ["skills"])
    employee = Employee.get_or_throw(employee_id)
    employee.updateSkills(skills)

    return employee.update(**rest).to_dict()


@mutation("deleteEmployee", inject_company_id=False)
def resolve_delete_employee(_, info, id):
    return Employee.deleteOne(id)


@mutation("createEvent", inject_company_id=False)
def resolve_create_event(_, info, input):
    input["status"] = EventStatus.CONFIRMED
    return EmployeeEvent.create(**input)


@mutation("updateEvent", inject_company_id=False)
def resolve_update_event(_, info, input):
    return EmployeeEvent.updateOne(**input)


@mutation("deleteEvent", inject_company_id=False)
def resolve_delete_event(_, info, id):
    return EmployeeEvent.deleteOne(id)
