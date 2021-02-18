from . import query
from src.models import Shift


@query("shifts")
def resolve_shifts(obj, info, company_id):
    return Shift.get_all_by_company_id(company_id)
