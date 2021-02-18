from . import mutation
from src.models import Day
from src.database import db
from src.enums import DayEnum


@mutation("setDayActivation", inject_company_id=False)
def resolve_set_day_activation(obj, info, input):
    return Day.updateOne(**input)


def generate_days():
    return [Day(name=day, active=True) for day in DayEnum]
