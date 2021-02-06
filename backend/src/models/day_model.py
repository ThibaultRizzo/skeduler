from sqlalchemy import Column, String, Integer, Boolean, Enum
from ..database import db
from .helper import ID
from ..enums import DayEnum


class Day(db.Model):
    id = ID()
    name = Column(Enum(DayEnum), unique=True)
    active = Column(Boolean)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "active": self.active,
        }

    def __repr__(self):
        return "<Day: {}>".format(self.id, self.name)
