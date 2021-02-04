import enum


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


class ShiftSkillLevel(enum.Enum):
    NO_SKILL = 0
    LEARNING = 1
    MASTER = 2


class LeaveReason(enum.Enum):
    PAID_LEAVE = "PAID_LEAVE"
    UNPAID_LEAVE = "UNPAID_LEAVE"


class LeaveStatus(enum.Enum):
    PENDING_APPROVAL = "PENDING_APPROVAL"
    CONFIRMED = "CONFIRMED"
    DECLINED = "DECLINED"
