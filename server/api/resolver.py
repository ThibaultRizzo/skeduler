from ariadne import ScalarType
from dateutil import *

datetime_scalar = ScalarType("Datetime")

# https://ariadnegraphql.org/docs/0.7.0/scalars#example-read-only-scalar
@datetime_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()


@datetime_scalar.value_parser
def parse_datetime_value(value):
    # dateutil is provided by python-dateutil library
    if value:
        return parser.parse(value)


@datetime_scalar.literal_parser
def parse_datetime_literal(ast):
    value = str(ast.value)
    return parse_datetime_value(value)  # reuse logic from parse_value
