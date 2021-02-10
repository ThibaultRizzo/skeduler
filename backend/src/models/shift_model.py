from sqlalchemy import Column, String, Integer, Enum
from ..database import db
from .helper import ID
from ..enums import ShiftImportance


SHIFT_PENALTY_WEIGHT_DICT = {
    ShiftImportance.MAJOR: 10,
    ShiftImportance.AVERAGE: 5,
    ShiftImportance.MINOR: 2,
}


class Shift(db.Model):

    id = ID()
    title = Column(String(16), unique=True)
    duration = Column(Integer)
    skills = db.relationship("EmployeeSkill", cascade="all, delete, delete-orphan")

    cover_monday = Column(Integer, default=0)
    cover_tuesday = Column(Integer, default=0)
    cover_wednesay = Column(Integer, default=0)
    cover_thursday = Column(Integer, default=0)
    cover_friday = Column(Integer, default=0)
    cover_saturday = Column(Integer, default=0)
    cover_sunday = Column(Integer, default=0)

    shift_importance = Column(Enum(ShiftImportance), nullable=False)

    def get_cover_penalty(self):
        return SHIFT_PENALTY_WEIGHT_DICT.get(self.shift_importance)

    def get_cover_constraints(self):
        return (
            self.cover_monday,
            self.cover_tuesday,
            self.cover_wednesay,
            self.cover_thursday,
            self.cover_friday,
            self.cover_saturday,
            self.cover_sunday,
        )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "duration": self.duration,
            "shiftImportance": self.shift_importance,
            "coverMonday": self.cover_monday,
            "coverTuesday": self.cover_tuesday,
            "coverWednesday": self.cover_wednesay,
            "coverThursday": self.cover_thursday,
            "coverFriday": self.cover_friday,
            "coverSaturday": self.cover_saturday,
            "coverSunday": self.cover_sunday,
        }

    def __repr__(self):
        return "<Shift: {}>".format(self.title)
