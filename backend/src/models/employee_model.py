from sqlalchemy import Table, Column, String, ForeignKey, Integer, Date, Enum, Boolean
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import timedelta
from ..database import db
from .helper import ID
from .dto import Period
from ..enums import EventNature, EventStatus, EventType

EVENT_WEIGHT_DICT = {
    EventNature.MANDATORY: 0,
    EventNature.IMPORTANT: 2,
    EventNature.WANTED: 4,
    EventNature.PREFERED: 10,
}


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
    events = db.relationship(
        "EmployeeEvent", backref="employee", cascade="all, delete, delete-orphan"
    )

    # Returns events VALIDATED, matching the period
    def get_mandatory_events(self, period):
        return [
            e
            for e in self.events
            if e.belongs_to(period)
            and e.nature is EventNature.MANDATORY
            and e.status is EventStatus.CONFIRMED
        ]

    def get_requests(self, period):
        return [
            e
            for e in self.events
            if e.belongs_to(period)
            and e.nature is not EventNature.MANDATORY
            and e.status is EventStatus.CONFIRMED
        ]

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "contract": self.contract,
            "workingDays": self.working_days,
            "skills": self.skills,
            "events": self.events,
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


class EmployeeEvent(db.Model):
    id = ID()
    employee_id = Column(
        String(36), ForeignKey("employee.id", ondelete="CASCADE"), nullable=False
    )

    shift_id = Column(String(36), ForeignKey("shift.id", ondelete="CASCADE"))

    start_date = Column(Date, nullable=False)
    duration = Column(Integer, nullable=False)

    type = Column(Enum(EventType), nullable=False)
    status = Column(Enum(EventStatus), nullable=False)
    nature = Column(Enum(EventNature), nullable=False)
    is_desired = Column(Boolean, nullable=False)

    # @hybrid_property
    # def is_desired(self):
    #     return self.type in [EventType.REQUEST]

    # @is_desired.expression
    # def is_desired(self):
    #     return self.type

    @hybrid_property
    def end_date(self):
        return self.start_date + timedelta(days=self.duration - 1)

    @end_date.expression
    def end_date(self):
        return self.start_date

    def get_event_dates(self):
        period = Period(self.start_date, self.duration)
        return period.get_date_list()

    def belongs_to(self, period) -> bool:
        event_period = Period(self.start_date, self.duration)
        return event_period.is_intersecting(period)

    def get_weight(self) -> int:
        if self.is_desired:
            return -EVENT_WEIGHT_DICT.get(self.nature)
        else:
            return EVENT_WEIGHT_DICT.get(self.nature)

    def to_dict(self):
        return {
            "id": self.id,
            "employee": self.employee_id,
            "shift": {"id": self.shift_id} if self.shift_id is not None else None,
            "duration": self.duration,
            "startDate": self.start_date,
            "endDate": self.end_date,
            "type": self.type.name,
            "nature": self.nature.name,
            "status": self.status.name,
            "isDesired": self.is_desired,
        }

    def __repr__(self):
        return "<EmployeeEvent: {} {} for {} day(s)>".format(
            self.type, self.start_date, self.duration
        )
