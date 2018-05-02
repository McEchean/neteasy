#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2018/5/2 10:29
# @Author  : Echean
# @File    : neteasy2.py
# @Software: PyCharm

import requests
from http import cookiejar
import re

session = requests.Session()
session.cookies = cookiejar.LWPCookieJar('cookie.txt')
username = input('请输入邮箱名(省略@163.com)：')
password = input('请输入密码：')

session.headers = {
    'Host': 'reg.163.com',
    'Connection': 'keep-alive',
    'Content-Length': '176',
    'Cache-Control': 'max-age=0',
    'Origin': 'https://www.baidu.com',
    'Upgrade-Insecure-Requests': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&'
               'wd=%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1&rsv_pq=fe0b54af0000d9f1&'
               'rsv_t=5671fD3s24OCfvU%2FWGMuHK2zSpw%2BdB0p07HnpShr2IFciArvBD%2F6cuYHP48&rqlang=cn&'
               'rsv_enter=1&rsv_sug3=14&rsv_sug1=8&rsv_sug7=100',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
}

login_url = 'https://reg.163.com/logins.jsp'
post_param = {
    'username': username,
    'url':	'http://entry.mail.163.com/coremail/fcg/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=-1',
    'password': password,
}

login_resp = session.post(url=login_url, data=post_param, headers=session.headers, verify=True)
Set_Cookie = login_resp.headers.get('Set-cookie', '')
LoginCookie = re.match(r'.*?(NTES_SESS=([^;]+)).*', Set_Cookie, re.DOTALL).group(2)
sinfoCookie = re.match(r'.*?(S_INFO=([^;]+)).*', Set_Cookie, re.DOTALL).group(2)
pinfoCookie = re.match(r'.*?(P_INFO=([^;]+)).*', Set_Cookie, re.DOTALL).group(2)
antiCSRFCookie = re.match(r'.*?(ANTICSRF=([^;]+)).*', Set_Cookie, re.DOTALL).group(2)

post_param2 = {
    'username': username,
    'loginCookie': LoginCookie,
    'sInfoCookie': sinfoCookie,
    'pInfoCookie': pinfoCookie,
    'antiCSRFCookie': antiCSRFCookie,
    'checkCookieTime': '1',
    'next': 'youdao.com',
    'url': 'http://entry.mail.163.com/coremail/fcg/ntesdoor2?'
           'username={0}&lightweight=1&verifycookie=1&language=-1&style=-1'.format(username)
}
session.headers={

}
session.headers.update({
    'Host': 'passport.youdao.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': 'https://reg.163.com/logins.jsp',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
})

get_youdao_url = 'https://passport.youdao.com/next.jsp'
get_youdao_resp = session.get(url=get_youdao_url, params=post_param2, headers=session.headers, allow_redirects=False, verify=True)
get_entry_url = get_youdao_resp.headers['Location']
session.headers={

}
session.headers.update({
    'Host': 'entry.mail.163.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
})
get_entry_resp = session.get(url=get_entry_url, headers=session.headers, allow_redirects=False)
get_login_url = get_entry_resp.headers['Location']
session.headers={

}
session.headers.update({
    'Host': 'mail.163.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
})
get_login_resp = session.get(url=get_login_url, headers=session.headers)
if username + '@163.com' in get_login_resp.text:
    print('成功登陆')


