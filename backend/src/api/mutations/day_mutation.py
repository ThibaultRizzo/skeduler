from . import mutation
from ...models import Day
from ...database import db


@mutation("toggleDayActivation")
def resolve_toggle_day_activation(_, info, input):
    id = input["id"]
    active = input["active"]
    day = Day.query.get(id)
    day.active = active
    db.session.commit()
    return day.to_dict()


def generate_days():
    for day in DayEnum:
        db.session.add(Day(name=day, active=True))
    db.session.commit()
