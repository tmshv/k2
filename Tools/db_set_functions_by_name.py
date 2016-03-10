from functools import reduce
from pymongo import MongoClient
import re

__author__ = 'tmshv'

"""
Correct 'address' field

"""

mongo = MongoClient()
db = mongo['k2']

rules = [
    [{'function': {'$exists': False}}, {'function': 'unknown'}],

    [{'function': 'unknown', 'name': re.compile('[Дд]етский сад')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('школа')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('^Школа')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('барачная больница')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('^.бщежитие|бщежитие$')}, {'function': 'living'}],
    [{'function': 'unknown', 'name': re.compile('[Кк]отельная')}, {'function': 'service'}],
    [{'function': 'unknown', 'name': re.compile('[Бб]ольница')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('[Сс]тадион')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('[Ии]нститут')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('[Уу]ниверситет')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('^[Зз]авод')}, {'function': 'production'}],
    [{'function': 'unknown', 'name': re.compile('[Фф]абрика')}, {'function': 'production'}],
    [{'function': 'unknown', 'name': re.compile('[Дд]ворец')}, {'function': 'public'}],
    [{'function': 'unknown', 'name': re.compile('подстан')}, {'function': 'service'}],
    [{'function': 'unknown', 'name': re.compile('училище')}, {'function': 'social'}],
    [{'function': 'unknown', 'name': re.compile('[Сс]клад')}, {'function': 'service'}],

    [{'name': "Пожарная часть на заводе \"Красный Треугольник\""}, {'function': 'service'}],
    [{'name': "Ленполиграфмаш. Заводоуправление - Бизнес-центр \"Карповка\""}, {'function': 'public'}],
    [{'name': "Дворец культуры им. В. И. Ленина завода \"Большевик\""}, {'function': 'public'}],
    [{'name': "Школа . Флигель - Магазин автозапчастей \"ABS-Сервис\""}, {'function': 'service'}],
    [{'name': 'Общежитие - Здание общественного назначения'}, {'function': 'admin'}],
    [{'name': "Электростанция \"Уткина заводь\" - ГРЭС \"Красный Октябрь\" - ТЭЦ-5"}, {'function': 'service'}],
    [{'name': "Водонапорная башня гидролизного завода"}, {'function': 'service'}],
]


for rule in rules:
    query, update = rule

    db.objects.update_many(query, {'$set': update})

    # m = db.objects.find(query)
    # print(rule)
    # print(m.count())
    # print()


print('Done')
