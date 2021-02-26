from sqlalchemy import Column, String, Integer, Enum
from src.database import db, PkModel, PkCompanyModel
from src.enums import ShiftImportance


class Shift(PkCompanyModel):
    title = Column(String(16), unique=True)
    duration = Column(Integer)
    skills = db.relationship("EmployeeSkill", cascade="all, delete, delete-orphan")

    cover_monday = Column(Integer, default=0)
    cover_tuesday = Column(Integer, default=0)
    cover_wednesday = Column(Integer, default=0)
    cover_thursday = Column(Integer, default=0)
    cover_friday = Column(Integer, default=0)
    cover_saturday = Column(Integer, default=0)
    cover_sunday = Column(Integer, default=0)

    shift_importance = Column(Enum(ShiftImportance), nullable=False)

    def get_cover_penalty(self):
        return self.shift_importance.to_weight()

    def get_cover_constraints(self):
        return (
            self.cover_monday,
            self.cover_tuesday,
            self.cover_wednesday,
            self.cover_thursday,
            self.cover_friday,
            self.cover_saturday,
            self.cover_sunday,
        )

    def __repr__(self):
        return "<Shift: {}>".format(self.title)


REST_SHIFT = Shift(title="R", duration=0)
