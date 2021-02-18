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

    # def create(**kwargs):
    #     return super.create(**kwargs, ['id', 'working_days'])

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
