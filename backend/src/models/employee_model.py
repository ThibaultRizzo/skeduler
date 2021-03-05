from sqlalchemy import Table, Column, String, ForeignKey, Integer, Date, Enum, Boolean
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import timedelta
from src.database import db, PkModel, PkCompanyModel, reference_col
from src.enums import (
    EventNature,
    EventStatus,
    EventType,
    ShiftSkillLevel,
    EmployeeAvailability,
)
from .dto import Period
from sqlalchemy import or_, and_


class Employee(PkCompanyModel):
    name = Column(String(64), unique=True)
    contract = Column(Integer)

    availability_monday = Column(Enum(EmployeeAvailability), default="NOT_WORKING")
    availability_tuesday = Column(Enum(EmployeeAvailability), default="NOT_WORKING")
    availability_wednesday = Column(Enum(EmployeeAvailability), default="NOT_WORKING")
    availability_thursday = Column(
        Enum(EmployeeAvailability), default=EmployeeAvailability.NOT_WORKING
    )
    availability_friday = Column(
        Enum(EmployeeAvailability), default=EmployeeAvailability.NOT_WORKING
    )
    availability_saturday = Column(
        Enum(EmployeeAvailability), default=EmployeeAvailability.NOT_WORKING
    )
    availability_sunday = Column(
        Enum(EmployeeAvailability), default=EmployeeAvailability.NOT_WORKING
    )

    skills = db.relationship("EmployeeSkill", cascade="all, delete, delete-orphan")
    events = db.relationship(
        "EmployeeEvent", backref="employee", cascade="all, delete, delete-orphan"
    )

    def is_extra(self):
        return self.contract == 0

    def get_availability(self):
        return [
            self.availability_monday,
            self.availability_tuesday,
            self.availability_wednesday,
            self.availability_thursday,
            self.availability_friday,
            self.availability_saturday,
            self.availability_sunday,
        ]

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
            if e.belongs_to(period) and e.status is EventStatus.CONFIRMED
        ]

    def __repr__(self):
        return "<Employee: {}>".format(self.name)

    def updateSkills(self, _skills):
        saved_shift_ids = [s.shift_id for s in self.skills]
        for skill in self.skills:
            updated_skill = next(
                (s for s in _skills if s["shift_id"] == skill.shift_id), None
            )
            if updated_skill is None:
                # Skill was removed in the update
                skill.employee = None
            elif skill.level != updated_skill["level"]:
                # Skill was updated in the update
                skill.level = updated_skill["level"]

        new_skills = [
            s for s in _skills if s["shift_id"] not in saved_shift_ids
        ]  # filter(lambda s: , skills)

        for skill in new_skills:
            self.skills.append(
                EmployeeSkill(shift_id=skill["shift_id"], level=skill["level"])
            )


class EmployeeSkill(PkModel):
    employee_id = reference_col(
        "employee", nullable=False, foreign_key_kwargs={"ondelete": "CASCADE"}
    )
    employee = db.relationship("Employee", back_populates="skills")
    shift_id = reference_col(
        "shift", nullable=False, foreign_key_kwargs={"ondelete": "CASCADE"}
    )
    shift = db.relationship("Shift", back_populates="skills")
    level = Column(Enum(ShiftSkillLevel))

    def __repr__(self):
        return "<EmployeeSkill: {}, {}, {}, {}>".format(
            self.id, self.shift_id, self.employee_id, self.level
        )

    # def to_dict(self):
    #     return {
    #         "level": self.level.name,
    #         "shiftId": self.shift_id,
    #         "employeeId": self.employee_id,
    #     }


class EmployeeEvent(PkModel):
    employee_id = reference_col("employee", nullable=False)
    shift_id = reference_col("shift", nullable=True)

    start_date = Column(Date, nullable=False)
    duration = Column(Integer, nullable=False)

    type = Column(Enum(EventType), nullable=False)
    status = Column(Enum(EventStatus), nullable=False)
    nature = Column(Enum(EventNature), nullable=False)
    is_desired = Column(Boolean, nullable=False)

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
            return -(self.nature.get_weight())
        else:
            return self.nature.get_weight()

    def __repr__(self):
        return "<EmployeeEvent: {} {} for {} day(s)>".format(
            self.type, self.start_date, self.duration
        )

    def get_all_by_employee(employee_id):
        return [
            event.to_dict()
            for event in EmployeeEvent.query.filter_by(employee_id=employee_id).all()
        ]

    def get_all_by_employee_in_interval(employee_id, start_date, end_date):
        events = EmployeeEvent.query.filter(
            and_(
                EmployeeEvent.employee_id == employee_id,
                or_(
                    and_(
                        EmployeeEvent.start_date >= start_date,
                        EmployeeEvent.start_date <= end_date,
                    ),
                    and_(
                        EmployeeEvent.start_date <= start_date,
                        EmployeeEvent.end_date >= start_date,
                    ),
                ),
            )
        ).all()
        return [event.to_dict() for event in events]
