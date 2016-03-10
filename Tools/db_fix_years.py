from functools import reduce
from pymongo import MongoClient

__author__ = 'tmshv'

"""
Correct 'years' field.
Transform '1911-1951, 1953' -> [[1911, 1951], [1953]]

"""


def periods(raw):
    """
    Transform '1911-1951, 1953' -> [[1911, 1951], [1953]]
    :param raw: string like '1911-1951, 1953'
    :return: list like [[1911, 1951], [1953]]
    """

    def raw_period(period):
        if '-' in period:
            return tuple(map(lambda year: int(year), period.split('-')))
        else:
            return int(period)

    if type(raw) != str:
        return []

    return list(map(raw_period, raw.split(',')))


mongo = MongoClient()
db = mongo['k2']

BSON_ARRAY = 4
BSON_STRING = 2


def fix(doc):
    doc['years'] = periods(doc['years'][0])
    return doc


# targets = db.objects.find({'years': {'$type': BSON_STRING}})
targets = db.objects.find({'$where': 'typeof this.years[0] === "string"'})
print('Founded %d records with stringed "years" field' % targets.count())

print('Updating')
for doc in map(fix, targets):
    # print(doc['years'])
    db.objects.update({'_id': doc['_id']}, doc)

print('Done')
