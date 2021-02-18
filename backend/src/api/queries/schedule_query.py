from . import query
from src.models import Schedule


@query("schedule")
def resolve_schedule(obj, info, company_id):
    schedule = (
        Schedule.query.filter_by(company_id=company_id)
        .order_by(Schedule.created_at.desc())
        .first()
    )
    return schedule if schedule is None else schedule.get_schedule_per_day()
