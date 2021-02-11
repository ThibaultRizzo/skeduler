from . import mutation
from ...database import db
from ...models import Day, Employee, EmployeeSkill, Shift, EmployeeEvent
from ...enums import EventStatus
from ..errors import NoRecordError


@mutation("createEmployee")
def resolve_create_employee(_, info, input):
    workingDays = input["workingDays"]

    days = db.session.query(Day).filter(Day.name.in_(workingDays)).all()
    shift_ids = map(lambda s: s["shift"], input["skills"])
    # shifts = db.session.query(Shift).filter(Shift.id.in_(shift_ids)).all()
    # skills = map(
    #     lambda s: EmployeeSkill(level=s["level"], shift_id=s["id"]), input["skills"]
    # )

    employee = Employee(
        name=input["name"],
        contract=input["contract"],
        working_days=days,
        skills=[
            EmployeeSkill(level=s["level"], shift_id=s["shift"])
            for s in input["skills"]
        ],
    )
    db.session.add(employee)
    db.session.commit()
    return employee.to_dict()


@mutation("updateEmployee")
def resolve_update_employee(_, info, input):
    id = input["id"]
    employee = Employee.query.get(id)
    # TODO: Raise error when id is not matching any record
    # if shift is None:
    #     raise NoRecordError()
    employee.name = input["name"]
    employee.contract = input["contract"]

    days = db.session.query(Day).filter(Day.name.in_(input["workingDays"])).all()
    employee.working_days = days
    print(input["workingDays"])

    # TODO: Throw error when same skill is being added twice
    skills = input["skills"]
    saved_shift_ids = [s.shift_id for s in employee.skills]
    for skill in employee.skills:
        updated_skill = next((s for s in skills if s["shift"] == skill.shift_id), None)
        if updated_skill is None:
            # Skill was removed in the update
            skill.employee = None
        elif skill.level != updated_skill["level"]:
            # Skill was updated in the update
            skill.level = updated_skill["level"]

    new_skills = [
        s for s in skills if s["shift"] not in saved_shift_ids
    ]  # filter(lambda s: , skills)

    for skill in new_skills:
        employee.skills.append(
            EmployeeSkill(shift_id=skill["shift"], level=skill["level"])
        )

    db.session.commit()
    return employee.to_dict()


@mutation("deleteEmployee")
def resolve_delete_employee(_, info, id):
    # TODO: Raise error when id is not matching any record
    # if shift is None:
    #     raise NoRecordError()
    Employee.query.filter_by(id=id).delete()
    db.session.commit()
    return True


@mutation("createEvent")
def resolve_create_event(_, info, input):
    employee_id = input.get("employee")
    shift_id = input.get("shift", None)

    employee = Employee.query.get(employee_id)

    if employee is None:
        raise NoRecordError("Could not find employee with ID: " + employee_id)

    if shift_id is not None:
        shift = Shift.query.get(shift_id)
        if shift is None:
            raise NoRecordError("Could not find shift with ID: " + shift_id)

    employee_event = EmployeeEvent(
        employee=employee,
        shift_id=shift_id,
        start_date=input.get("startDate"),
        duration=input.get("duration"),
        type=input.get("type"),
        nature=input.get("nature"),
        is_desired=input.get("isDesired"),
        ## TODO: To be changed when leave acceptance flow is detailed
        status=EventStatus.CONFIRMED,  # input.get("status")
    )
    db.session.add(employee_event)
    db.session.commit()
    return employee_event.to_dict()


@mutation("updateEvent")
def resolve_update_event(_, info, input):
    event_id = input["id"]
    event = EmployeeEvent.query.get(event_id)
    if event is None:
        raise NoRecordError("Could not find employee event with ID: " + event_id)
    else:
        event.shift = input.get("shift")
        event.start_date = input.get("startDate")
        event.duration = input.get("duration")
        event.event_type = input.get("type")
        event.status = input.get("status")
        event.nature = input.get("nature")
        event.is_desired = input.get("isDesired")

        db.session.commit()
        return event.to_dict()


@mutation("deleteEvent")
def resolve_delete_event(_, info, id):
    event = EmployeeEvent.query.get(id)
    if event is None:
        raise NoRecordError("Could not find employee event with ID: " + id)
    else:
        EmployeeEvent.query.filter_by(id=id).delete()
        db.session.commit()
        return True
