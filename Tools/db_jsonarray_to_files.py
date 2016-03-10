import os
import json
import sys
import re

input_file = sys.argv[1]

objects = json.load(open(input_file, 'r'))


def get_cw_filename(i):
	url = i['citywalls']['url']
	n = re.search('(house[\d]+)\.html$', url).group(1)
	return os.path.splitext(n)[0] + '.json'


def street_name(i):
	return i['addresses'][0][0]


for i in objects:
	fname = get_cw_filename(i)
	dname = street_name(i)

	filename = './Objects/{street}/{fname}'.format(street=dname, fname=fname)
	os.makedirs(os.path.dirname(filename), exist_ok=True)

	with open(filename, 'w') as f:
		f.write(json.dumps(i, indent='\t', ensure_ascii=False))
		f.close()

#names = list(map(street_name, objects))
#print('\n'.join(names))
