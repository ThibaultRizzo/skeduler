class NoRecordError(BaseException):
    """Raised when no record is present for input id"""

    pass


class InvalidDateError(BaseException):
    """Raised when date is invalid"""

    pass


class InvalidInputError(BaseException):
    """Raised when input is invalid"""

    pass
