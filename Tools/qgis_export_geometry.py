import json
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


with open('/Users/tmshv/osm_poly.min.json', 'w') as out:
    d = {}
    for feature in flist:
        id = int(feature['OSM_ID'])

        poly = feature.geometry().asPolygon()
        poly = listify(poly)

        d[id] = poly
    out.write(json.dumps(d, indent=None))
    out.close()