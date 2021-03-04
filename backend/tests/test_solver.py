import pytest
from src.solver.solver import solve_shift_scheduling
from src.solver.solver_model import ScheduleCpModelFactory
from src.models import (
    Employee,
    EmployeeSkill,
    EmployeeEvent,
    Day,
    Shift,
    SolverPeriod,
    CompanySequenceRule,
    CompanyTransitionRule,
)
from src.enums import (
    ShiftImportance,
    DayEnum,
    EventType,
    EventNature,
    EventStatus,
    SolverStatus,
    SequenceRuleType,
    RulePenalty,
    ShiftSkillLevel,
    EmployeeAvailability,
)
from datetime import datetime, timezone
import logging


# class TestCase(TestCase):
#     SQLALCHEMY_DATABASE_URI = "sqlite://"
#     TESTING = True
#     SQLALCHEMY_TRACK_MODIFICATIONS = False

#     def create_app(self):
#         # pass in test configuration
#         return create_app(self)

#     def setUp(self):
#         ctx = self.app.app_context()
#         ctx.push()
#         # db.create_all()

#     # def tearDown(self):

#     #     db.session.remove()
#     #     db.drop_all()

#     # def setUp(self):
#     #     ctx = app.app_context()
#     #     ctx.push()
#     #     # after this you can use current_app
#     #     print(current_app)

