from ortools.sat.python import cp_model
from src.models import REST_SHIFT
from src.enums import (
    ShiftSkillLevel,
    SequenceRuleType,
    SCHEDULE_WEIGHT_DICT,
    EmployeeAvailability,
    SolverStatus,
)
from src.utils import chunk
from .base import (
    add_soft_sequence_constraint,
    add_soft_sum_constraint,
    negated_bounded_span,
)
from .errors import ConflictingConstraintException, SolverException
from src.models import SolverPeriod, Schedule
import logging

# from flask import current_app

_logger = logging.getLogger()

DEFAULT_OPTIONS = {"tolerated_delta_contract_hours": 15}


class ScheduleCpModelFactory:
    def __init__(
        self, company_id, rules, employees, base_shifts, period, config=DEFAULT_OPTIONS
    ):
        self.company_id = company_id
        self.rules = rules
        self.employees = employees
        self.base_shifts = base_shifts
        self.period = period
        self.config = config
        self.validate_input()

    def validate_input(self):
        if self.employees is None:
            raise SolverException("No employee list was passed to the solver")
        elif len(self.employees) == 0:
            raise SolverException(
                "At least one employee needs to be passed to the solver"
            )
        elif self.base_shifts is None:
            raise SolverException("No shift list was passed to the solver")
        elif len(self.base_shifts) == 0:
            raise SolverException("At least one shift needs to be passed to the solver")
        elif type(self.period) is not SolverPeriod:
            raise SolverException("Period needs to be a valid SolverPeriod instance")

    def solve_model(self):

        model = ScheduleCpModel(
            self.rules, self.employees, self.base_shifts, self.period, [], self.config
        )
        solver, status = model.solve()
        infeasible_cts = []
        if status == cp_model.INFEASIBLE:
            infeasible_cts = self.find_infeasible_cts()
            model = ScheduleCpModel(
                self.rules,
                self.employees,
                self.base_shifts,
                self.period,
                infeasible_cts,
                self.config,
            )
            solver, status = model.solve()
        return ScheduleSolution(self.company_id, model, solver, status, infeasible_cts)

    def find_infeasible_cts(self):
        all_hard_cts = (
            ScheduleCpModel.hard_ct_list + ScheduleCpModel.hard_and_soft_ct_list
        )
        infeasible_cts = []
        for i, ct in enumerate(all_hard_cts):
            excluded_cts = [ct for ct in all_hard_cts[i + 1 :]] + infeasible_cts
            model = ScheduleCpModel(
                self.rules,
                self.employees,
                self.base_shifts,
                self.period,
                excluded_cts,
                self.config,
            )
            solver, status = model.solve()
            if status == cp_model.INFEASIBLE:
                infeasible_cts.append(ct)

        return infeasible_cts


