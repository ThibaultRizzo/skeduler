from . import mutation
from .day_mutation import generate_days
from ...models import Day, Shift, Employee, SolverPeriod
from ...solver.solver import solve_shift_scheduling, SolverException


@mutation("generateSchedule")
def resolve_generate_schedule(*_, input):
    start_date = input.get("start_date")
    nb_weeks = input.get("nb_weeks")

    employees = Employee.query.all()
    shifts = Shift.query.all()
    days = Day.query.all()
    opts = None
    period = SolverPeriod(start_date, nb_weeks, days)
    schedule = solve_shift_scheduling(employees, shifts, period)

    if schedule is None:
        raise SolverException("Could not find a feasible solution")
    else:
        db.session.add(schedule)
        db.session.commit()
        return schedule.get_schedule_per_day()
