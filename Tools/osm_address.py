import re
import street_utils

__author__ = 'tmshv'

osm_file = open('osm_addresses.txt', 'r')

addresses = map(
    lambda i: i.split('\t'),
    osm_file.readlines()
)

# addresses = map(
#     lambda i: (re.sub('ё', 'е', i[0]), i[1], i[2].strip()),
#     addresses
# )
#
# addresses = map(
#     lambda i: (street_utils.address_to_lead_street_type(i[0]), i[1], i[2]),
#     addresses
# )


def get_streets_dict():
    dump = {}
    for addr in addresses:
        street, num, id = addr
        street = street.lower()
        num = num.lower()
        # num = addr[1]
        if street in dump:
            dump[street].append(num)
        else:
            dump[street] = [num]
    return dump


if __name__ == '__main__':
    for osm_addr in addresses:
        osm_street = osm_addr[0]
        osm_num = osm_addr[1].lower()
        print(osm_addr[2])

    streets = get_streets_dict()
    for s in streets:
        print(s, streets[s])
