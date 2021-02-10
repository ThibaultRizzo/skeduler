from . import mutation
from .day_mutation import generate_days


@mutation("createOrganization")
def resolve_create_organization(_, info):
    create_organization()
    db.session.commit()
    return True


def create_organization():
    generate_days()
    return True
