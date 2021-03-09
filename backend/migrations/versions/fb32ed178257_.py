"""empty message

Revision ID: fb32ed178257
Revises: 44cb09aa144a
Create Date: 2021-03-09 17:05:34.838327

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "fb32ed178257"
down_revision = "44cb09aa144a"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("schedule_penalty", "is_linear")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "schedule_penalty",
        sa.Column("is_linear", sa.BOOLEAN(), autoincrement=False, nullable=False),
    )
    # ### end Alembic commands ###
