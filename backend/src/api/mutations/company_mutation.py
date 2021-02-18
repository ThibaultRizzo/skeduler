from . import mutation, delete_entity, create_entity
from src.models import Company, CompanyTransitionRule, CompanySequenceRule, Shift
from src.database import db
from src.enums import SequenceRuleType, RulePenalty

from .day_mutation import generate_days
from src.api.errors import NoRecordError


@mutation("createCompany", inject_company_id=False)
def resolve_create_company(obj, info, input):
    input["working_days"] = generate_days()
    input["sequence_rules"] = generate_basic_seq_rules()
    input["transition_rules"] = generate_basic_transition_rules()
    return Company.create(**input)


@mutation("updateCompany", inject_company_id=False)
def resolve_update_company(obj, info, input):
    return Company.updateOne(**input)


@mutation("deleteCompany", inject_company_id=False)
def resolve_delete_company(obj, info, id):
    return Company.deleteOne(id)


@mutation("createSequenceRule")
def resolve_create_sequence_rule(obj, info, company_id, input):
    input["company_id"] = company_id
    return CompanySequenceRule.create(**input).to_dict()


@mutation("updateSequenceRule", inject_company_id=False)
def resolve_update_sequence_rule(_, info, input):
    return CompanySequenceRule.updateOne(**input)


@mutation("deleteSequenceRule", inject_company_id=False)
def resolve_delete_sequence_rule(_, info, id):
    return CompanySequenceRule.deleteOne(id)


@mutation("createTransitionRule")
def resolve_create_transition_rule(obj, info, company_id, input):
    input["company_id"] = company_id
    return CompanyTransitionRule.create(**input).to_dict()


@mutation("updateTransitionRule", inject_company_id=False)
def resolve_update_transition_rule(_, info, input):
    return CompanyTransitionRule.updateOne(**input)


@mutation("deleteTransitionRule", inject_company_id=False)
def resolve_delete_transition_rule(_, info, id):
    return CompanyTransitionRule.deleteOne(id)


def generate_basic_seq_rules():
    one_off_day_every_five_working_days_rule = CompanySequenceRule(
        rule_type=SequenceRuleType.SHIFT_SEQUENCE,
        shift_id=None,
        hard_min=1,
        soft_min=2,
        penalty_min=RulePenalty.MEDIUM,
        hard_max=7,
        soft_max=6,
        penalty_max=RulePenalty.SOFT,
    )
    return [one_off_day_every_five_working_days_rule]


def generate_basic_transition_rules():
    return []
