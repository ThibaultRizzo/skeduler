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


class EmployeeAvailability(GraphEnum):
    WORKING = "WORKING"
    AVAILABLE = "AVAILABLE"
    NOT_WORKING = "NOT_WORKING"

    def get_availability_penalty():
        return Penalty.LOW.value


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
        if self is EventNature.MANDATORY:
            return Penalty.CRITICAL.value
        elif self is EventNature.IMPORTANT:
            return Penalty.HIGH.value
        elif self is EventNature.WANTED:
            return Penalty.MEDIUM.value
        elif self is EventNature.PREFERED:
            return Penalty.LOW.value


class EventStatus(GraphEnum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DECLINED = "DECLINED"


class ShiftImportance(GraphEnum):
    MAJOR = "MAJOR"
    AVERAGE = "AVERAGE"
    MINOR = "MINOR"

    def to_weight(self):
        if self is ShiftImportance.MAJOR:
            return Penalty.CRITICAL.value
        elif self is ShiftImportance.AVERAGE:
            return Penalty.HIGH.value
        elif self is ShiftImportance.MINOR:
            return Penalty.MEDIUM.value


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

    def to_weight(self):
        if self is RulePenalty.HARD:
            return Penalty.HIGH.value
        elif self is RulePenalty.MEDIUM:
            return Penalty.MEDIUM.value
        elif self is RulePenalty.SOFT:
            return Penalty.LOW.value


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
    EmployeeAvailability,
]


class Penalty(enum.Enum):
    CRITICAL = 1000
    HIGH = 100
    MEDIUM = 10
    LOW = 1
