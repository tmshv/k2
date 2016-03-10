from copy import copy
from functools import reduce
from pymongo import MongoClient

__author__ = 'tmshv'

"""
Transform all documents in localhost/k2 mongo database what contains multiple addresses to single addresses.
Each document clones with own address.

OSM ID which is optional 3rd item in address record is moving to 'osm_id' field.

'address' is str type

"""

mongo = MongoClient()
db = mongo['k2']

BSON_ARRAY = 4


def flatten(doc):
    def _(address):
        osm_id = address[2] if len(address) is 3 else None
        new_doc = copy(doc)
        del new_doc['_id']

        address[1] = str(address[1])
        if osm_id is not None:
            del address[2]
            new_doc['osm_id'] = osm_id

        new_doc['address'] = ', '.join(address)
        return new_doc

    return list(map(_, doc['address']))


targets = db.objects.find({'address': {'$type': BSON_ARRAY}})
targets = list(targets)

print('Founded %d records where "address" is an array' % len(targets))

if len(targets) > 0:
    new_docs = reduce(lambda nd, doc: nd + flatten(doc), targets, [])

    print('Founded records transformed to %d documents' % len(new_docs))

    print('Removing old records')
    db.objects.remove({
        '_id': {
            '$in': list(map(
                lambda doc: doc['_id'],
                targets))
        }
    })

    print('Inserting new records')

    for doc in new_docs:
        db.objects.insert(doc)

print('Done')


# for doc in targets:
#     print(new_doc)
    # db.objects.insert(new_doc)

    # db.objects.remove({'_id': doc['_id']})
