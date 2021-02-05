from sqlalchemy import Column, String, DateTime
import uuid
import datetime


def ID():
    return Column("id", String(36), default=lambda: str(uuid.uuid4()), primary_key=True)


def created_at():
    return Column(DateTime, default=datetime.datetime.utcnow)
