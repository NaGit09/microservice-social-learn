from mongoengine import (
    Document,
    StringField,
    DateTimeField,
    EmbeddedDocument,
    EmbeddedDocumentField,
    IntField,
)


class Avatar(EmbeddedDocument):
    fileId = StringField(required=True)
    fileName = StringField()
    url = StringField(required=True)
    type = StringField()


class User(Document):
    username = StringField(required=True, unique=True)
    fullname = StringField(required=True)
    bio = StringField()
    avatar = EmbeddedDocumentField(Avatar)
    createdAt = DateTimeField()
    updatedAt = DateTimeField()
    __v = IntField()

    meta = {
        "collection": "users",
        "indexes": ["username"],
        "ordering": ["-pk"],
        "strict": False,
    }
