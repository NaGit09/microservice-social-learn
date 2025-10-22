# src/models/profile.py
from mongoengine import Document, StringField, ListField, IntField


class Profile(Document):
    _id = StringField(primary_key=True)
    school = StringField(default="Nong Lam University")
    major = StringField(default="information technology")
    class_name = StringField(default="DH22DTA")
    year = IntField(default=1)
    references = ListField(StringField())
    hometown = StringField(default="Ho Chi Minh city")
    hobby = ListField(StringField())

    meta = {"collection": "profiles", "strict": False}
