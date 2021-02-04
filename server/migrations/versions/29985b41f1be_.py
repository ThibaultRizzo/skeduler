"""empty message

Revision ID: 29985b41f1be
Revises:
Create Date: 2021-01-23 07:28:46.172859

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "29985b41f1be"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "schedule",
        "encoded_schedule",
        existing_type=mysql.VARCHAR(length=256),
        type_=sa.String(length=2048),
        existing_nullable=True,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "schedule",
        "encoded_schedule",
        existing_type=sa.String(length=2048),
        type_=mysql.VARCHAR(length=256),
        existing_nullable=True,
    )
    # ### end Alembic commands ###
