import enum
from ortools.sat.python import cp_model


class DayEnum(enum.Enum):
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


class ShiftSkillLevel(enum.Enum):
    NO_SKILL = 0
    LEARNING = 1
    MASTER = 2


class EventType(enum.Enum):
    PAID_LEAVE = "PAID_LEAVE"
    UNPAID_LEAVE = "UNPAID_LEAVE"
    HOLIDAY = "HOLIDAY"
    ILLNESS = "ILLNESS"
    REQUEST = "REQUEST"


class EventNature(enum.Enum):
    MANDATORY = "MANDATORY"
    IMPORTANT = "IMPORTANT"
    WANTED = "WANTED"
    PREFERED = "PREFERED"


class EventStatus(enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DECLINED = "DECLINED"


class ShiftImportance(enum.Enum):
    MAJOR = "MAJOR"
    AVERAGE = "AVERAGE"
    MINOR = "MINOR"


class SolverStatus(enum.Enum):
    UNKNOWN = cp_model.UNKNOWN
    MODEL_INVALID = cp_model.MODEL_INVALID
    FEASIBLE = cp_model.FEASIBLE
    INFEASIBLE = cp_model.INFEASIBLE
    OPTIMAL = cp_model.OPTIMAL


class RuleType(enum.Enum):
    SHIFT = "SHIFT"
