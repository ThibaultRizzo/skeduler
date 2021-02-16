from datetime import datetime, date, timedelta, time, timezone
from ..enums import DayEnum


class Period:
    def __init__(self, start_date, nb_days):
        if type(start_date) is not datetime and type(start_date) is not date:
            raise TypeError("start_date should be a valid date/datetime")
        elif nb_days <= 0:
            raise TypeError("nb_days should be a positive integer")
        self.start_date = Period.to_datetime(start_date)
        self.nb_days = nb_days
        self.end_date = self.start_date + timedelta(days=nb_days)

    def get_weekday_list(self):
        return [
            (self.start_date + timedelta(days=x)).isoweekday()
            for x in range(0, self.nb_days)
        ]

    def get_date_list(self):
        return [(self.start_date + timedelta(days=x)) for x in range(0, self.nb_days)]

    def get_day_enum_list(self):
        return [DayEnum.get_by_order(x) for x in self.get_weekday_list()]

    def is_intersecting(self, period) -> bool:
        period_start_date = Period.to_datetime(period.start_date)
        period_end_date = Period.to_datetime(period.end_date)
        if self.start_date < period_start_date:
            return self.end_date >= period_start_date
        elif self.start_date > period_start_date:
            return self.start_date <= period_end_date
        else:
            return True

    def contains(self, d: datetime) -> bool:
        date = Period.to_datetime(d)
        return date >= self.start_date and date <= self.end_date

    def to_datetime(d):
        if type(d) is date:
            return datetime.combine(d, datetime.min.time(), timezone.utc)
        elif type(d) is datetime:
            return d
        else:
            raise Exception("to_datetime only accepts dates/datetimes")

    def __repr__(self):
        return f"<Period: {self.start_date} - {self.end_date}>"


class SolverPeriod(Period):
    def __init__(self, start_date, nb_weeks, days):
        super().__init__(start_date, nb_weeks * 7)
        if nb_weeks <= 0:
            raise TypeError("Number of weeks should be a positive integer")
        elif DayEnum.get_by_order(start_date.isoweekday()) is not DayEnum.MONDAY:
            raise TypeError("Start date should be a monday")
        elif len(days) is not 7:
            raise TypeError(f"7 days are needed, currently only passed {len(days)}")
        self.nb_weeks = nb_weeks
        self.days = days
        self.days_dict = dict((d.name, d) for d in days)
        self.dates_to_day_index_dict = self.get_dates_dict()

    def get_dates_dict(self) -> dict:
        date_list = self.get_date_list()
        date_dict = {}
        for i in range(len(date_list)):
            date_dict.update({date_list[i].date(): i})
        return date_dict

    ## Returns a list of days matching the period in ascending order
    def get_day_list(self):
        return [self.days_dict.get(d) for d in self.get_day_enum_list()]

    def __repr__(self):
        return f"<SolverPeriod: {self.start_date} - {self.end_date}>"
