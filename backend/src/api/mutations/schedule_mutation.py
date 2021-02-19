from . import mutation
from src.models import Day, Shift, Employee, SolverPeriod
from src.solver.solver import solve_shift_scheduling, SolverException


@mutation("generateSchedule")
def resolve_generate_schedule(_, info, company_id, input):
    start_date = input.get("start_date")
    nb_weeks = input.get("nb_weeks")

    employees = Employee.query.all()
    shifts = Shift.query.all()
    days = Day.get_all_by_company_id(company_id, False)
    opts = None
    period = SolverPeriod(start_date, nb_weeks, days)
    schedule = solve_shift_scheduling(employees, shifts, period)
    if schedule is None:
        raise SolverException("Could not find a feasible solution")
    else:
        db.session.add(schedule)
        db.session.commit()
        return schedule.get_schedule_per_day()
