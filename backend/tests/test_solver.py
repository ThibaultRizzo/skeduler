import pytest
from src.solver.solver import solve_shift_scheduling
from src.models import Employee, EmployeeSkill, EmployeeEvent, Day, Shift, SolverPeriod
from src.enums import (
    ShiftImportance,
    DayEnum,
    EventType,
    EventNature,
    EventStatus,
    SolverStatus,
)
from datetime import datetime, timezone
import logging

_logger = logging.getLogger()

day_dict = {
    "monday": Day(id="D1", name=DayEnum.MONDAY, active=True),
    "tuesday": Day(id="D2", name=DayEnum.TUESDAY, active=True),
    "wednesday": Day(id="D3", name=DayEnum.WEDNESDAY, active=True),
    "thursday": Day(id="D4", name=DayEnum.THURSDAY, active=True),
    "friday": Day(id="D5", name=DayEnum.FRIDAY, active=True),
    "saturday": Day(id="D6", name=DayEnum.SATURDAY, active=False),
    "sunday": Day(id="D7", name=DayEnum.SUNDAY, active=False),
}
employee_skill_dict = {
    "es_1": EmployeeSkill(id="ES1", employee_id="E1", shift_id="S1", level="MASTER"),
    "es_2": EmployeeSkill(id="ES2", employee_id="E2", shift_id="S1", level="MASTER"),
    "es_3": EmployeeSkill(id="ES3", employee_id="E2", shift_id="S2", level="MASTER"),
}
employee_events_dict = {
    "ee_1": EmployeeEvent(
        id="EE1",
        employee_id="E1",
        shift_id=None,
        start_date=datetime(2021, 1, 24, tzinfo=timezone.utc),
        duration=1,
        type=EventType.HOLIDAY,
        status=EventStatus.CONFIRMED,
        nature=EventNature.MANDATORY,
        is_desired=True,
    ),
    "ee_2": EmployeeEvent(
        id="EE2",
        employee_id="E1",
        shift_id="S2",
        start_date=datetime(2021, 1, 25, tzinfo=timezone.utc),
        duration=1,
        type=EventType.REQUEST,
        status=EventStatus.CONFIRMED,
        nature=EventNature.WANTED,
        is_desired=True,
    ),
    "ee_3": EmployeeEvent(
        id="EE3",
        employee_id="E2",
        shift_id="S1",
        start_date=datetime(2021, 1, 24, tzinfo=timezone.utc),
        duration=20,
        type=EventType.REQUEST,
        status=EventStatus.CONFIRMED,
        nature=EventNature.PREFERED,
        is_desired=True,
    ),
}

employee_dict = {
    "Thibault": Employee(
        name="Thibault",
        contract=40,
        working_days=[
            day_dict.get("monday"),
            day_dict.get("tuesday"),
            day_dict.get("wednesday"),
            day_dict.get("thursday"),
        ],
        skills=[employee_skill_dict.get("es_1")],
        events=[employee_events_dict.get("ee_1"), employee_events_dict.get("ee_2")],
    ),
    "Shanel": Employee(
        name="Shanel",
        contract=40,
        working_days=[
            day_dict.get("monday"),
            day_dict.get("tuesday"),
            day_dict.get("wednesday"),
            day_dict.get("thursday"),
        ],
        skills=[employee_skill_dict.get("es_2"), employee_skill_dict.get("es_3")],
        events=[employee_events_dict.get("ee_3")],
    ),
}
shift_dict = {
    "waiter_1": Shift(
        id="S1",
        title="Waiter 1",
        duration=8,
        cover_monday=1,
        cover_tuesday=1,
        cover_wednesday=1,
        cover_thursday=1,
        cover_friday=1,
        cover_saturday=0,
        cover_sunday=0,
        shift_importance=ShiftImportance.MAJOR,
    ),
    "barman_1": Shift(
        id="S2",
        title="Barman 1",
        duration=8,
        cover_monday=1,
        cover_tuesday=1,
        cover_wednesday=1,
        cover_thursday=1,
        cover_friday=1,
        cover_saturday=0,
        cover_sunday=0,
        shift_importance=ShiftImportance.MAJOR,
    ),
}


@pytest.fixture
def employees():
    return [employee_dict.get("Thibault"), employee_dict.get("Shanel")]


@pytest.fixture
def shifts():
    return [shift_dict.get("waiter_1"), shift_dict.get("barman_1")]


@pytest.fixture
def days():
    return [day for day in day_dict.values()]


def test_schedule_optimal(employees, shifts, days):
    """Start with a blank database."""
    start_date = datetime(2021, 1, 4, tzinfo=timezone.utc)
    period = SolverPeriod(start_date, 2, days)
    schedule = solve_shift_scheduling(
        employees,
        shifts,
        period,
    )
    _logger.info(schedule)
    assert schedule.status == SolverStatus.OPTIMAL.value, "Schedule is optimal"
