from . import mutation
from src.models import Day, Shift, Employee, SolverPeriod, Company
from src.solver.solver import solve_shift_scheduling
from src.solver.errors import SolverException
from src.database import db


@mutation("generateSchedule")
def resolve_generate_schedule(_, info, company_id, input):
    start_date = input.get("start_date")
    nb_weeks = input.get("nb_weeks")

    rules = Company.get_rules_by_id(company_id)
    employees = Employee.get_all_by_company_id(company_id, False)
    shifts = Shift.get_all_by_company_id(company_id, False)
    days = Day.get_all_by_company_id(company_id, False)
    opts = None
    period = SolverPeriod(start_date, nb_weeks, days)
    schedule = solve_shift_scheduling(rules, employees, shifts, period, company_id)
    if schedule is None:
        raise SolverException("Could not find a feasible solution")
    else:
        db.session.add(schedule)
        db.session.commit()
        return schedule.get_schedule_per_day()
