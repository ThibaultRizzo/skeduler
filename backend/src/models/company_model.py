from sqlalchemy import Column, Enum, String, Integer, ForeignKey, inspect
from sqlalchemy.orm import validates
from src.database import db, PkModel, PkCompanyModel, reference_col
from src.enums import SequenceRuleType, RulePenalty
from src.utils import snake_to_camel_case


class Company(PkModel):
    name = Column(String(128), unique=True)
    working_days = db.relationship(
        "Day", backref="company", cascade="all, delete, delete-orphan"
    )
    sequence_rules = db.relationship(
        "CompanySequenceRule", backref="company", cascade="all, delete, delete-orphan"
    )
    transition_rules = db.relationship(
        "CompanyTransitionRule", backref="company", cascade="all, delete, delete-orphan"
    )

    def get_rules_by_id(id):
        return {
            "sequence": CompanySequenceRule.get_all_by_company_id(id, False),
            "transition": CompanyTransitionRule.get_all_by_company_id(id, False),
        }

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }

    def __repr__(self):
        return "<Company: {}>".format(self.id, self.name)


class CompanySequenceRule(PkCompanyModel):
    rule_type = Column(Enum(SequenceRuleType), nullable=False)
    shift_id = reference_col("shift", nullable=True)
    hard_min = Column(Integer, nullable=False)
    soft_min = Column(Integer, nullable=False)
    penalty_min = Column(Enum(RulePenalty), nullable=False)
    hard_max = Column(Integer, nullable=False)
    soft_max = Column(Integer, nullable=False)
    penalty_max = Column(Enum(RulePenalty), nullable=False)

    def to_rule(self, shifts):
        shift_id = next(
            (s for s, shift in enumerate(shifts) if shift.id == self.shift_id), 0
        )
        return (
            shift_id,
            self.hard_min,
            self.soft_min,
            self.penalty_min.to_weight(),
            self.hard_max,
            self.soft_max,
            self.penalty_max.to_weight(),
        )

    # @validates(
    #     "hard_min",
    #     "soft_min",
    #     "hard_max",
    #     "soft_max",
    # )
    # def validate_constraints(self, key, value):
    #     assert value > 0
    #     return value


class CompanyTransitionRule(PkCompanyModel):
    from_shift_id = reference_col("shift", nullable=True)
    to_shift_id = reference_col("shift", nullable=True)
    penalty = Column(Enum(RulePenalty), nullable=False)

    def to_rule(self, shifts):
        from_shift = next(
            (s for s, shift in enumerate(shifts) if shift.id == self.from_shift_id), 0
        )
        to_shift = next(
            (s for s, shift in enumerate(shifts) if shift.id == self.to_shift_id), 0
        )
        return (from_shift, to_shift, self.penalty.to_weight())
