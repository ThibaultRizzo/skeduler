from src.enums import ShiftImportance, EventNature

SHIFT_PENALTY_WEIGHT_DICT = {
    ShiftImportance.MAJOR: 30,
    ShiftImportance.AVERAGE: 20,
    ShiftImportance.MINOR: 10,
}

SCHEDULE_WEIGHT_DICT = {
    "VERY_IMPORTANT": 30,
    "IMPORTANT": 20,
    "MUST": 10,
    "SHOULD": 5,
}

EVENT_WEIGHT_DICT = {
    EventNature.MANDATORY: 0,
    EventNature.IMPORTANT: 2,
    EventNature.WANTED: 4,
    EventNature.PREFERED: 10,
}


COMPANY_TRANSITION_RULE_PENALTY_DICT = {}
