from sqlalchemy import Table, Column, String, ForeignKey, Integer, Date, Enum
from main import db
from .helper import ID
import datetime
from ..enums import LeaveReason, LeaveStatus

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
    leaves = db.relationship(
        "EmployeeLeave", backref="employee", cascade="all, delete, delete-orphan"
    )

    # Shifts placement fully mastered by employee
    # Shifts placement not yet mastered by employee
    # training_shifts = db.relationship("Shift")

    def get_fixed_assignments(self, start_date, end_date):
        return

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


class EmployeeLeave(db.Model):
    id = ID()
    employee_id = Column(
        String(36), ForeignKey("employee.id", ondelete="CASCADE"), nullable=False
    )
    start_day = Column(Date, nullable=False)
    end_day = Column(Date, nullable=False)

    reason = Column(Enum(LeaveReason), nullable=False)
    status = Column(Enum(LeaveStatus), nullable=False)

    def get_leave_days(self):
        return

    def to_tuple(self) -> tuple:
        return self.employee_id
