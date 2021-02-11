from . import query
from ...models import Shift


@query("shifts")
def resolve_shifts(obj, info):
    shifts = [shift.to_dict() for shift in Shift.query.all()]
    return shifts
