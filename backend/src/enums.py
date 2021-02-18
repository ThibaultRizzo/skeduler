import enum
from ortools.sat.python import cp_model
from ariadne import EnumType


class GraphEnum(enum.Enum):
    __abstract__ = True

    @classmethod
    def to_graph(cls):
        return EnumType(cls.__name__, cls)


class DayEnum(GraphEnum):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7

    def get_by_order(order):
        return next((d for d in DayEnum if d.value is order), None)

    def get_by_datetime(date):
        return DayEnum.get_by_order(date.isoweekday())


class ShiftSkillLevel(GraphEnum):
    NO_SKILL = 0
    LEARNING = 1
    MASTER = 2


class EventType(str, GraphEnum):
    PAID_LEAVE = "PAID_LEAVE"
    UNPAID_LEAVE = "UNPAID_LEAVE"
    HOLIDAY = "HOLIDAY"
    ILLNESS = "ILLNESS"
    REQUEST = "REQUEST"


class EventNature(str, GraphEnum):
    MANDATORY = "MANDATORY"
    IMPORTANT = "IMPORTANT"
    WANTED = "WANTED"
    PREFERED = "PREFERED"


class EventStatus(str, GraphEnum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DECLINED = "DECLINED"


class ShiftImportance(GraphEnum):
    MAJOR = "MAJOR"
    AVERAGE = "AVERAGE"
    MINOR = "MINOR"


class SolverStatus(GraphEnum):
    UNKNOWN = cp_model.UNKNOWN
    MODEL_INVALID = cp_model.MODEL_INVALID
    FEASIBLE = cp_model.FEASIBLE
    INFEASIBLE = cp_model.INFEASIBLE
    OPTIMAL = cp_model.OPTIMAL


class SequenceRuleType(GraphEnum):
    SHIFT_SEQUENCE = "SHIFT_SEQUENCE"
    SHIFT_SUM_SEQUENCE = "SHIFT_SUM_SEQUENCE"


class RulePenalty(GraphEnum):
    HARD = "HARD"
    MEDIUM = "MEDIUM"
    SOFT = "SOFT"


all_enums = [
    DayEnum,
    ShiftSkillLevel,
    ShiftImportance,
    RulePenalty,
    SequenceRuleType,
    # SolverStatus,
    EventNature,
    EventStatus,
    EventType,
]
