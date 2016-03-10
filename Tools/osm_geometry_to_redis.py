"""
Usage:
python3 osm_geometry_to_redis.py <redis_host> <redis_port> <geometry_file>

Example:
python3 osm_geometry_to_redis.py localhost 6379 osm_geometry.json

"""

import redis
import sys
import json

host = sys.argv[1]
port = sys.argv[2]
fname = sys.argv[3]

j = json.load(open(fname, 'r'))

client = redis.StrictRedis(host=host, port=port)


def reverse_leaf(items):
    if len(items) is 0:
        return items

    if type(items[0]) is float:
        return [items[1], items[0]]
    return list(map(reverse_leaf, items))


for i in j:
    key = i['osm_id']
    value = i['geometry']
    value = reverse_leaf(value)
    client.set(key, value)
