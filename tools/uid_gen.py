import shortuuid

from slugify import slugify


def generate_uid(data: dict) -> str:
    shortuuid.set_alphabet("23456789abcdefghijkmnopqrstuvwxyz")
    uid = ''
    try:
        uid = slugify(data['blocks'][0]['data']['text'], max_length=64)
    except:
        pass
    return uid + ('-' if uid else '') + shortuuid.uuid()
