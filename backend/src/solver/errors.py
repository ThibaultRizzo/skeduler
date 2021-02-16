class SolverException(Exception):
    """Raised by Solver service"""

    def __init__(self, message="Something bad happened while solving the schedule"):
        self.message = message
        super().__init__(self.message)

    def __str__(self):
        return f"SolverException -> {self.message}"


class ConflictingConstraintException(SolverException):
    def __init__(self, constraints):
        super().__init__("Constraints conflicting: {constraints.size}")

    def __str__(self):
        return f"ConflictingConstraintException -> {self.message}"
