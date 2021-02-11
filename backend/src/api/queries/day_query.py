from . import query
from ...models import Day


@query("days")
def resolve_days(obj, info):
    days = [day.to_dict() for day in Day.query.order_by(Day.name.asc()).all()]
    return days
