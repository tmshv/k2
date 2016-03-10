"""
Usage:
python3 osm_geometry_to_redis.py <redis_host> <redis_port> <geometry_file>

Example:
python3 osm_geometry_to_redis.py localhost 6379 osm_geometry.json

"""
from functools import reduce
import json


def recursive_reverse(geom):
    def fn(list, item):
        r = recursive_reverse(item)
        list.append(r)
        return list

    if type(geom[0]) is float:
        return list(reversed(geom))

    return reduce(fn, geom, [])


def to_feature(i):
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': recursive_reverse(i['geometry'])
        },
        'properties': {
            'OSM_ID': i['OSM_ID'],
            'type': i['function'],
            'architects': i['architects'],
            'year': i['years'],
            'name': i['name'],
            'address': i['address'],
            'citywallsUrl': i['citywalls']['url'],
        }
    }

j = json.load(open('k2_objects.json', 'r'))
geojson = {
    'type': 'FeatureCollection',
    'features': list(map(to_feature, j))
}

json.dump(geojson, open('k2_features.geojson', 'w'), ensure_ascii=False, indent=4)