#     def test_example(app):
#         # available because we pushed context in setUp()
#         print(app)


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
    "es_1": EmployeeSkill(
        id="ES1", employee_id="E1", shift_id="S1", level=ShiftSkillLevel.MASTER
    ),
    "es_2": EmployeeSkill(
        id="ES2", employee_id="E2", shift_id="S1", level=ShiftSkillLevel.MASTER
    ),
    "es_3": EmployeeSkill(
        id="ES3", employee_id="E2", shift_id="S2", level=ShiftSkillLevel.MASTER
    ),
    "es_4": EmployeeSkill(
        id="ES4", employee_id="E1", shift_id="S2", level=ShiftSkillLevel.LEARNING
    ),
    "es_5": EmployeeSkill(
        id="ES5", employee_id="E3", shift_id="S3", level=ShiftSkillLevel.MASTER
    ),
    "es_6": EmployeeSkill(
        id="ES6", employee_id="E3", shift_id="S4", level=ShiftSkillLevel.MASTER
    ),
    "es_7": EmployeeSkill(
        id="ES5", employee_id="E4", shift_id="S3", level=ShiftSkillLevel.MASTER
    ),
    "es_8": EmployeeSkill(
        id="ES6", employee_id="E4", shift_id="S4", level=ShiftSkillLevel.MASTER
    ),
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
        availability_monday=EmployeeAvailability.WORKING,
        availability_tuesday=EmployeeAvailability.WORKING,
        availability_wednesday=EmployeeAvailability.WORKING,
        availability_thursday=EmployeeAvailability.WORKING,
        availability_friday=EmployeeAvailability.WORKING,
        availability_saturday=EmployeeAvailability.WORKING,
        availability_sunday=EmployeeAvailability.WORKING,
        skills=[employee_skill_dict.get("es_1"), employee_skill_dict.get("es_4")],
        events=[employee_events_dict.get("ee_1"), employee_events_dict.get("ee_2")],
    ),
    "Shanel": Employee(
        name="Shanel",
        contract=40,
        availability_monday=EmployeeAvailability.WORKING,
        availability_tuesday=EmployeeAvailability.WORKING,
        availability_wednesday=EmployeeAvailability.WORKING,
        availability_thursday=EmployeeAvailability.WORKING,
        availability_friday=EmployeeAvailability.WORKING,
        availability_saturday=EmployeeAvailability.WORKING,
        availability_sunday=EmployeeAvailability.WORKING,
        skills=[employee_skill_dict.get("es_2"), employee_skill_dict.get("es_3")],
        events=[employee_events_dict.get("ee_3")],
    ),
    "Segolene": Employee(
        name="Segolene",
        contract=50,
        availability_monday=EmployeeAvailability.WORKING,
        availability_tuesday=EmployeeAvailability.WORKING,
        availability_wednesday=EmployeeAvailability.WORKING,
        availability_thursday=EmployeeAvailability.WORKING,
        availability_friday=EmployeeAvailability.WORKING,
        availability_saturday=EmployeeAvailability.NOT_WORKING,
        availability_sunday=EmployeeAvailability.NOT_WORKING,
        skills=[employee_skill_dict.get("es_5"), employee_skill_dict.get("es_6")],
        events=[],
    ),
    "Stephane": Employee(
        name="Shanel",
        contract=40,
        availability_monday=EmployeeAvailability.WORKING,
        availability_tuesday=EmployeeAvailability.WORKING,
        availability_wednesday=EmployeeAvailability.WORKING,
        availability_thursday=EmployeeAvailability.WORKING,
        availability_friday=EmployeeAvailability.WORKING,
        availability_saturday=EmployeeAvailability.WORKING,
        availability_sunday=EmployeeAvailability.WORKING,
        skills=[employee_skill_dict.get("es_7"), employee_skill_dict.get("es_8")],
        events=[],
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
    "waiter_2": Shift(
        id="S3",
        title="Waiter 2",
        duration=10,
        cover_monday=1,
        cover_tuesday=1,
        cover_wednesday=1,
        cover_thursday=1,
        cover_friday=1,
        cover_saturday=0,
        cover_sunday=0,
        shift_importance=ShiftImportance.MAJOR,
    ),
    "barman_2": Shift(
        id="S4",
        title="Barman 2",
        duration=10,
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

seq_rules_dict = {
    "seq_1": CompanySequenceRule(
        id="SR1",
        rule_type=SequenceRuleType.SHIFT_SEQUENCE,
        shift_id="S1",
        hard_min=0,
        soft_min=0,
        penalty_min=RulePenalty.MEDIUM,
        hard_max=4,
        soft_max=4,
        penalty_max=RulePenalty.SOFT,
    ),
    "seq_sum_1": CompanySequenceRule(
        id="SR2",
        rule_type=SequenceRuleType.SHIFT_SUM_SEQUENCE,
        shift_id="S2",
        hard_min=0,
        soft_min=1,
        penalty_min=RulePenalty.MEDIUM,
        hard_max=4,
        soft_max=3,
        penalty_max=RulePenalty.SOFT,
    ),
}

trans_rules_dict = {
    "trans_1": CompanyTransitionRule(
        id="TR1", from_shift_id="S1", to_shift_id=None, penalty=RulePenalty.SOFT
    ),
}


@pytest.fixture
def empty_rules():
    return {
        "sequence": [],
        "transition": [],
    }


@pytest.fixture
def rules():
    return {
        "sequence": [
            # seq_rules_dict.get("seq_1"),
            seq_rules_dict.get("seq_sum_1"),
        ],
        "transition": [trans_rules_dict.get("trans_1")],
    }


@pytest.fixture
def employees():
    return [employee_dict.get("Thibault"), employee_dict.get("Shanel")]


@pytest.fixture
def standard_employees():
    return [employee_dict.get("Segolene"), employee_dict.get("Stephane")]


@pytest.fixture
def shifts():
    return [shift_dict.get("waiter_1"), shift_dict.get("barman_1")]


@pytest.fixture
def standard_shifts():
    return [shift_dict.get("waiter_2"), shift_dict.get("barman_2")]


@pytest.fixture
def days():
    return [day for day in day_dict.values()]


def test_only_work_during_active_days(empty_rules, days):
    employees = [
        Employee(
            name="Thibault",
            contract=50,
            availability_monday=EmployeeAvailability.WORKING,
            availability_tuesday=EmployeeAvailability.WORKING,
            availability_wednesday=EmployeeAvailability.WORKING,
            availability_thursday=EmployeeAvailability.WORKING,
            availability_friday=EmployeeAvailability.WORKING,
            availability_saturday=EmployeeAvailability.WORKING,
            availability_sunday=EmployeeAvailability.WORKING,
            skills=[],
            events=[],
        ),
        Employee(
            name="Shanel",
            contract=50,
            availability_monday=EmployeeAvailability.WORKING,
            availability_tuesday=EmployeeAvailability.WORKING,
            availability_wednesday=EmployeeAvailability.WORKING,
            availability_thursday=EmployeeAvailability.WORKING,
            availability_friday=EmployeeAvailability.WORKING,
            availability_saturday=EmployeeAvailability.WORKING,
            availability_sunday=EmployeeAvailability.WORKING,
            skills=[],
            events=[],
        ),
    ]

    shifts = [
        Shift(
            id="S1",
            title="Waiter 1",
            duration=10,
            cover_monday=1,
            cover_tuesday=1,
            cover_wednesday=1,
            cover_thursday=1,
            cover_friday=1,
            cover_saturday=0,
            cover_sunday=0,
            shift_importance=ShiftImportance.MAJOR,
        ),
        Shift(
            id="S2",
            title="Barman 1",
            duration=10,
            cover_monday=1,
            cover_tuesday=1,
            cover_wednesday=1,
            cover_thursday=1,
            cover_friday=1,
            cover_saturday=0,
            cover_sunday=0,
            shift_importance=ShiftImportance.MAJOR,
        ),
    ]
    start_date = datetime(2021, 1, 4, tzinfo=timezone.utc)
    period = SolverPeriod(start_date, 2, days)
    model_factory = ScheduleCpModelFactory(1, empty_rules, employees, shifts, period)
    schedule_solution = model_factory.solve_model()
    # schedule_solution.schedule.print(employees, shifts, days)
    bin_sch = schedule_solution.schedule.get_bin_schedule()
    assert all(
        bit == "1" for i, bit in enumerate(bin_sch) if i in [5, 6, 12, 13]
    ), "Weekends are rest"


def test_cannot_request_inactive_day(empty_rules, days):
    employees = [
        Employee(
            name="Thibault",
            contract=50,
            availability_monday=EmployeeAvailability.WORKING,
            availability_tuesday=EmployeeAvailability.WORKING,
            availability_wednesday=EmployeeAvailability.WORKING,
            availability_thursday=EmployeeAvailability.WORKING,
            availability_friday=EmployeeAvailability.WORKING,
            availability_saturday=EmployeeAvailability.WORKING,
            availability_sunday=EmployeeAvailability.WORKING,
            skills=[],
            events=[
                EmployeeEvent(
                    id="EE1",
                    employee_id="E1",
                    shift_id="S1",
                    start_date=datetime(2021, 1, 10, tzinfo=timezone.utc),
                    duration=1,
                    type=EventType.REQUEST,
                    status=EventStatus.CONFIRMED,
                    nature=EventNature.MANDATORY,
                    is_desired=True,
                )
            ],
        )
    ]

    shifts = [
        Shift(
            id="S1",
            title="Waiter 1",
            duration=10,
            cover_monday=1,
            cover_tuesday=1,
            cover_wednesday=1,
            cover_thursday=1,
            cover_friday=1,
            cover_saturday=0,
            cover_sunday=0,
            shift_importance=ShiftImportance.MAJOR,
        )
    ]
    start_date = datetime(2021, 1, 4, tzinfo=timezone.utc)
    period = SolverPeriod(start_date, 2, days)
    model_factory = ScheduleCpModelFactory(1, empty_rules, employees, shifts, period)
    schedule_solution = model_factory.solve_model()
    # schedule_solution.schedule.print(employees, shifts, days)
    bin_sch = schedule_solution.schedule.get_bin_schedule()
    assert all(
        bit == "1" for i, bit in enumerate(bin_sch) if i in [5, 6, 12, 13]
    ), "Weekends are rest"


def test_can_add_holiday(standard_employees, standard_shifts, empty_rules, days):
    standard_employees[0].events = [
        EmployeeEvent(
            id="EE1",
            employee_id="E3",
            shift_id=None,
            start_date=datetime(2021, 1, 6, tzinfo=timezone.utc),
            duration=1,
            type=EventType.HOLIDAY,
            status=EventStatus.CONFIRMED,
            nature=EventNature.MANDATORY,
            is_desired=True,
        ),
        EmployeeEvent(
            id="EE2",
            employee_id="E3",
            shift_id=None,
            start_date=datetime(2021, 1, 11, tzinfo=timezone.utc),
            duration=1,
            type=EventType.HOLIDAY,
            status=EventStatus.CONFIRMED,
            nature=EventNature.MANDATORY,
            is_desired=True,
        ),
    ]
    standard_employees[0].contract = 40

    start_date = datetime(2021, 1, 4, tzinfo=timezone.utc)
    period = SolverPeriod(start_date, 2, days)
    model_factory = ScheduleCpModelFactory(
        1, empty_rules, standard_employees, standard_shifts, period
    )
    schedule_solution = model_factory.solve_model()
    schedule_solution.schedule.print(employees, shifts, days)
    bin_sch = schedule_solution.schedule.get_bin_schedule()
    assert all(
        bit == "1" for i, bit in enumerate(bin_sch) if i in [2, 7]
    ), "Weekends are rest"


# def test_can_add_mandatory_request
# def test_can_generate_with_conflictuous_mandatory_request
# def test_respect_employee_total_contract # Test for different durations
# def test_respect_employee_minimum_total_contract
# def test_favor_employee_mastery
# def test_avoid_employee_with_no_mastery


# def test_schedule_optimal(rules, employees, shifts, days):
#     """Start with a blank database."""
#     start_date = datetime(2021, 1, 4, tzinfo=timezone.utc)
#     period = SolverPeriod(start_date, 2, days)
#     # schedule = solve_shift_scheduling(
#     #     rules,
#     #     employees,
#     #     shifts,
#     #     period,
#     # )
#     model_factory = ScheduleCpModelFactory(1, rules, employees, shifts, period)
#     schedule_solution = model_factory.solve_model()
#     schedule_solution.schedule.print(employees, shifts, days)
#     # _logger.info(schedule.status)
#     assert schedule.status == SolverStatus.OPTIMAL.value, "Schedule is optimal"


# class SolverTest(TestCase):
# def test_one_shift_per_day_constraint(days):
#     start_date = datetime(2021, 1, 4, tzinfo=timezone.utc)
#     period = SolverPeriod(start_date, 2, days)

#     shifts = [
#         Shift(
#             id="S1",
#             title="Waiter 1",
#             duration=20,
#             cover_monday=1,
#             cover_tuesday=1,
#             cover_wednesday=1,
#             cover_thursday=1,
#             cover_friday=1,
#             cover_saturday=0,
#             cover_sunday=0,
#             shift_importance=ShiftImportance.MAJOR,
#         ),
#         Shift(
#             id="S2",
#             title="Waiter 2",
#             duration=10,
#             cover_monday=1,
#             cover_tuesday=1,
#             cover_wednesday=1,
#             cover_thursday=1,
#             cover_friday=1,
#             cover_saturday=0,
#             cover_sunday=0,
#             shift_importance=ShiftImportance.MAJOR,
#         ),
#         Shift(
#             id="S3",
#             title="Waiter 3",
#             duration=10,
#             cover_monday=1,
#             cover_tuesday=1,
#             cover_wednesday=1,
#             cover_thursday=1,
#             cover_friday=1,
#             cover_saturday=0,
#             cover_sunday=0,
#             shift_importance=ShiftImportance.MAJOR,
#         ),
#     ]
#     employees = [
#         Employee(
#             name="Thibault",
#             contract=50,
#             availability_monday=EmployeeAvailability.WORKING,
#             availability_tuesday=EmployeeAvailability.WORKING,
#             availability_wednesday=EmployeeAvailability.WORKING,
#             availability_thursday=EmployeeAvailability.WORKING,
#             availability_friday=EmployeeAvailability.WORKING,
#             availability_saturday=EmployeeAvailability.WORKING,
#             availability_sunday=EmployeeAvailability.WORKING,
#             skills=[],
#             events=[],
#         ),
#         Employee(
#             name="Shanel",
#             contract=50,
#             availability_monday=EmployeeAvailability.WORKING,
#             availability_tuesday=EmployeeAvailability.WORKING,
#             availability_wednesday=EmployeeAvailability.WORKING,
#             availability_thursday=EmployeeAvailability.WORKING,
#             availability_friday=EmployeeAvailability.WORKING,
#             availability_saturday=EmployeeAvailability.WORKING,
#             availability_sunday=EmployeeAvailability.WORKING,
#             skills=[],
#             events=[],
#         ),
#         Employee(
#             name="Hubert",
#             contract=50,
#             availability_monday=EmployeeAvailability.WORKING,
#             availability_tuesday=EmployeeAvailability.WORKING,
#             availability_wednesday=EmployeeAvailability.WORKING,
#             availability_thursday=EmployeeAvailability.WORKING,
#             availability_friday=EmployeeAvailability.WORKING,
#             availability_saturday=EmployeeAvailability.WORKING,
#             availability_sunday=EmployeeAvailability.WORKING,
#             skills=[],
#             events=[],
#         ),
#     ]
#     schedule = solve_shift_scheduling(
#         {
#             "sequence": [],
#             "transition": [],
#         },
#         employees,
#         shifts,
#         period,
#         1,
#     )
#     # if schedule:
#     #     schedule.print(employees, shifts, days)
#     assert (
#         schedule and schedule.status == SolverStatus.OPTIMAL.value
#     ), "Schedule is optimal"


# def test_one_extra_employee(days):
#     start_date = datetime(2021, 1, 4, tzinfo=timezone.utc)
#     period = SolverPeriod(start_date, 2, days)
#     shifts = [
#         Shift(
#             id="S1",
#             title="q",
#             duration=10,
#             cover_monday=1,
#             cover_tuesday=1,
#             cover_wednesday=1,
#             cover_thursday=1,
#             cover_friday=1,
#             cover_saturday=0,
#             cover_sunday=0,
#             shift_importance=ShiftImportance.AVERAGE,
#         ),
#         Shift(
#             id="S2",
#             title="e",
#             duration=10,
#             cover_monday=1,
#             cover_tuesday=1,
#             cover_wednesday=1,
#             cover_thursday=1,
#             cover_friday=1,
#             cover_saturday=0,
#             cover_sunday=0,
#             shift_importance=ShiftImportance.MAJOR,
#         ),
#     ]
#     employees = [
#         Employee(
#             name="Thibault",
#             contract=50,
#             availability_monday=EmployeeAvailability.WORKING,
#             availability_tuesday=EmployeeAvailability.WORKING,
#             availability_wednesday=EmployeeAvailability.WORKING,
#             availability_thursday=EmployeeAvailability.AVAILABLE,
#             availability_friday=EmployeeAvailability.AVAILABLE,
#             availability_saturday=EmployeeAvailability.NOT_WORKING,
#             availability_sunday=EmployeeAvailability.NOT_WORKING,
#             skills=[],
#             events=[],
#         ),
#         Employee(
#             name="Shanel",
#             contract=30,
#             availability_monday=EmployeeAvailability.WORKING,
#             availability_tuesday=EmployeeAvailability.WORKING,
#             availability_wednesday=EmployeeAvailability.WORKING,
#             availability_thursday=EmployeeAvailability.WORKING,
#             availability_friday=EmployeeAvailability.AVAILABLE,
#             availability_saturday=EmployeeAvailability.NOT_WORKING,
#             availability_sunday=EmployeeAvailability.NOT_WORKING,
#             skills=[],
#             events=[],
#         ),
#         Employee(
#             name="Hubert",
#             contract=0,
#             availability_monday=EmployeeAvailability.WORKING,
#             availability_tuesday=EmployeeAvailability.WORKING,
#             availability_wednesday=EmployeeAvailability.WORKING,
#             availability_thursday=EmployeeAvailability.WORKING,
#             availability_friday=EmployeeAvailability.WORKING,
#             availability_saturday=EmployeeAvailability.WORKING,
#             availability_sunday=EmployeeAvailability.WORKING,
#             skills=[],
#             events=[],
#         ),
#     ]
#     schedule = solve_shift_scheduling(
#         {
#             "sequence": [],
#             "transition": [],
#         },
#         employees,
#         shifts,
#         period,
#         1,
#     )
#     if schedule:
#         schedule.print(employees, shifts, days)
#     assert (
#         schedule and schedule.status == SolverStatus.OPTIMAL.value
#     ), "Schedule is optimal"
