from . import query
from ...models import Schedule
from sqlalchemy import text


@query("schedule")
def resolve_schedule(obj, info):
    schedule = Schedule.query.order_by(text("created_at desc")).first()
    if schedule is None:
        return
    else:
        return schedule.get_schedule_per_day()
