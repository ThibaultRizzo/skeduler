from __future__ import print_function

import argparse

from ortools.sat.python import cp_model
from google.protobuf import text_format

from .solver_model import ScheduleCpModelFactory
from .errors import SolverException
from src.enums import ShiftSkillLevel, DayEnum, SolverStatus
from src.models import SolverPeriod, Schedule

import logging

_logger = logging.getLogger()

PARSER = argparse.ArgumentParser()
PARSER.add_argument(
    "--output_proto", default="", help="Output file to write the cp_model" "proto to."
)
PARSER.add_argument("--params", default="", help="Sat solver parameters.")


def validate_input(employees, shifts, period):
    if employees is None:
        raise SolverException("No employee list was passed to the solver")
    elif len(employees) == 0:
        raise SolverException("At least one employee needs to be passed to the solver")
    elif shifts is None:
        raise SolverException("No shift list was passed to the solver")
    elif len(shifts) == 0:
        raise SolverException("At least one shift needs to be passed to the solver")
    elif type(period) is not SolverPeriod:
        raise SolverException("Period needs to be a valid SolverPeriod instance")


DEFAULT_OPTIONS = {"tolerated_delta_contract_hours": 15}
REST_SYMBOL = "R"


def solve_shift_scheduling(
    rules, employees, base_shifts, period, company_id, opts=DEFAULT_OPTIONS
):
    """Solves the shift scheduling problem."""
    validate_input(employees, base_shifts, period)

    model_factory = ScheduleCpModelFactory(rules, employees, base_shifts, period, opts)
    model, solver, status, infeasible_cts = model_factory.solve_model()
    # work = model.matrice

    # # Solve the model.
    # solver = cp_model.CpSolver()
    # solver.parameters.num_search_workers = 8
    # # if params:
    # #     text_format.Merge(params, solver.parameters)
    # solution_printer = cp_model.ObjectiveSolutionPrinter()
    # status = solver.SolveWithSolutionCallback(model, solution_printer)
    # # print(solver.ResponseProto(), type(solver.ResponseProto()))

    # print(model.Proto().constraints)
    # print(solver.ResponseProto().solution_info)

    # Print solution.
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        _logger.info(infeasible_cts)
        encoded_schedule = "".join(
            [str(solver.Value(i[1])) for i in model.matrice.items()]
        )

        return Schedule.to_schedule(
            company_id,
            encoded_schedule,
            model.employees,
            model.base_shifts,
            model.days,
            model.period,
            SolverStatus.by_status_code(status),
            solver.ObjectiveValue(),
            infeasible_cts,
        )
    else:
        # _logger.info(str(solver.ResponseStats()))
        return None


def main(args):
    """Main."""
    solve_shift_scheduling(args.params, args.output_proto)


if __name__ == "__main__":
    main(PARSER.parse_args())
