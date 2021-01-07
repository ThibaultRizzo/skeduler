from main import db
from sqlalchemy import Table, Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid


def ID():
    return Column("id", String(36), default=lambda: str(uuid.uuid4()), primary_key=True)


employee_day_table = Table(
    "employee_day",
    db.Model.metadata,
    Column("employee_id", String(36), ForeignKey("employee.id", ondelete="CASCADE")),
    Column("day_id", String(36), ForeignKey("day.id", ondelete="CASCADE")),
)


class Employee(db.Model):
    id = ID()
    name = Column(String(64), unique=True)
    contract = Column(Integer)

    working_days = db.relationship(
        "Day", secondary=employee_day_table, cascade="all, delete", passive_deletes=True
    )

    skills = db.relationship("EmployeeSkill", cascade="all, delete, delete-orphan")

    # Shifts placement fully mastered by employee
    # Shifts placement not yet mastered by employee
    # training_shifts = db.relationship("Shift")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "contract": self.contract,
            "workingDays": self.working_days,
            "skills": self.skills,
        }

    def __repr__(self):
        return "<Employee: {}>".format(self.name)


class EmployeeSkill(db.Model):

    id = ID()
    employee_id = Column(
        String(36), ForeignKey("employee.id", ondelete="CASCADE"), nullable=False
    )
    employee = db.relationship("Employee", back_populates="skills")
    shift_id = Column(
        String(36), ForeignKey("shift.id", ondelete="CASCADE"), nullable=False
    )
    shift = db.relationship("Shift", back_populates="skills")
    level = Column(String(16))

    def __repr__(self):
        return "<EmployeeSkill: {}, {}, {}, {}>".format(
            self.id, self.shift_id, self.employee_id, self.level
        )


class Shift(db.Model):

    id = ID()
    title = Column(String(16), unique=True)
    duration = Column(Integer)
    # employee_id = Column(String(36), ForeignKey("employee.id"))
    skills = db.relationship("EmployeeSkill", cascade="all, delete, delete-orphan")

    # child = relationship("Child", uselist=False, back_populates="parent")

    def to_dict(self):
        return {"id": self.id, "title": self.title, "duration": self.duration}

    def __repr__(self):
        return "<Shift: {}>".format(self.title)


class Day(db.Model):
    id = ID()
    name = Column(String(16), unique=True)
    order = Column(Integer, unique=True)
    active = Column(Boolean)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "active": self.active,
            "order": self.order,
        }

    def __repr__(self):
        return "<Day: {}>".format(self.id, self.name)
