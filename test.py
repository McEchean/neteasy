#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2018/4/24 18:47
# @Author  : Echean
# @File    : test.py
# @Software: PyCharm

import execjs


def get_js():
    f = open("encrypt.js", 'r', encoding='ISO-8859-1')
    line = f.readline()
    htmlstr = ''
    while line:
        htmlstr = htmlstr + line
        line = f.readline()
    return htmlstr


jsstr = get_js()
ctx = execjs.compile(jsstr)
pw = ctx.call('MP.encrypt2', 'whf454545')
print(pw)