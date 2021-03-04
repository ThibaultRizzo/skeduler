from sqlalchemy import Column, String, Enum, Date, Integer, ForeignKey
from textwrap import wrap
from src.database import db, PkCompanyModel, created_at
from src.utils import chunk, complete_str
from src.enums import SolverStatus
from .shift_model import REST_SHIFT
import logging

_logger = logging.getLogger()


class Schedule(PkCompanyModel):
    created_at = created_at()
    encoded_schedule = Column(String(2048))
    shifts = db.relationship("ScheduleShift", cascade="all, delete, delete-orphan")
    employees = db.relationship(
        "ScheduleEmployee", cascade="all, delete, delete-orphan"
    )
    start_date = Column(Date, nullable=False)
    nb_days = Column(Integer, nullable=False)

    status = Column(Enum(SolverStatus), nullable=False)
    objective = Column(Integer)
    infeasible_cts = Column(String(256))

    def __repr__(self):
        return "<Schedule: {}>".format(self.id)

    def get_meta(self):
        return {
            "createdAt": self.created_at,
            "infeasibleConstraints": self.infeasible_cts,
            "objective": self.objective,
        }

    def get_schedule_per_day(self):
        [
            binary_schedule,
            employee_list_id,
            shift_list_id,
            day_list_id,
        ] = Schedule.decode(self.encoded_schedule)

        # Add rest time
        shift_nb = len(shift_list_id)
        day_nb = len(day_list_id)
        shifts_per_employee = [
            wrap(e, day_nb) for e in wrap(binary_schedule, shift_nb * day_nb)
        ]
        sch = []
        for d, day in enumerate(day_list_id):
            shifts = []

            # We skip first array of each set, as it refers to the implied rest time
            for s in range(1, shift_nb):
                shift = shift_list_id[s]
                shift_employee = next(
                    (
                        employee
                        for e, employee in enumerate(employee_list_id)
                        if shifts_per_employee[e][s][d] == "1"
                    ),
                    None,
                )
                if shift_employee is not None:
                    shifts.append({"shift": shift, "employee": shift_employee})

            sch.append({"day": day, "shifts": shifts})

        return {"schedule": sch, "meta": self.get_meta()}

    def get_bin_schedule(self):
        return self.encoded_schedule.split(" ")[3]

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

    def to_schedule(
        company_id,
        bin_schedule,
        employees,
        base_shifts,
        days,
        period,
        status,
        objective,
        infeasible_cts,
    ):
        encoded_schedule = Schedule.encode(bin_schedule, employees, base_shifts, days)
        shifts = []
        for s, shift in enumerate(base_shifts):
            shifts.append(ScheduleShift(order=s, shift_id=shift.id))

        employees = []
        for (s, i) in enumerate(employees):
            ScheduleEmployee(order=i, employee_id=s["employee"])
        schedule = Schedule(
            company_id=company_id,
            encoded_schedule=encoded_schedule,
            shifts=shifts,
            employees=employees,
            start_date=period.start_date,
            nb_days=period.nb_days,
            status=status,
            objective=objective,
            infeasible_cts=",".join(infeasible_cts),
        )
        return schedule

    def print(self, employees, shifts, working_days):
        _logger.info(f"Objective: {self.objective}")
        largest_title_size = len(max(shifts, key=lambda s: len(s.title)).title)
        cell_size = (
            largest_title_size
            if largest_title_size < 10 and largest_title_size > 2
            else 10
        )

        header = (cell_size * " ") + "".join(
            (
                d.name.name[0:2] + " " * (cell_size - 2)
                if d.active
                else f"({d.name.name[0:2]}){' ' * (cell_size - 4)}"
            )
            for d in working_days
        )

        encoded_sch = self.encoded_schedule.split()[3]

        _logger.info(header)
        employees_chunks = chunk(encoded_sch, int(len(encoded_sch) / len(employees)))
        for e, employee_chunk in enumerate(employees_chunks):
            employee = employees[e]
            employee_name = f"{complete_str(employee.name, cell_size, ' ')}"

            shifts_chunks = chunk(employees_chunks[e], self.nb_days)

            res = [""] * self.nb_days
            for s, shift_chunk in enumerate(shifts_chunks):
                shift = REST_SHIFT if s == 0 else shifts[s - 1]
                for b, bit in enumerate(shift_chunk):
                    if int(bit) == 1:
                        res[b] = complete_str(shift.title, cell_size, " ")

            for w, week_chunk in enumerate(chunk(res, len(working_days))):
                line_header = employee_name if w == 0 else " " * cell_size
                line = line_header + "".join(week_chunk)
                _logger.info(line)


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
        return "<ScheduleShift: {}, {}, {}>".format(
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
