from ortools.sat.python import cp_model
from src.models import REST_SHIFT
from src.enums import ShiftSkillLevel
from src.utils import chunk
from .base import (
    add_soft_sequence_constraint,
    add_soft_sum_constraint,
    negated_bounded_span,
)
from .errors import ConflictingConstraintException
from src.models.penalty import SCHEDULE_WEIGHT_DICT


# TODO: Use this link to set initial solution ? https://github.com/google/or-tools/issues/1152
# TODO: Find constraints for infeasibility: https://github.com/google/or-tools/issues/973
class ScheduleCpModel(cp_model.CpModel):
    def __init__(self, employees, base_shifts, period, config):
        super().__init__()
        self.employees = employees
        self.nb_employees = len(employees)
        self.base_shifts = base_shifts
        self.shifts = [REST_SHIFT] + self.base_shifts
        self.nb_shifts = len(self.shifts)
        self.days = period.get_day_list()
        self.nb_days = len(self.days)
        self.weeks = chunk(self.days, 7)
        self.nb_weeks = len(self.weeks)
        self.period = period
        self.config = config

        # Linear terms of the objective in a minimization context.
        self.obj_int_vars = []
        self.obj_int_coeffs = []
        self.obj_bool_vars = []
        self.obj_bool_coeffs = []

        self.conflicting_assignments = {}

        self.init_matrice()
        self.add_constraints()
        self.set_objective()

    def init_matrice(self):
        self.matrice = {}
        for e in range(self.nb_employees):
            for s in range(self.nb_shifts):
                for d in range(self.nb_days):
                    self.matrice[e, s, d] = self.NewBoolVar("work%i_%i_%i" % (e, s, d))

    def add_constraints(self):
        ## Hard constraints
        # 1. Maximum one shift per day.
        self.add_one_shift_per_day_ct()

        # 2. Fixed assignments.
        self.add_fixed_assignments_ct()

        # 3. Monthly contract hour per employee
        self.add_employee_total_contract_ct()

        ## Soft constraints

        # 4. Employee contracts
        self.add_employee_contract_ct()

        # 5. Employee requests
        self.add_employee_requests_ct()

        # 6. Shift cover requirements
        self.add_cover_ct()

        # 7. Employee Shift mastery
        self.add_employee_shift_mastery_ct()

        # 8. Shift
        self.add_shift_sequence_ct()
        # self.add_weekly_sum_ct()
        # self.add_penalized_transitions_ct()

    def set_objective(self):
        self.Minimize(
            sum(
                self.obj_bool_vars[i] * self.obj_bool_coeffs[i]
                for i in range(len(self.obj_bool_vars))
            )
            + sum(
                self.obj_int_vars[i] * self.obj_int_coeffs[i]
                for i in range(len(self.obj_int_vars))
            )
        )

    ###############
    # Constraints #
    ###############

    def add_one_shift_per_day_ct(self):
        for e in range(self.nb_employees):
            for d in range(self.nb_days):
                self.Add(sum(self.matrice[e, s, d] for s in range(self.nb_shifts)) == 1)

    def add_fixed_assignments_ct(self):
        (
            fixed_assignments,
            conflicting_assignments,
        ) = ScheduleCpModel.get_fixed_assignments(
            self.employees, self.shifts, self.period
        )
        # TODO: Find a way to avoid cases where there is not enough working hours for an employee to fulfill his contract
        # conflicting_employee_contrats = []
        # for e, employee in enumerate(self.employees):
        #     available_hours = 0
        #     for d in range(self.nb_days):
        #         for s,shift in enumerate(self.shifts):
        #             if (e,s,d,1) in fixed_assignments:
        #                 available_hours += shift.duration
        #                 break
        #             elif

        #         if (e,s,d)
        #     available_hours = sum(
        #         (
        #             shift.duration
        #             if (
        #                 (e, s, d, 0) not in fixed_assignments
        #                 or (e, 0, d, 1) not in fixed_assignments
        #             )
        #             else 0
        #             for s, shift in enumerate(self.shifts)
        #             for d in range(self.nb_days)
        #         )
        #     )
        #     if available_hours < employee.contract * self.nb_weeks:
        #         conflicting_employee_contrats.append(e)
        # self.conflicting_assignments.update(
        #     {"employee_contrats": conflicting_employee_contrats}
        # )
        self.conflicting_assignments.update(
            {"fixed_assignments": conflicting_assignments}
        )
        for e, s, d, v in fixed_assignments:
            self.Add(self.matrice[e, s, d] == v)

    def add_employee_total_contract_ct(self):
        for e, employee in enumerate(self.employees):
            self.Add(
                sum(
                    self.matrice[e, s, d] * shift.duration
                    for s, shift in enumerate(self.shifts)
                    for d in range(self.nb_days)
                )
                == self.nb_weeks * employee.contract
            )

    def add_employee_contract_ct(self):
        tolerated_delta_contract_hours = self.config["tolerated_delta_contract_hours"]

        # Employee hour contract constraints
        for w, week in enumerate(self.weeks):
            for e, employee in enumerate(self.employees):
                works = [
                    sum(
                        self.matrice[e, s, d] * shift.duration
                        for d in range(w * 7, (w + 1) * 7)
                    )
                    for s, shift in enumerate(self.shifts)
                ]
                # TODO: Fine-tune penalty values
                variables, coeffs = add_soft_sum_constraint(
                    self,
                    works,
                    0,  # -tolerated_delta_contract_hours + employee.contract,
                    employee.contract,
                    SCHEDULE_WEIGHT_DICT.get("IMPORTANT"),
                    employee.contract,
                    2
                    * employee.contract,  # tolerated_delta_contract_hours + employee.contract,
                    SCHEDULE_WEIGHT_DICT.get("IMPORTANT"),
                    "diff_sum_hours_contract(employee %i, week %i)" % (e, w),
                )
                self.obj_int_vars.extend(variables)
                self.obj_int_coeffs.extend(coeffs)

    def add_employee_requests_ct(self):
        requests = ScheduleCpModel.get_requests(
            self.employees, self.shifts, self.period
        )
        for e, s, d, w in requests:
            self.obj_bool_vars.append(self.matrice[e, s, d])
            self.obj_bool_coeffs.append(w)

    def add_shift_sequence_ct(self):
        shift_constraints = ScheduleCpModel.get_shift_sequence_ct()
        for ct in shift_constraints:
            shift, hard_min, soft_min, min_cost, soft_max, hard_max, max_cost = ct
            for e in range(self.nb_employees):
                works = [work[e, shift, d] for d in range(self.nb_days)]
                variables, coeffs = add_soft_sequence_constraint(
                    self,
                    works,
                    hard_min,
                    soft_min,
                    min_cost,
                    soft_max,
                    hard_max,
                    max_cost,
                    "shift_constraint(employee %i, shift %i)" % (e, shift),
                )
                self.obj_bool_vars.extend(variables)
                self.obj_bool_coeffs.extend(coeffs)

    def add_weekly_sum_ct(self):
        weekly_sum_constraints = ScheduleCpModel.get_weekly_sum_ct()
        # 	TODO: Is it useful to keep this?
        # If so, we might have to complete the matrice to always work on a multiple of 7
        # Weekly sum constraints
        for ct in weekly_sum_constraints:
            shift, hard_min, soft_min, min_cost, soft_max, hard_max, max_cost = ct
            for e in range(self.nb_employees):
                for w in range(self.nb_weeks):
                    works = [
                        self.matrice[e, shift, d + w * self.nb_days]
                        for d in range(self.nb_days)
                    ]
                    variables, coeffs = add_soft_sum_constraint(
                        self,
                        works,
                        hard_min,
                        soft_min,
                        min_cost,
                        soft_max,
                        hard_max,
                        max_cost,
                        "weekly_sum_constraint(employee %i, shift %i, week %i)"
                        % (e, shift, w),
                    )
                    self.obj_int_vars.extend(variables)
                    self.obj_int_coeffs.extend(coeffs)

    def add_penalized_transitions_ct(self):
        penalized_transitions = ScheduleCpModel.get_penalized_transitions()
        for previous_shift, next_shift, cost in penalized_transitions:
            for e in range(self.nb_employees):
                for d in range(self.nb_days - 1):
                    transition = [
                        self.matrice[e, previous_shift, d].Not(),
                        self.matrice[e, next_shift, d + 1].Not(),
                    ]
                    if cost == 0:
                        self.AddBoolOr(transition)
                    else:
                        trans_var = self.NewBoolVar(
                            "transition (employee=%i, day=%i)" % (e, d)
                        )
                        transition.append(trans_var)
                        self.AddBoolOr(transition)
                        self.obj_bool_vars.append(trans_var)
                        self.obj_bool_coeffs.append(cost)

    def add_cover_ct(self):
        cover_demands = ScheduleCpModel.get_cover_demands(
            self.base_shifts, self.nb_weeks
        )
        excess_cover_penalties = ScheduleCpModel.get_excess_cover_penalties(
            self.base_shifts
        )
        for s in range(1, self.nb_shifts):
            for d in range(self.nb_days):
                works = [self.matrice[e, s, d] for e in range(self.nb_employees)]
                # Ignore Off shift.
                min_demand = cover_demands[s - 1][d]
                worked = self.NewIntVar(min_demand, self.nb_employees, "")
                self.Add(worked == sum(works))
                over_penalty = excess_cover_penalties[s - 1]
                if over_penalty > 0:
                    name = "excess_demand(shift=%i, day=%i)" % (s, d)
                    excess = self.NewIntVar(0, self.nb_employees - min_demand, name)
                    self.Add(excess == worked - min_demand)
                    self.obj_int_vars.append(excess)
                    self.obj_int_coeffs.append(over_penalty)

    def add_employee_shift_mastery_ct(self):
        employee_shift_mastery = ScheduleCpModel.get_employee_shift_mastery(
            self.employees, self.base_shifts
        )

        for e in range(self.nb_employees):
            for s in range(1, self.nb_shifts):
                coef_mastery = employee_shift_mastery[e][s - 1]
                if coef_mastery < 2:
                    nb_shifts_worked = self.NewIntVar(0, self.nb_days, "")
                    self.Add(
                        nb_shifts_worked
                        == sum(self.matrice[e, s, d] for d in range(self.nb_days))
                    )
                    if coef_mastery == 0:
                        # Employee cannot fulfill this role
                        self.Add(nb_shifts_worked == 0)
                    elif coef_mastery == 1:
                        # Employee can fulfill this role with a penalty
                        variables, coeffs = add_soft_sum_constraint(
                            self,
                            nb_shifts_worked,
                            0,
                            0,
                            0,
                            0,
                            self.nb_days,
                            SCHEDULE_WEIGHT_DICT.get("SHOULD"),
                            "mastery_constraints(employee %i, shift %i)" % (e, shift),
                        )
                        self.obj_int_vars.extend(variables)
                        self.obj_int_coeffs.extend(coeffs)

    ################
    # Static Funcs #
    ################
    def is_ct_conflicting(ct, ct_list, nb_shift):
        (e, s, d, v) = ct
        for _ct in ct_list:
            _e, _s, _d, _v = _ct
            if (
                v == 1
                and _e == e
                and d == _d
                and ((s != _s and _v == 1) or (s == _s and _v == -1))
            ):
                return True
            elif v == 0 and _e == e and d == _d and (s == _s and _v == 1):
                return True

        if v == 0 and set(
            list((e, i, d, 0) for i in range(nb_shift) if i != s)
        ).issubset(ct_list):
            return True
        return False

    # Fixed assignment: (employee, shift, day).
    def get_fixed_assignments(employee_list, shift_list, period):
        fixed_assignments = []
        conflicting_assignments = []

        shift_dict = dict((shift.id, s) for s, shift in enumerate(shift_list))
        for e, employee in enumerate(employee_list):
            # Add all inactive days as rest days for everyone
            # 0 is the REST shift position
            for d, day in enumerate(period.get_day_list()):
                if day.active is False:
                    fixed_assignments.append((e, 0, d, 1))

            # Add all mandatory events for each employee (leaves, sick days,etc...)
            for event in employee.get_mandatory_events(period):
                for event_date in event.get_event_dates():
                    day_index = period.dates_to_day_index_dict.get(event_date.date())
                    if day_index is not None:
                        # Date is covered by schedule generation
                        shift_index = shift_dict.get(event.shift_id, 0)
                        desired_value = 1 if event.is_desired else 0
                        assignment = (e, shift_index, day_index, desired_value)

                        # Check if there is an existing constraint conflicting with this one
                        if ScheduleCpModel.is_ct_conflicting(
                            assignment, fixed_assignments, len(shift_list)
                        ):
                            conflicting_assignments.append(assignment)
                        else:
                            fixed_assignments.append(assignment)
        return fixed_assignments, conflicting_assignments

    # Request: (employee, shift, day, weight)
    # A negative weight indicates that the employee desire this assignment.
    def get_requests(employee_list, shift_list, period) -> (int, int, int, int):
        requests = []
        shift_dict = dict((shift.id, s) for s, shift in enumerate(shift_list))

        for e, employee in enumerate(employee_list):
            for event in employee.get_requests(period):
                for event_date in event.get_event_dates():
                    day_index = period.dates_to_day_index_dict.get(event_date.date())
                    if day_index is not None:
                        # Date is covered by schedule generation
                        shift_index = shift_dict.get(event.shift_id, 0)
                        requests.append((e, shift_index, day_index, event.get_weight()))
        return requests

    # Shift constraints on continuous sequence :
    #     (shift, hard_min, soft_min, min_penalty,
    #             soft_max, hard_max, max_penalty)
    def get_shift_sequence_ct():

        shift_constraints = [
            # One or two consecutive days of rest, this is a hard constraint.
            # (0, 1, 1, 0, 3, 3, 0),
            # betweem 2 and 3 consecutive days of night shifts, 1 and 4 are
            # possible but penalized.
            # (3, 1, 2, 20, 3, 4, 5),
        ]
        return shift_constraints

    def get_weekly_sum_ct():
        ct = [
            # Constraints on rests per week.
            # (0, 1, 2, 7, 2, 3, 4),
            # At least 1 night shift per week (penalized). At most 4 (hard).
            # (3, 0, 1, 3, 2, 2, 0),
        ]
        return ct

    def get_penalized_transitions():
        # Penalized transitions:
        #     (previous_shift, next_shift, penalty (0 means forbidden))
        penalized_transitions = [
            # Afternoon to night has a penalty of 4.
            # (2, 3, 4),
            # Night to morning is forbidden.
            # (1, 3, 0),
        ]
        return penalized_transitions

    # daily demands for work shifts for each shift
    # of the week starting on Monday. [(1,1,1,1,1,1,1)...]
    def get_cover_demands(shift_list, nb_week):
        return tuple(s.get_cover_constraints() * nb_week for s in shift_list)

    def get_excess_cover_penalties(shift_list):
        return list(s.get_cover_penalty() for s in shift_list)

    # Employee mastery level for each shift (Manager, Bar, Restaurant)
    # 0 = No ability   1 = Training for this position    2 = Ability
    def get_employee_shift_mastery(employees, shifts):
        find_level = lambda skills, shift: next(
            (
                ShiftSkillLevel[skill.level].get_value()
                for skill in skills
                if skill.shift_id is shift.id
            ),
            0,
        )
        return list(
            list(find_level(employee.skills, shift) for shift in shifts)
            for employee in employees
        )
