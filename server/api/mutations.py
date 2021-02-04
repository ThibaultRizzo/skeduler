from .models import (
    Shift,
    Day,
    Employee,
    EmployeeSkill,
    Schedule,
    ScheduleEmployee,
    ScheduleShift,
)
from ariadne import MutationType, convert_kwargs_to_snake_case
from api import db
from .enums import DayEnum
from .errors import NoRecordError
from .solver.solver import solve_shift_scheduling
from .solver.errors import SolverException
from .models.dto import SolverPeriod

mutation = MutationType()


### ********
### Shift
### ********


@convert_kwargs_to_snake_case
@mutation.field("createShift")
def resolve_create_shift(_, info, input):
    try:
        title = input["title"]
        duration = input["duration"]

        shift = Shift(title=title, duration=duration)
        db.session.add(shift)
        db.session.commit()
        payload = {"success": True, "result": shift.to_dict()}
    except NoRecordError:  # date format errors
        payload = {
            "success": False,
            "errors": [
                f"Incorrect date format provided. Date should be in "
                f"the format dd-mm-yyyy"
            ],
        }

    return payload


@convert_kwargs_to_snake_case
@mutation.field("updateShift")
def resolve_update_shift(_, info, input):
    try:
        id = input["id"]
        shift = Shift.query.get(id)
        print(Shift.query.get(id))
        # TODO: Raise error when id is not matching any record
        # if shift is None:
        #     raise NoRecordError()
        shift.title = input["title"]
        shift.duration = input["duration"]

        db.session.commit()
        print(shift.to_dict())
        payload = {"success": True, "result": shift.to_dict()}
    except NoRecordError:
        payload = {
            "success": False,
            "errors": ["Given ID does not match any persisted shift"],
        }

    return payload


@convert_kwargs_to_snake_case
@mutation.field("deleteShift")
def resolve_delete_shift(_, info, id):
    try:
        # TODO: Raise error when id is not matching any record
        # if shift is None:
        #     raise NoRecordError()
        Shift.query.filter_by(id=id).delete()
        db.session.commit()
        payload = {
            "success": True,
        }
    except NoRecordError:
        payload = {
            "success": False,
            "errors": ["Given ID does not match any persisted shift"],
        }

    return payload


### ********
### Employee
### ********


@convert_kwargs_to_snake_case
@mutation.field("createEmployee")
def resolve_create_employee(_, info, input):
    try:
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
        payload = {
            "result": employee.to_dict(),
            "success": True,
        }  # {"success": True, "employee": employee.to_dict()}
    except ValueError:  # date format errors
        payload = {
            "success": False,
            "errors": [
                f"Incorrect date format provided. Date should be in "
                f"the format dd-mm-yyyy"
            ],
        }

    return payload


@convert_kwargs_to_snake_case
@mutation.field("updateEmployee")
def resolve_update_employee(_, info, input):
    try:
        id = input["id"]
        employee = Employee.query.get(id)
        # TODO: Raise error when id is not matching any record
        # if shift is None:
        #     raise NoRecordError()
        employee.name = input["name"]
        employee.contract = input["contract"]

        days = db.session.query(Day).filter(Day.name.in_(input["workingDays"])).all()
        employee.working_days = days

        # TODO: Throw error when same skill is being added twice
        skills = input["skills"]
        saved_shift_ids = [s.shift_id for s in employee.skills]
        for skill in employee.skills:
            updated_skill = next(
                (s for s in skills if s["shift"] == skill.shift_id), None
            )
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
        payload = {"success": True, "result": employee.to_dict()}
    except NoRecordError:
        payload = {
            "success": False,
            "errors": ["Given ID does not match any persisted employee"],
        }

    return payload


@convert_kwargs_to_snake_case
@mutation.field("deleteEmployee")
def resolve_delete_employee(_, info, id):
    try:
        # TODO: Raise error when id is not matching any record
        # if shift is None:
        #     raise NoRecordError()
        Employee.query.filter_by(id=id).delete()
        # shifts = Employee
        # Shift.query.filter_by(id=employee)
        # employee.delete()
        # db.session.delete(employee)
        db.session.commit()
        payload = {
            "success": True,
        }
    except NoRecordError:
        payload = {
            "success": False,
            "errors": ["Given ID does not match any persisted shift"],
        }

    return payload


@mutation.field("createOrganization")
@convert_kwargs_to_snake_case
def resolve_create_organization(_, info):
    generate_days()
    return True


### ********
### Working Days
### ********


@mutation.field("toggleDayActivation")
@convert_kwargs_to_snake_case
def resolve_toggle_day_activation(_, info, input):
    try:
        id = input["id"]
        active = input["active"]
        day = Day.query.get(id)
        print(day)
        day.active = active
        db.session.commit()
        payload = {"success": True, "result": day.to_dict()}

    except NoRecordError:
        payload = {
            "success": False,
            "errors": ["Given ID does not match any persisted employee"],
        }
    return payload


def generate_days():
    for day in DayEnum:
        db.session.add(Day(name=day, active=True))
    db.session.commit()


### ********
### Schedule
### ********
@mutation.field("generateSchedule")
@convert_kwargs_to_snake_case
def resolve_generate_schedule(*_, input):
    start_date = input.get("start_date")
    nb_weeks = input.get("nb_weeks")
    try:
        employees = Employee.query.all()
        shifts = Shift.query.all()
        days = dict((d.name, d) for d in Day.query.all())
        opts = None
        period = SolverPeriod(start_date, nb_weeks, days)
        schedule = solve_shift_scheduling(employees, shifts, period)

        db.session.add(schedule)
        db.session.commit()
        payload = {"success": True, "result": schedule.get_schedule_per_day()}
    except SolverException as err:
        print(err)
        payload = {
            "success": False,
            "errors": ["Solver encountered an error: " + err.message],
        }
    return payload
