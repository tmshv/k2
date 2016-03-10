from functools import reduce
from pymongo import MongoClient
import osm_address

__author__ = 'tmshv'

"""
Populate documents with OSM_ID by matching document address & osm_features.tsv

"""

mongo = MongoClient()
db = mongo['k2']

osm_dict = osm_address.get_streets_dict()


def find_osm_id(doc):
    street, n = doc['address'].split(',')
    street = street.lower()
    n = n.strip()

    if street in osm_dict:
        osm_nums = osm_dict[street]

        if n in osm_nums:
            return 'WOW'
        else:
            pass
            print(street, n, osm_nums)
    else:
        pass
        # print('no street', street)

    # for osm in osm_address.addresses:
    #     osm_street, osm_n, osm_id = osm
    #
    #     if street == osm_street:
    #         if n == osm_n:
    #             return osm_id

    return None


targets = db.objects.find({'osm_id': {'$exists': False}})
print('Founded %d records with no OSM_ID' % targets.count())

targets = list(targets)[:100]
# print('Updating')

# print(osm_dict.keys())
# print('22-я линия В.О.' in osm_dict.keys())

for doc in targets:
    osm_id = find_osm_id(doc)

    if osm_id is not None:
        print(doc['name'])


# print('Done')
