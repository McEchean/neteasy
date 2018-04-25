#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2018/4/24 18:47
# @Author  : Echean
# @File    : test.py
# @Software: PyCharm

# import execjs
#
#
# def get_js():
#     f = open("encrypt.js", 'r', encoding='ISO-8859-1')
#     line = f.readline()
#     htmlstr = ''
#     while line:
#         htmlstr = htmlstr + line
#         line = f.readline()
#     return htmlstr
#
#
# jsstr = get_js()
# ctx = execjs.compile(jsstr)
# pw = ctx.call('MP.encrypt2', 'whf454545')
# print(pw)

import requests
import json

session = requests.session()

Headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    'Content-Length': '377',
    'Content-Type': 'application/json',
    'Cookie': 'starttime=; webzjcookiecheck=1; c98xpt_=30; _ihtxzdilxldP8_=30; l_s_mail163CvViHzl=2BDA1093FDDA9283AD02B57FFFEC7E0E248C665EC4BD4EE3D6EE49E2E12AFE3F13B9532FF4F2425CF0C0882767340A0DBCA8A9D75E74384B18886910685B9A89979A8FBA1FABB7B5AE5696049516591725D38AA7B59DDF9E33CEAAAF02AB4E49DC23E099BAB187057B7F68A5DDC0F53A; JSESSIONID-WYTXZDL=kcGOsa0MEP51UuSbXqSn%5CxvLjFKYekL2Md%5C%5CuaVMmER9H7UmOEmfPqJ1NqMMcWkKOd%2FaJKPnyy3a%5CwhjhmnFKH79Qa%2BA61Hy20wyjpNh%5C3SomVlZzXY7WesZuyD%2Bct8RZle1zav4VfLk%5CRlz3uag2u8KvKjfmaS3RsVI%2BYePWIWznxE9%3A1524631506997; jsessionid-cpta=%2BKPpx%2FNmuEKVqnNjvxKE%2BMg%2FF72EyDnAli6SfDvE%2BB7ZBy%2BWoVygj80tJ16vIwazwx%5C2BlmJcHitYWOk1Ec%2BoT9qM7CPtqtSleZ%2FwVnLipIfDRwwPOl%5CCGU%2BJ1OZbCb9LioqgOX3UE%2FOKHNV%2F%5CEQAGLc8FQHrM%2B6mOWDm8z6bQaKxBqE%3A1524631865046',
    'Host': 'dl.reg.163.com',
    'Origin': 'https://dl.reg.163.com',
    'Referer': 'https://dl.reg.163.com/webzj/m163_2/pub/index_dl.html?wdaId=&pkid=CvViHzl&product=mail163',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',

}

request_url = 'https://dl.reg.163.com/l'
request_data = {
    'd': 10,
    'domains': '163.com',
    'l': 0,
    'pd': 'mail163',
    'pwdKeyUp': '1',
    'topURL': 'https://mail.163.com/',
    'pkid': 'CvViHzl',
    'tk': '4518fbe5ac6f8ea606c75ebd1dffdf6e',
    'un': 'wy983821194@163.com',
    't': 1524630976135,
    'pw': 'V+pwW+EQNP1ARCXQqQROuBgzhjv98vsYWgKr7HhGftUyoP6rYFaOUJJppTGlbKwNP+XuBj8x3q127VMi5iY/WX0/T2e9pamg/7d4yig+q5BkDHDz/gmVeo4WFitfLvCyCKAh3HKcWDfOxyO+lVaVdM8bHt2kIQspUvAwI7zaBuA= '
}

resp = session.post(request_url, data=json.dumps(request_data), headers=Headers)
print(resp.text)

