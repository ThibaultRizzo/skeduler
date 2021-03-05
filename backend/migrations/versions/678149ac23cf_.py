"""empty message

Revision ID: 678149ac23cf
Revises:
Create Date: 2021-02-17 14:19:44.979638

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "678149ac23cf"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("day_name_key", "day", type_="unique")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint("day_name_key", "day", ["name"])
    # ### end Alembic commands ###