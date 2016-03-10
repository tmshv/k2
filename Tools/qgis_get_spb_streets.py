# -*- coding: utf-8 -*-

import re

layer = iface.activeLayer()

flist = layer.getFeatures()

swap_rules = [
    ('(.*) улица', 'улица \g<1>'),
    ('(.*) проспект', 'проспект \g<1>'),
    ('(.*) площадь', 'площадь \g<1>'),
]

out = open('/Users/tmshv/osm_addresses.txt', 'wb')


for feature in flist:
    street = feature['A_STRT']
    num = feature['A_HSNMBR']
    id = str(int(feature['OSM_ID']))

    if street and num:
        out_street = street.encode('utf-8')
        #for rule in swap_rules:
        #    out_street = re.sub(rule[0], rule[1], out_street)
        
        out.write(out_street)
        out.write('\t')
        out.write(num.encode('utf-8'))
        out.write('\t')
        out.write(id)
        out.write('\n')
        
out.close()