from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import Column, String, DateTime, inspect
from sqlalchemy.orm.collections import InstrumentedList
from enum import Enum
import uuid
import datetime
from .extensions import db
from src.utils import snake_to_camel_case, filter_keys


# Alias common SQLAlchemy names
Column = db.Column
relationship = db.relationship


def ID():
    return Column("id", String(36), default=lambda: str(uuid.uuid4()), primary_key=True)


def created_at():
    return Column(DateTime, default=datetime.datetime.utcnow)


# TODO: Play around with these: https://github.com/cookiecutter-flask/cookiecutter-flask/blob/master/%7B%7Bcookiecutter.app_name%7D%7D/%7B%7Bcookiecutter.app_name%7D%7D/database.py
class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD (create, read, update, delete) operations."""

    @classmethod
    def get_or_throw(cls, id):
        entity = cls.query.get(id)
        if entity is None:
            raise NoRecordError(f"Could not find {cls} with ID: " + _id)
        else:
            return entity

    @classmethod
    def create(cls, **kwargs):
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        return instance.save()

    @classmethod
    def updateOne(cls, **kwargs):
        _id = kwargs["id"]
        entity = cls.get_or_throw(_id)
        return entity.update(**kwargs).to_dict()

    def update(self, commit=True, **kwargs):
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return commit and self.save() or self.to_dict()

    def save(self, commit=True):
        """Save the record."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    @classmethod
    def deleteOne(cls, id):
        is_deleted = cls.query.filter_by(id=id).delete()
        db.session.commit()
        return True if is_deleted == 1 else 0

    def delete(self, commit=True):
        """Remove the record from the database."""
        return commit and db.session.commit()


class Model(CRUDMixin, db.Model):
    """Base model class that includes CRUD convenience methods."""

    __abstract__ = True


class PkModel(Model):
    """Base model class that includes CRUD convenience methods, plus adds a 'primary key' column named ``id``."""

    __abstract__ = True
    id = ID()

    @classmethod
    def get_all(cls):
        """Get all records."""
        return [entity.to_dict() for entity in cls.query.all()]

    @classmethod
    def get_by_id(cls, record_id):
        """Get record by ID."""
        if isinstance(record_id, str):
            return cls.query.get(record_id).to_dict()
        return None

    def to_dict(self):
        return to_dict(self, [])


def reference_col(
    tablename, nullable=False, pk_name="id", foreign_key_kwargs=None, column_kwargs=None
):
    """Column that adds primary key foreign key reference.
    Usage: ::
        category_id = reference_col('category')
        category = relationship('Category', backref='categories')
    """
    foreign_key_kwargs = foreign_key_kwargs or {}
    column_kwargs = column_kwargs or {}

    return Column(
        db.ForeignKey(f"{tablename}.{pk_name}", **foreign_key_kwargs),
        nullable=nullable,
        **column_kwargs,
    )


class PkCompanyModel(PkModel):
    """Base model class that includes company_id foreign key and utility functions around company."""

    __abstract__ = True

    @declared_attr
    def company_id(cls):
        return reference_col(
            "company",
            False,
            "id",
            {"ondelete": "CASCADE"},
            {"primary_key": False},
        )

    @classmethod
    def get_all_by_company_id(cls, company_id):
        return [
            entity.to_dict()
            for entity in cls.query.filter_by(company_id=company_id).all()
        ]


def get_attr(cls, k):
    val = getattr(cls, k)
    if isinstance(val, Enum):
        return val.name
    elif isinstance(val, InstrumentedList):
        return [v.to_dict() for v in val]
    else:
        return val


def to_dict(cls, excluded_fields):
    return {
        snake_to_camel_case(k): get_attr(cls, k)
        for k in cls.__mapper__.all_orm_descriptors.keys()  # inspect(cls).attrs.keys()
        if k not in excluded_fields
    }
