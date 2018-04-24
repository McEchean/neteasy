#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2018/4/23 17:59
# @Author  : Echean
# @File    : neteasy.py
# @Software: PyCharm

import requests
import re
import time
import json

from http import cookiejar

Headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
}

Post_param = {
    'd': 10,
    'domains': '163.com',
    'l': 0,
    'pd': 'mail163',
    'pkid': '',
    'pw':'',
    'pwdKeyUp': '1',
    't':'',
    'tk': '',
    'topURL': "https://mail.163.com/",
    'un': '',
}

class Login_Neteasy_Mail():
    def __init__(self):
        self.session = requests.session()
        self.session.headers =Headers.copy()
        self.session.cookies = cookiejar.LWPCookieJar('cookie.txt')
        self._pkid = self._get_pkid()
        self._token = ''

    def login(self, username, password):
        self._get_init()
        self._token = self._get_token(username)
        Post_param.update({
            'pkid': self._pkid,
            'tk': self._token,
            'un': username,
        })


    def _get_pkid(self):
        pkid_url = 'https://mail.163.com/'
        get_pkid = re.match(r".*?(pkid:'(.*?)').*", self.session.get(url=pkid_url,
                                                                     headers=self.session.headers).text, re.S).group(2)
        return get_pkid

    def _get_token(self, username):
        get_token_url = 'https://dl.reg.163.com/gt?' \
                        'un={0}&' \
                        'pkid={1}&' \
                        'pd=mail163&' \
                        'topURL=https%3A%2F%2Fmail.163.com%2F&' \
                        'nocache={2}'.format(username, self._pkid, int(time.time()*1000))
        return json.loads(self.session.get(url=get_token_url, headers=self.session.headers).text)['tk']

    def _get_init(self):
        self.session.headers.update({
            'Host': 'dl.reg.163.com',
            'Referer': 'https://dl.reg.163.com/webzj/m163_2/pub/index_dl.html?wdaId=&pkid=CvViHzl&product=mail163',
        })
        get_init_utl = 'https://dl.reg.163.com/ini?' \
                       'pd=mail163&' \
                       'pkid={0}&' \
                       'pkht=mail.163.com&' \
                       'topURL=https%3A%2F%2Fmail.163.com%2F&' \
                       'nocache={1}'.format(self._pkid, int(time.time()*1000))
        self.session.get(url=get_init_utl,headers=self.session.headers)



login = Login_Neteasy_Mail()
print(login.login('9838XXXXX4@163.com', 'whf'))
