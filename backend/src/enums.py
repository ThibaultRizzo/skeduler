import enum
from ortools.sat.python import cp_model
from ariadne import EnumType


class GraphEnum(str, enum.Enum):
    __abstract__ = True

    @classmethod
    def to_graph(cls):
        return EnumType(cls.__name__, cls)


class DayEnum(GraphEnum):
    MONDAY = "MONDAY"
    TUESDAY = "TUESDAY"
    WEDNESDAY = "WEDNESDAY"
    THURSDAY = "THURSDAY"
    FRIDAY = "FRIDAY"
    SATURDAY = "SATURDAY"
    SUNDAY = "SUNDAY"

    def get_order(self):
        return [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
        ].index(self) + 1

    def get_by_order(order):
        return next((d for d in DayEnum if d.get_order() is order), None)

    def get_by_datetime(date):
        return DayEnum.get_by_order(date.isoweekday())


class ShiftSkillLevel(GraphEnum):
    NO_SKILL = "NO_SKILL"
    LEARNING = "LEARNING"
    MASTER = "MASTER"

    def get_value(self):
        return ["NO_SKILL", "LEARNING", "MASTER"].index(self)


class EventType(GraphEnum):
    PAID_LEAVE = "PAID_LEAVE"
    UNPAID_LEAVE = "UNPAID_LEAVE"
    HOLIDAY = "HOLIDAY"
    ILLNESS = "ILLNESS"
    REQUEST = "REQUEST"


class EventNature(GraphEnum):
    MANDATORY = "MANDATORY"
    IMPORTANT = "IMPORTANT"
    WANTED = "WANTED"
    PREFERED = "PREFERED"

    def get_weight(self):
        return {
            EventNature.MANDATORY: 0,
            EventNature.IMPORTANT: 2,
            EventNature.WANTED: 4,
            EventNature.PREFERED: 10,
        }[self]


class EventStatus(GraphEnum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DECLINED = "DECLINED"


class ShiftImportance(GraphEnum):
    MAJOR = "MAJOR"
    AVERAGE = "AVERAGE"
    MINOR = "MINOR"

    def to_weight(self):
        _dict = {
            ShiftImportance.MAJOR: 30,
            ShiftImportance.AVERAGE: 20,
            ShiftImportance.MINOR: 10,
        }
        return _dict[self]


class SolverStatus(GraphEnum):
    UNKNOWN = cp_model.UNKNOWN
    MODEL_INVALID = cp_model.MODEL_INVALID
    FEASIBLE = cp_model.FEASIBLE
    INFEASIBLE = cp_model.INFEASIBLE
    OPTIMAL = cp_model.OPTIMAL

    def by_status_code(code):
        return next((s for s in SolverStatus if int(s.value) == code), None)


class SequenceRuleType(GraphEnum):
    SHIFT_SEQUENCE = "SHIFT_SEQUENCE"
    SHIFT_SUM_SEQUENCE = "SHIFT_SUM_SEQUENCE"


class RulePenalty(GraphEnum):
    HARD = "HARD"
    MEDIUM = "MEDIUM"
    SOFT = "SOFT"

    def weight_dict():
        return {
            RulePenalty.SOFT: 5,
            RulePenalty.MEDIUM: 10,
            RulePenalty.HARD: 20,
        }

    def to_weight(self):
        return RulePenalty.weight_dict()[self]


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


SCHEDULE_WEIGHT_DICT = {
    "VERY_IMPORTANT": 30,
    "IMPORTANT": 20,
    "MUST": 10,
    "SHOULD": 5,
}
