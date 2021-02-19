from sqlalchemy import Column, ForeignKey, String, Integer, Boolean, Enum
from sqlalchemy.ext.hybrid import hybrid_property
from src.database import db, PkModel, PkCompanyModel, reference_col
from src.enums import DayEnum


class Day(PkCompanyModel):
    name = Column(Enum(DayEnum))
    active = Column(Boolean)

    @hybrid_property
    def order(self):
        return self.name.get_order()

    @order.expression
    def order(self):
        return self.name

    def __repr__(self):
        return f"<Day: {self.name}"

    def get_all_by_company_id(company_id, to_dict=True):
        return [
            entity.to_dict() if to_dict is True else entity
            for entity in Day.query.filter_by(company_id=company_id)
            .order_by(Day.order.asc())
            .all()
        ]

    def get_all_by_company_and_name(company_id, names):
        return Day.query.filter(Day.company_id == company_id, Day.name.in_(names)).all()