# TODO: Use this link to set initial solution ? https://github.com/google/or-tools/issues/1152
# TODO: Find constraints for infeasibility: https://github.com/google/or-tools/issues/973
class ScheduleCpModel(cp_model.CpModel):
    hard_ct_list = [
        "add_one_shift_per_day_ct",  # Maximum one shift per day.
        "add_inactive_days_assignments",  # Inactive days
        "add_mandatory_events_assignments",  # Mandatory events
        "add_employee_total_contract_ct",  # Monthly contract hour per employee
    ]
    hard_and_soft_ct_list = [
        "add_employee_contract_ct",  # Employee contracts
        "add_employee_shift_mastery_ct",  # Employee Shift mastery
        "add_employee_availability_ct",  # Employee Availabilit
        "add_shift_sequence_ct",  # Shift sequence
        "add_weekly_sum_ct",  # Shift sequence sum
        "add_penalized_transitions_ct",  # Penalized transitions,
        "add_cover_ct",  # Shift cover requirements
    ]
    soft_ct_list = [
        "add_employee_requests_ct",  # Employee requests
    ]

    def __init__(self, rules, employees, base_shifts, period, excluded_cts, config):
        super().__init__()
        self.rules = rules
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
        self.excluded_cts = excluded_cts
        self.config = config

        self.init_matrice()
        self.add_constraints()
        self.set_objective()

    def init_matrice(self):
        # Linear terms of the objective in a minimization context.
        self.obj_int_vars = []
        self.obj_int_coeffs = []
        self.obj_bool_vars = []
        self.obj_bool_coeffs = []

        self.conflicting_assignments = {}
        self.matrice = {}
        for e in range(self.nb_employees):
            for s in range(self.nb_shifts):
                for d in range(self.nb_days):
                    self.matrice[e, s, d] = self.NewBoolVar("work%i_%i_%i" % (e, s, d))

    def add_constraints(self):
        def func_not_found(func_name):  # just in case we dont have the function
            _logger.info("No Function " + func_name + " Found!")

        ## Hard constraints
        for ct in ScheduleCpModel.hard_ct_list:
            if ct not in self.excluded_cts:
                getattr(self, ct, lambda: func_not_found(ct))()
        for ct in ScheduleCpModel.hard_and_soft_ct_list:
            if ct not in self.excluded_cts:
                getattr(self, ct, lambda: func_not_found(ct))()
        for ct in ScheduleCpModel.soft_ct_list:
            getattr(self, ct, lambda: func_not_found(ct))()

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

    def solve(self):
        # Solve the model.
        solver = cp_model.CpSolver()
        solver.parameters.num_search_workers = 8
        # if params:
        #     text_format.Merge(params, solver.parameters)
        solution_printer = cp_model.ObjectiveSolutionPrinter()
        status = solver.SolveWithSolutionCallback(self, solution_printer)
        if status != cp_model.INFEASIBLE:
            for i, var in enumerate(self.obj_bool_vars):
                if solver.BooleanValue(var):
                    penalty = self.obj_bool_coeffs[i]
                    if penalty > 0:
                        _logger.info(
                            "  %s violated, penalty=%i" % (var.Name(), penalty)
                        )
                    else:
                        _logger.info("  %s fulfilled, gain=%i" % (var.Name(), -penalty))

            for i, var in enumerate(self.obj_int_vars):
                if solver.Value(var) > 0:
                    _logger.info(
                        "  %s violated by %i, linear penalty=%i"
                        % (var.Name(), solver.Value(var), self.obj_int_coeffs[i])
                    )
        return solver, status

    ###############
    # Constraints #
    ###############

    def add_one_shift_per_day_ct(self):
        for e in range(self.nb_employees):
            for d in range(self.nb_days):
                self.Add(sum(self.matrice[e, s, d] for s in range(self.nb_shifts)) == 1)

    def add_inactive_days_assignments(self):
        fixed_assignments = []
        conflicting_assignments = []

        for e, employee in enumerate(self.employees):
            # Add all inactive days as rest days for everyone
            # 0 is the REST shift position
            for d, day in enumerate(self.period.get_day_list()):
                if day.active is False:
                    self.Add(self.matrice[e, 0, d] == 1)

        self.conflicting_assignments.update(
            {"fixed_assignments": conflicting_assignments}
        )

    def add_mandatory_events_assignments(self):
        (
            fixed_assignments,
            conflicting_assignments,
        ) = ScheduleCpModel.get_mandatory_events_assignments(
            self.period, self.employees, self.shifts
        )
        self.conflicting_assignments.update(
            {"fixed_assignments": conflicting_assignments}
        )
        for e, s, d, v in fixed_assignments:
            self.Add(self.matrice[e, s, d] == v)

    ##
    # Ensures employee does not work LESS than his contract over the given period
    def add_employee_total_contract_ct(self):
        for e, employee in enumerate(self.employees):
            if not employee.is_extra():
                works = [
                    sum(
                        self.matrice[e, s, d] * shift.duration
                        for s, shift in enumerate(self.shifts)
                        for d in range(self.nb_days)
                    )
                ]
                extra_shift_penalty = (
                    SCHEDULE_WEIGHT_DICT.get("MUST")
                    if employee.is_extra()
                    else SCHEDULE_WEIGHT_DICT.get("IMPORTANT")
                )
                variables, coeffs = add_soft_sum_constraint(
                    self,
                    works,
                    self.nb_weeks * employee.contract,
                    self.nb_weeks * employee.contract,
                    0,
                    self.nb_weeks * employee.contract,
                    2000000000,
                    5,
                    "diff_sum_hours_total_contract(employee %i)" % (e),
                )
                # _logger.info(variables)
                self.obj_int_vars.extend(variables)
                self.obj_int_coeffs.extend(coeffs)
                # self.Add(
                #     sum(
                #         self.matrice[e, s, d] * shift.duration
                #         for s, shift in enumerate(self.shifts)
                #         for d in range(self.nb_days)
                #     )
                #     >= self.nb_weeks * employee.contract
                # )

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
                extra_shift_penalty = (
                    SCHEDULE_WEIGHT_DICT.get("MUST")
                    if employee.is_extra()
                    else SCHEDULE_WEIGHT_DICT.get("SHOULD")
                )
                # TODO: Fine-tune penalty values
                variables, coeffs = add_soft_sum_constraint(
                    self,
                    works,
                    0,  # -tolerated_delta_contract_hours + employee.contract,
                    employee.contract,
                    SCHEDULE_WEIGHT_DICT.get("SHOULD"),
                    employee.contract,
                    7 * 204,
                    SCHEDULE_WEIGHT_DICT.get("SHOULD"),
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
        shift_constraints = ScheduleCpModel.get_shift_sequence_ct(
            self.rules["sequence"], self.shifts
        )

        for ct in shift_constraints:
            shift, hard_min, soft_min, min_cost, soft_max, hard_max, max_cost = ct
            for e in range(self.nb_employees):
                works = [self.matrice[e, shift, d] for d in range(self.nb_days)]
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

        weekly_sum_constraints = ScheduleCpModel.get_weekly_sum_ct(
            self.rules["sequence"], self.shifts
        )

        # 	TODO: Is it useful to keep this?
        # If so, we might have to complete the matrice to always work on a multiple of 7
        # Weekly sum constraints
        for ct in weekly_sum_constraints:
            shift, hard_min, soft_min, min_cost, soft_max, hard_max, max_cost = ct
            for e in range(self.nb_employees):
                for w in range(0, self.nb_weeks):
                    works = [
                        self.matrice[e, shift, d] for d in range(w * 7, (w + 1) * 7)
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
        penalized_transitions = ScheduleCpModel.get_penalized_transitions(
            self.rules["transition"], self.shifts
        )
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
                # _logger.info(min_demand)

                worked = self.NewIntVar(
                    0, self.nb_employees, f"worked(shift={s}, day={d}"
                )
                self.Add(worked == sum(works))
                if min_demand == 0:
                    self.Add(worked == 0)
                else:
                    over_penalty = excess_cover_penalties[s - 1]
                    if over_penalty > 0:
                        variables, coeffs = add_soft_sum_constraint(
                            self,
                            works,
                            0,
                            min_demand,
                            SCHEDULE_WEIGHT_DICT.get("CRITICAL"),
                            min_demand,
                            self.nb_employees,
                            SCHEDULE_WEIGHT_DICT.get("VERY_IMPORTANT"),
                            f"excess_demand(shift={s}, day={d})",
                        )
                        self.obj_int_vars.extend(variables)
                        self.obj_int_coeffs.extend(coeffs)

                        # name = f"excess_demand(shift={s}, day={d})"
                        # excess = self.NewIntVar(
                        #     -min_demand, self.nb_employees - min_demand, name
                        # )
                        # self.Add(excess == worked - min_demand)
                        # self.obj_int_vars.append(excess)
                        # self.obj_int_coeffs.append(over_penalty)

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
                        works = [self.matrice[e, s, d] for d in range(self.nb_days)]

                        variables, coeffs = add_soft_sum_constraint(
                            self,
                            works,
                            0,
                            0,
                            0,
                            0,
                            self.nb_days,
                            SCHEDULE_WEIGHT_DICT.get("SHOULD"),
                            "mastery_constraints(employee %i, shift %i)" % (e, s),
                        )
                        self.obj_int_vars.extend(variables)
                        self.obj_int_coeffs.extend(coeffs)

    def add_employee_availability_ct(self):
        employees_availability = [e.get_availability() for e in self.employees]
        for d, day in enumerate(self.days):
            if day.active:
                for e, availabilities in enumerate(employees_availability):
                    av = availabilities[day.order - 1]
                    if av is EmployeeAvailability.NOT_WORKING:
                        self.Add(self.matrice[e, 0, d] == 1)
                    elif av is EmployeeAvailability.AVAILABLE:
                        self.obj_bool_vars.append(self.matrice[e, 0, d])
                        self.obj_bool_coeffs.append(
                            -EmployeeAvailability.get_availability_penalty()
                        )

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

    def get_mandatory_events_assignments(period, employees, shifts):
        fixed_assignments = []
        conflicting_assignments = []

        shift_dict = dict((shift.id, s) for s, shift in enumerate(shifts))
        for e, employee in enumerate(employees):
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
                            assignment, fixed_assignments, len(shifts)
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
    def get_shift_sequence_ct(rules, shifts):
        # One or two consecutive days of rest, this is a hard constraint.
        # (0, 1, 1, 0, 3, 3, 0),
        # betweem 2 and 3 consecutive days of night shifts, 1 and 4 are
        # possible but penalized.
        # (3, 1, 2, 20, 3, 4, 5),
        shift_constraints = [
            r.to_rule(shifts)
            for r in rules
            if r.rule_type.name == SequenceRuleType.SHIFT_SEQUENCE
        ]

        return shift_constraints

    def get_weekly_sum_ct(rules, shifts):
        # Constraints on rests per week.
        # (0, 1, 2, 7, 2, 3, 4),
        # At least 1 night shift per week (penalized). At most 4 (hard).
        # (3, 0, 1, 3, 2, 2, 0),
        ct = [
            r.to_rule(shifts)
            for r in rules
            if r.rule_type.name == SequenceRuleType.SHIFT_SUM_SEQUENCE
        ]

        return ct

    def get_penalized_transitions(rules, shifts):
        # Penalized transitions:
        #     (previous_shift, next_shift, penalty (0 means forbidden))
        # Afternoon to night has a penalty of 4.
        # (2, 3, 4),
        # Night to morning is forbidden.
        # (1, 3, 0),
        penalized_transitions = [r.to_rule(shifts) for r in rules]

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
        def find_level(skills, shift):
            return next(
                (
                    skill.level.get_value()
                    for skill in skills
                    if skill.shift_id == shift.id
                ),
                0,
            )

        return list(
            list(find_level(employee.skills, shift) for shift in shifts)
            for employee in employees
        )


class ScheduleSolution:
    def __init__(self, company_id, model, solver, status, infeasible_cts):
        self.company_id = company_id
        self.model = model
        self.solver = solver
        self.infeasible_cts = infeasible_cts
        self.status = status
        self.schedule = self.get_schedule()

    def get_schedule(self):
        if self.status == cp_model.OPTIMAL or self.status == cp_model.FEASIBLE:
            _logger.info(self.infeasible_cts)
            encoded_schedule = "".join(
                [str(self.solver.Value(i[1])) for i in self.model.matrice.items()]
            )

            return Schedule.to_schedule(
                self.company_id,
                encoded_schedule,
                self.model.employees,
                self.model.base_shifts,
                self.model.days,
                self.model.period,
                SolverStatus.by_status_code(self.status),
                self.solver.ObjectiveValue(),
                self.infeasible_cts,
            )
        else:
            # _logger.info(str(solver.ResponseStats()))
            return None
