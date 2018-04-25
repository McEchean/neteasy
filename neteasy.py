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
import execjs
import logging

from http import cookiejar

logging.basicConfig(level=logging.INFO)

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
    'pwdKeyUp': 1,
    'topURL': "https://mail.163.com/",
}


class Login_Neteasy_Mail():
    def __init__(self):
        self.session = requests.session()
        self.session.headers = Headers.copy()
        self.session.cookies = cookiejar.LWPCookieJar('cookie.txt')
        self._pkid = self._get_pkid()
        self._token = ''
        self._pw = ''

    def login(self, username, password):
        self._get_init()
        self._token = self._get_token(username)
        self._pw = self._get_pwd(password)
        Post_param.update({
            'pkid': self._pkid,
            'tk': self._token,
            'un': username,
            't': int(time.time() * 1000),
            'pw': self._pw,
        })
        login_url = 'https://dl.reg.163.com/l'
        self.session.headers.update({
            'Origin': 'https://dl.reg.163.com',
            'Content-Type': 'application/json',
        })
        s = json.dumps(Post_param)
        login_resp = self.session.post(url=login_url, data=s, headers=self.session.headers)
        # self.session.cookies.save(ignore_discard=True, ignore_expires=True)
        return login_resp.text

    def _get_pkid(self):
        pkid_url = 'https://mail.163.com/'
        get_pkid = re.match(r".*?(pkid:'(.*?)').*", self.session.get(url=pkid_url,
                                                                     headers=self.session.headers).text, re.S).group(2)
        logging.info('get_pkid: %s' % get_pkid)
        return get_pkid

    def _get_token(self, username):
        get_token_url = 'https://dl.reg.163.com/gt?' \
                        'un={0}&' \
                        'pkid={1}&' \
                        'pd=mail163&' \
                        'topURL=https%3A%2F%2Fmail.163.com%2F&' \
                        'nocache={2}'.format(username, self._pkid, int(time.time() * 1000))
        get_token_resp = self.session.get(url=get_token_url, headers=self.session.headers)
        logging.info('get_token_resp: %s' % get_token_resp.text)
        return json.loads(get_token_resp.text)['tk']

    def _get_init(self):
        # self.session.headers.update({
        #     'Host': 'mail.163.com',
        #     'Referer': 'http://mail.163.com/logout.htm',
        # })
        # mail163_url = 'https://mail.163.com/'
        # mail163_resp = self.session.get(url=mail163_url, headers=self.session.headers)
        # logging.info('mail163_resp: %s' % mail163_resp.status_code)
        self.session.headers.update({
            'Host': 'dl.reg.163.com',
            'Referer': 'https://mail.163.com/',
        })
        conf_init_url = 'https://dl.reg.163.com/getConf?callback=URSJSONP{0}&pkid=CvViHzl&pd=mail163&mode=1' \
            .format(int(time.time() * 1000))
        conf_init_resp = self.session.get(url=conf_init_url, headers=self.session.headers)
        logging.info('conf_init_resp: %s' % conf_init_resp.text)
        self.session.headers.update({
            'Host': 'ir3.mail.163.com',
        })
        get_do_url = 'https://ir3.mail.163.com/get.do?prod=wmail_lbp&ver=1&uid=wy983821194@163.com&' \
                     'domain=163.com&mobUser=0&callback=sing_{0}'.format(int(time.time() * 10000000))
        get_do_resp = self.session.get(url=get_do_url, headers=self.session.headers)
        logging.info('get_do_resp: %s' % get_do_resp.text)
        self.session.headers.update({
            'Host': 'ir.mail.163.com',
        })
        get_do2_url = 'https://ir.mail.163.com/get.do?uid=nt@163.com&domain=163.com&ver=4&ph=-1&' \
                      'callback=sing_{0}'.format(int(time.time() * 10000000))
        get_do2_resp = self.session.get(url=get_do2_url, headers=self.session.headers)
        logging.info('get_do2_resp: %s' % get_do2_resp.text)
        self.session.headers.update({
            'Host': 'dl.reg.163.com',
            'Referer': 'https://dl.reg.163.com/webzj/m163_2/pub/index_dl.html?wdaId=&pkid=CvViHzl&product=mail163',
        })
        get_init_url = 'https://dl.reg.163.com/ini?' \
                       'pd=mail163&' \
                       'pkid={0}&' \
                       'pkht=mail.163.com&' \
                       'topURL=https%3A%2F%2Fmail.163.com%2F&' \
                       'nocache={1}'.format(self._pkid, int(time.time() * 1000))
        _init_resp = self.session.get(url=get_init_url, headers=self.session.headers)
        logging.info('_init_resp: %s' % _init_resp.text)

    def _get_js(self):
        f = open("encrypt.js", 'r', encoding='ISO-8859-1')
        line = f.readline()
        htmlstr = ''
        while line:
            htmlstr = htmlstr + line
            line = f.readline()
        return htmlstr

    def _get_pwd(self, pwd):
        jsstr = self._get_js()
        ctx = execjs.compile(jsstr)
        return ctx.call('MP.encrypt2', pwd)


login = Login_Neteasy_Mail()
print(login.login('wy983821194@163.com', 'whf454545'))
