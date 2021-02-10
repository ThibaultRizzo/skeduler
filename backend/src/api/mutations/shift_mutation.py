from . import mutation
from ...models import Shift
from ...database import db
from ..errors import NoRecordError


@mutation("createShift")
def resolve_create_shift(_, info, input):
    title = input["title"]
    duration = input["duration"]
    shift_importance = input["shiftImportance"]
    cover_monday = input["coverMonday"]
    cover_tuesday = input["coverTuesday"]
    cover_wednesday = input["coverWednesday"]
    cover_thursday = input["coverThursday"]
    cover_friday = input["coverFriday"]
    cover_saturday = input["coverSaturday"]
    cover_sunday = input["coverSunday"]

    shift = Shift(
        title=title,
        duration=duration,
        shift_importance=shift_importance,
        cover_monday=cover_monday,
        cover_tuesday=cover_tuesday,
        cover_wednesay=cover_wednesday,
        cover_thursday=cover_thursday,
        cover_friday=cover_friday,
        cover_saturday=cover_saturday,
        cover_sunday=cover_sunday,
    )
    db.session.add(shift)
    db.session.commit()
    return shift.to_dict()


@mutation("updateShift")
def resolve_update_shift(_, info, input):
    id = input["id"]
    shift = Shift.query.get(id)
    # TODO: Raise error when id is not matching any record
    # if shift is None:
    #     raise NoRecordError()
    shift.title = input["title"]
    shift.duration = input["duration"]

    db.session.commit()
    return shift.to_dict()


@mutation("deleteShift")
def resolve_delete_shift(_, info, id):
    # TODO: Raise error when id is not matching any record
    # if shift is None:
    #     raise NoRecordError()
    Shift.query.filter_by(id=id).delete()
    db.session.commit()
    return True
