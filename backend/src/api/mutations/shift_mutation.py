from . import mutation
from src.models import Shift
from src.database import db
from ..errors import NoRecordError


@mutation("createShift")
def resolve_create_shift(_, info, company_id, input):
    input["company_id"] = company_id
    return Shift.create(**input).to_dict()


@mutation("updateShift", inject_company_id=False)
def resolve_update_shift(_, info, input):
    return Shift.updateOne(**input)


@mutation("deleteShift", inject_company_id=False)
def resolve_delete_shift(_, info, id):
    return Shift.deleteOne(id)
