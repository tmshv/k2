import re

__author__ = 'tmshv'


def address_to_lead_street_type(address):
    rules = [
        ('ул\.', 'улица'),
        ('пр\.', 'проспект'),
        ('пер\.', 'переулок'),
        ('пл\.', 'площадь'),
        ('наб\.к\.', 'набережная канала'),
        # ('(.*) набережная канала', 'Набережная \g<1> канала'),
        ('наб\.', 'набережная'),
        ('(.*) улица', 'улица \g<1>'),
        ('(.*) проспект', 'проспект \g<1>'),
        ('(.*) площадь', 'площадь \g<1>'),
        ('(.*) переулок', 'переулок \g<1>'),
    ]

    out = address
    for rule in rules:
        out = re.sub(rule[0], rule[1], out)

    return out


def address_numbers_to_int(numbers, ignore_failed=False):
    def convert(value):
        try:
            return int(value)
        except ValueError:
            return value

    numbers = list(map(convert, numbers))
    if ignore_failed:
        numbers = list(filter(
            lambda i: type(i) == int,
            numbers
        ))
    return numbers


def range_address_number(num, include_last=True):
    """
    '5-7' -> [5, 6, 7]
    '5' -> ['5']
    :param num:
    :return:
    """

    range_re = re.search('(\d+)-(\d+)', num)
    if range_re:
        min, max = list(map(
            lambda i: int(i),
            list(range_re.groups())
        ))

        max = max + 1 if include_last else max
        return list(range(min, max))
    else:
        return [num]


def filter_evenness_by_first(input):
    """
    [5, 6, 7] -> [5, 7]
    [4, 5, 6, 7] -> [4, 6]
    :return:
    """
    f = input[0]
    if f % 2 == 0:
        return filter_even(input)
    else:
        return filter_odd(input)


def filter_odd(input):
    """
    [5, 6, 7] -> [5, 7]
    :return:
    """

    return list(filter(
        lambda i: i % 2 == 1,
        input
    ))


def filter_even(input):
    """
    [5, 6, 7] -> [6]
    :return:
    """

    return list(filter(
        lambda i: i % 2 == 0,
        input
    ))


if __name__ == '__main__':
    print("range_address_number('2-20')", range_address_number('2-20'))
    print("range_address_number('2-20', include_last=False)", range_address_number('2-20', include_last=False))
    print("range_address_number('2')", range_address_number('2'))

    print(filter_odd(range_address_number('2-20', include_last=False)))
    print(filter_even(range_address_number('2-20', include_last=False)))

    print(filter_evenness_by_first(range_address_number('2-20')))
    print(filter_evenness_by_first(range_address_number('3-20')))