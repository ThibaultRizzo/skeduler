import enum
from ortools.sat.python import cp_model
from ariadne import EnumType


class GraphEnum(enum.Enum):
    __abstract__ = True

    @classmethod
    def to_graph(cls):
        return EnumType(cls.__name__, cls)


class DayEnum(str, GraphEnum):
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

    # def to_graph():
    #     return EnumType(
    #         "DayEnum",
    #         {
    #             "MONDAY": "MONDAY",
    #             "TUESDAY": "TUESDAY",
    #             "WEDNESDAY": "WEDNESDAY",
    #             "THURSDAY": "THURSDAY",
    #             "FRIDAY": "FRIDAY",
    #             "SATURDAY": "SATURDAY",
    #             "SUNDAY": "SUNDAY",
    #         },
    #     )


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


class ShiftImportance(str, GraphEnum):
    MAJOR = "MAJOR"
    AVERAGE = "AVERAGE"
    MINOR = "MINOR"


class SolverStatus(GraphEnum):
    UNKNOWN = cp_model.UNKNOWN
    MODEL_INVALID = cp_model.MODEL_INVALID
    FEASIBLE = cp_model.FEASIBLE
    INFEASIBLE = cp_model.INFEASIBLE
    OPTIMAL = cp_model.OPTIMAL


class SequenceRuleType(str, GraphEnum):
    SHIFT_SEQUENCE = "SHIFT_SEQUENCE"
    SHIFT_SUM_SEQUENCE = "SHIFT_SUM_SEQUENCE"


class RulePenalty(str, GraphEnum):
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
