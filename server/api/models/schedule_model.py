from sqlalchemy import Column, String, Integer, ForeignKey
from .helper import ID, created_at
from textwrap import wrap
from main import db


class Schedule(db.Model):
    id = ID()
    created_at = created_at()
    encoded_schedule = Column(String(2048))
    shifts = db.relationship("ScheduleShift", cascade="all, delete, delete-orphan")
    employees = db.relationship(
        "ScheduleEmployee", cascade="all, delete, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "encodedSchedule": self.encoded_schedule,
            "shifts": self.shifts,
            "employees": self.employees,
        }

    def __repr__(self):
        return "<Schedule: {}>".format(self.id)

    def get_meta(self):
        return {"createdAt": self.created_at}

    def get_schedule_per_day(self):
        [
            binary_schedule,
            employee_list_id,
            shift_list_id,
            day_list_id,
        ] = Schedule.decode(self.encoded_schedule)

        # Add rest time
        employee_nb = len(employee_list_id)
        shift_nb = len(shift_list_id)
        day_nb = len(day_list_id)
        shifts_per_employee = [
            wrap(e, day_nb) for e in wrap(binary_schedule, shift_nb * day_nb)
        ]
        sch = []
        for d in range(day_nb):
            day = day_list_id[d]
            shifts = []

            # We skip first array of each set, as it refers to the implied rest time
            for s in range(1, shift_nb):
                shift = shift_list_id[s]
                shift_employee = None
                for e in range(employee_nb):
                    employee = employee_list_id[e]
                    if shifts_per_employee[e][s][d] == "1":
                        shift_employee = employee

                if shift_employee == None:
                    print(employee, e)
                shifts.append({"shift": shift, "employee": shift_employee})

            sch.append({"day": day, "shifts": shifts})

        return {"schedule": sch, "meta": self.get_meta()}

    def encode(bin_schedule, employees, shifts, working_days):
        encoded_employees = "E:" + "|".join(str(e.id) for e in employees)
        encoded_shifts = "S:" + "|".join(str(s.id) for s in shifts)
        encoded_days = "D:" + "|".join(str(d.id) for d in working_days)
        return " ".join([encoded_employees, encoded_shifts, encoded_days, bin_schedule])

    def decode(encoded_str):
        employee_id_list = []
        # Set first id as the rest time
        day_id_list = []
        for chunk in encoded_str.split():
            entity = chunk[0:1]
            if entity == "E":
                employee_id_list = chunk[2::].split("|")
            elif entity == "S":
                shift_id_list = [None] + chunk[2::].split("|")
            elif entity == "D":
                day_id_list = chunk[2::].split("|")
            else:
                encoded_schedule = chunk

        return [encoded_schedule, employee_id_list, shift_id_list, day_id_list]

    def to_schedule(bin_schedule, employees, shifts, days):
        encoded_schedule = Schedule.encode(bin_schedule, employees, shifts, days)
        shifts = []
        for (s, i) in enumerate(shifts):
            shifts.append(ScheduleShift(order=i, shift_id=s["shift"]))

        employees = []
        for (s, i) in enumerate(employees):
            ScheduleEmployee(order=i, employee_id=s["employee"])

        schedule = Schedule(
            encoded_schedule=encoded_schedule,
            shifts=shifts,
            employees=employees,
        )
        return schedule


class ScheduleShift(db.Model):
    schedule_id = Column(
        String(36),
        ForeignKey("schedule.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    schedule = db.relationship("Schedule", back_populates="shifts")
    shift_id = Column(
        String(36),
        ForeignKey("shift.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    order = Column(Integer, primary_key=True)

    def __repr__(self):
        return "<ScheduleShift: {}, {}, {}, {}>".format(
            self.schedule_id, self.shift_id, self.order
        )


class ScheduleEmployee(db.Model):
    schedule_id = Column(
        String(36),
        ForeignKey("schedule.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    schedule = db.relationship("Schedule", back_populates="employees")
    employee_id = Column(
        String(36),
        ForeignKey("employee.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    order = Column(Integer, primary_key=True)

    def __repr__(self):
        return "<ScheduleEmployee: {}, {}, {}, {}>".format(
            self.schedule_id, self.employee_id, self.order
        )
