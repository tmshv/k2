from functools import reduce
from pymongo import MongoClient

__author__ = 'tmshv'

"""
Correct 'address' field

"""

mongo = MongoClient()
db = mongo['k2']

BSON_ARRAY = 4

fix_rules_street = [
    ['Обводного набережная канала', 'Набережная Обводного канала'],
    ['проспект Большой ПС', 'Большой проспект П.С.'],
    ['проспект Большой ВО', 'Большой проспект В.О.'],
    ['5-я линия ВО', '5-я линия В.О.'],
    ['6-я линия ВО', '6-я линия В.О.'],
    ['8-я линия ВО', '8-я линия В.О.'],
    ['13-я линия ВО', '13-я линия В.О.'],
    ['14-я линия ВО', '14-я линия В.О.'],
    ['17-я линия ВО', '17-я линия В.О.'],
    ['18-я линия ВО', '18-я линия В.О.'],
    ['20-я линия ВО', '20-я линия В.О.'],
    ['21-я линия ВО', '21-я линия В.О.'],
    ['22-я линия ВО', '22-я линия В.О.'],
    ['23-я линия ВО', '23-я линия В.О.'],
    ['25-я линия ВО', '25-я линия В.О.'],
    ['27-я линия ВО', '27-я линия В.О.'],
    ['Косая линия ВО', 'Косая линия В.О.'],
]


def fix(doc):
    street, n = doc['address'].split(',')

    street = reduce(lambda street, rule: rule[1] if street == rule[0] else street, fix_rules_street, street)

    doc['address'] = '{street}, {n}'.format(street=street, n=n.lower())
    return doc


targets = db.objects.find({})
print('Founded %d records with "address"' % targets.count())


print('Updating')
for doc in map(fix, targets):
    db.objects.update({'_id': doc['_id']}, doc)


print('Done')