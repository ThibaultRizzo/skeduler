"""empty message

Revision ID: 71707b02e676
Revises: 96364376e34f
Create Date: 2021-02-04 13:29:22.341233

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "71707b02e676"
down_revision = "96364376e34f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("employee_leave", sa.Column("duration", sa.Integer(), nullable=False))
    op.drop_column("employee_leave", "end_day")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("employee_leave", sa.Column("end_day", sa.DATE(), nullable=False))
    op.drop_column("employee_leave", "duration")
    # ### end Alembic commands ###