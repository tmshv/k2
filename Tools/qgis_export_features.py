# -*- coding: utf-8 -*-

import re
import os
import json

out_filename = os.path.expanduser('~/osm_features.geojson')

layer = iface.activeLayer()
flist = layer.getFeatures()


def listify(i):
    try:
        iterator = list(i)
        out = []
        for item in iterator:
            out.append(listify(item))
        return out
    except:
        return i


def get_field(feature, key, cast=None):
    try:
        value = feature[key]
        value = value if cast is None else cast(value)
        value = value if type(value) is unicode else unicode(value)
        value = None if value == u'NULL' else value
        return value
    except KeyError:
        return None


def to_feature(feature):
    props = {
        'OSM_ID': get_field(feature, 'OSM_ID', int),
        'BUILDING': get_field(feature, 'BUILDING'),
        'A_STRT': get_field(feature, 'A_STRT'),
        'A_HSNMBR': get_field(feature, 'A_HSNMBR'),
        'LEVELS': get_field(feature, 'B_LEVELS'),
        'NAME': get_field(feature, 'NAME'),
        'A_SBRB': get_field(feature, 'A_SBRB')
    }

    geom = { 
        'type': 'Polygon',
        'coordinates': listify(feature.geometry().asPolygon())
    }

    return {
        'type': 'Feature',
        'properties': props,
        'geometry': geom
    }


geojson = {
    'type': 'FeatureCollection',
    'features': list(map(to_feature, flist))
}

with open(out_filename, 'w') as out:
    j = json.dumps(geojson, indent=4, ensure_ascii=False)
    out.write(j.encode('utf-8'))
    out.close()