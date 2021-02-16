from sqlalchemy import Column, String
from src.database import db
from .helper import ID


class Company(db.Model):
    id = ID()
    name = Column(String(128), unique=True)
    rules = db.relationship(
        "CompanyRule", backref="rule", cascade="all, delete, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "rules": self.rules,
        }

    def __repr__(self):
        return "<Company: {}>".format(self.id, self.name)


class CompanyRule(db.Model):
    id = ID()
    company_id = Column(
        String(128), ForeignKey("company.id", ondelete="CASCADE"), nullable=False
    )
    rule_type = Column(Enum(RuleType), nullable=False)
    entity_id = Column(String(128), nullable=False)
