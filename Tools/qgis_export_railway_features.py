# -*- coding: utf-8 -*-

import re
import os
import json

out_filename = os.path.expanduser('~/osm_railway_features.geojson')

layer = iface.activeLayer()

# features = layer.getFeatures()
features = layer.selectedFeatures()

properties = [('OSM_ID', int), 'NAME', 'RAILWAY', 'GAUGE', 'SERVICE', 'BRIGDE', 'TUNNEL']

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


def geometry(feature, type):
    return { 
        'type': type,
        'coordinates': listify(getattr(feature.geometry(), 'as{0}'.format(type))())
    }


def to_feature(feature):
    props = {}
    for i in properties:
        if type(i) is str:
            props[i] = get_field(feature, i)
        elif type(i) is tuple:
            props[i[0]] = get_field(feature, i[0], i[1])
    
    return {
        'type': 'Feature',
        'properties': props,
        'geometry': geometry(feature, 'Polyline')
    }


geojson = {
    'type': 'FeatureCollection',
    'features': list(map(to_feature, features))
}

with open(out_filename, 'w') as out:
    j = json.dumps(geojson, indent=4, ensure_ascii=False)
    out.write(j.encode('utf-8'))
    out.close()