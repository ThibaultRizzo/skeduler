from sqlalchemy import Column, String, Integer
from main import db
from .helper import ID


class Shift(db.Model):

    id = ID()
    title = Column(String(16), unique=True)
    duration = Column(Integer)
    skills = db.relationship("EmployeeSkill", cascade="all, delete, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "title": self.title, "duration": self.duration}

    def __repr__(self):
        return "<Shift: {}>".format(self.title)
