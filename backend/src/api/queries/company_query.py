from . import query
from src.models import Company, CompanySequenceRule, CompanyTransitionRule


@query("companies", inject_company_id=False)
def resolve_companies(obj, info):
    return Company.get_all()


@query("company")
def resolve_company_by_id(obj, info, company_id):
    return Company.get_by_id(company_id)


@query("sequenceRules")
def resolve_sequence_rules(obj, info, company_id):
    return CompanySequenceRule.get_all_by_company_id(company_id)


@query("transitionRules")
def resolve_transition_rules(obj, info, company_id):
    return CompanyTransitionRule.get_all_by_company_id(company_id)
