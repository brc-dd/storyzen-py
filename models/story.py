from mongoengine.document import Document, EmbeddedDocument
from mongoengine.fields import (DictField, EmbeddedDocumentField, ListField,
                                LongField, StringField)


class Block(EmbeddedDocument):
    type = StringField(required=True)
    data = DictField(required=True)


class Story(Document):
    uid = StringField(primary_key=True, max_length=64, min_length=16)
    time = LongField(required=True)
    blocks = ListField(EmbeddedDocumentField(Block), required=True)
    version = StringField(required=True)
