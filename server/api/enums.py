import enum


class Days(enum.Enum):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7


class ShiftSkillLevel(enum.Enum):
    NO_SKILL = 1
    LEARNING = 2
    MASTER = 3
