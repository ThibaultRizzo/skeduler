from . import query
from src.models import Day


@query("days")
def resolve_days(obj, info, company_id):
    return Day.get_all_by_company_id(company_id)
