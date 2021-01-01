import traceback
import uuid

from slugify import slugify


def generate_uid(data: dict) -> str:
    try:
        uid = slugify(data['blocks'][0]['data']['text'], max_length=54)
        if len(uid) < 6:
            raise Exception('very short uid')
        return uid + ('-' if uid[-1] != '-' else '') + str(data['time'])[4:]
    except:
        traceback.print_exc()
        return uuid.uuid4().hex