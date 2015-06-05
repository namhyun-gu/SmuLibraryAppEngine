#!/usr/bin/env python
import warnings

__author__ = 'namhyun'
import sys
# Import Third Party Library
sys.path.insert(0, 'libs')

import yaml
import json
import keys
from lxml import html
import logging
import time
from datetime import datetime, timedelta, tzinfo
from bs4 import BeautifulSoup
from models import Room, RoomDetail, RoomList, Seat
from google.appengine.api import urlfetch, memcache

# urlfetch config
DEADLINE_CAPACITY = 5


class KST(tzinfo):
    def utcoffset(self, date_time):
        return timedelta(hours=9)

    def dst(self, date_time):
        return timedelta(0)

    def tzname(self, date_time):
        return "(UTC+09:00)"


class Util:
    @staticmethod
    def get_date():
        timezone_kst = KST()
        return datetime.now(timezone_kst).strftime('%Y-%m-%d %H:%M')

class Timer:
    start_time = None

    def __init__(self):
        self.start_time = time.time()
        pass

    def stop(self):
        return time.time() - self.start_time

    def start(self):
        self.start_time = time.time()

class Observable:
    crawler = None
    cache_key = None

    def __init__(self, crawler, key):
        self.crawler = crawler
        self.cache_key = key
        self.__observe()

    def __observe(self):
        crawler_data = self.crawler.request_data()

        cache_data = memcache.get(self.cache_key)
        cache_json_object = yaml.load(cache_data)

        if isinstance(self.crawler, RoomListCrawler):
            pass

class RoomListCrawler:
    # Service URL
    service_url = 'http://203.237.174.66/domian5.asp'
    urlfetch_object = None

    # Crawler Config
    room_start_index = 3
    room_size = 6

    def fetch(self):
        self.urlfetch_object = urlfetch.fetch(self.service_url, deadline=DEADLINE_CAPACITY)
        return self

    def request_data(self):
        if self.urlfetch_object is None:
            return None

        soup = BeautifulSoup(self.urlfetch_object.content, "lxml", from_encoding="euc-kr")
        room_list = []
        tr_tags = soup.find_all('tr')
        for index in range(self.room_start_index, self.room_start_index + self.room_size):
            font_tag = tr_tags[index].find_all('font')

            room = Room().room_name(font_tag[1].text) \
                .capacity(font_tag[2].text) \
                .used(font_tag[3].text) \
                .caculate()
            room_list.append(room)
        room_list_object = RoomList().size(self.room_size).date(Util.get_date()).rooms(room_list)
        return room_list_object

class RoomDetailCrawler:
    # Service URL
    service_url = 'http://203.237.174.66/roomview5.asp?room_no=%d'
    urlfetch_object = None

    # Crawler Config
    room_index = 0
    room_object = None

    def set_room(self, room_object, index):
        self.room_object = room_object
        self.room_index = index

    def fetch(self):
        self.urlfetch_object = urlfetch.fetch(self.service_url % self.room_index, deadline=DEADLINE_CAPACITY)
        return self

    def request_data(self):
        if self.urlfetch_object is None:
            return None

        tree = html.fromstring(self.urlfetch_object.content)
        seat_list = []
        for seat_index in range(1, self.room_object.seat_capacity + 1):
            seat_attr_id = 'Layer%d' % seat_index
            seat_tag = tree.xpath("//div[@id='%s']" % seat_attr_id)
            table_tag = seat_tag[0].getchildren()[0]
            tr_tag = table_tag.getchildren()[0]
            td_tag = tr_tag.getchildren()[0]
            seat = Seat().number(seat_index).available(self.is_available(td_tag))
            seat_list.append(seat)
        room_detail_object = RoomDetail().date(Util.get_date()).room(self.room_object).seats(seat_list)
        return room_detail_object

    def is_available(self, tag):
        """
        Check seat available from tag 'bgcolor' attribute

        'gray' : available
        'red' : not available

        :param tag:
        :return: boolean
        """
        bgcolor_attr = tag.attrib['bgcolor']
        return bgcolor_attr == 'gray'