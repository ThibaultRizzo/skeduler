from datetime import datetime, timedelta
from ..enums import DayEnum


class Period:
    def __init__(self, start_date, nb_days):
        if type(start_date) is not datetime:
            raise TypeError("start_date should be a valid datetime")
        elif nb_days <= 0:
            raise TypeError("nb_days should be a positive integer")
        self.start_date = start_date
        self.nb_days = nb_days
        self.end_date = start_date + timedelta(days=nb_days)

    def get_day_enum_list(self):
        return [
            (self.start_date + timedelta(days=x)).isoweekday()
            for x in range(0, self.nb_days)
        ]


class SolverPeriod(Period):
    def __init__(self, start_date, nb_weeks, days_dict):
        super().__init__(start_date, nb_weeks * 7)
        if nb_weeks <= 0:
            raise TypeError("Number of weeks should be a positive integer")
        elif DayEnum.get_by_order(start_date.isoweekday()) is not DayEnum.MONDAY:
            raise TypeError("Start date should be a monday")

        self.days_dict = days_dict
        self.nb_weeks = nb_weeks

    ## Returns an array of days matching the period in ascending order
    def get_day_list(self):
        return [
            self.days_dict[DayEnum.get_by_order(d)] for d in self.get_day_enum_list()
        ]
