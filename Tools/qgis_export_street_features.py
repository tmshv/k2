# -*- coding: utf-8 -*-

import re
import os
import json

out_filename = os.path.expanduser('~/osm_features.geojson')

layer = iface.activeLayer()

# features = layer.getFeatures()
features = layer.selectedFeatures()

properties = [('OSM_ID', int), 'NAME', 'REF', 'HIGHWAY', 'ONEWAY', 'BRIGDE', 'TUNNEL', 'MAXSPEED', 'LANES', 'WIDTH', 'SURFACE']
properties = []

def listify(i):
    try:
        iterator = list(i)
        out = []
        for item in iterator:
            out.append(listify(item))
        return out
    except:
        p = transform(i)
        return list(p)


def get_field(feature, key, cast=None):
    try:
        value = feature[key]
        value = value if cast is None else cast(value)
        value = value if type(value) is unicode else unicode(value)
        value = None if value == u'NULL' else value
        return value
    except KeyError:
        return None


def transform(point):
    crs4326 = QgsCoordinateReferenceSystem(4326)
    crs3857 = QgsCoordinateReferenceSystem(3857)
    t = QgsCoordinateTransform(crs3857, crs4326)
    p = QgsPoint(point[0], point[1])
    return t.transform(p)
    

def geometry(feature, type):
    m = 'as{0}'.format(type)
    g = getattr(feature.geometry(), m);
    return { 
        'type': type,
        'coordinates': listify(g())
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