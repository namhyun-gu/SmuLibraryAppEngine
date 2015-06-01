#!/usr/bin/env python
__author__ = 'namhyun'
import sys
# Import Third Party Library
sys.path.insert(0, 'libs')

import yaml
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


class Crawler:
    service_url = None

    def request_data(self):
        pass


class RoomListCrawler(Crawler):
    Crawler.service_url = 'http://203.237.174.66/domian5.asp'
    room_start_index = 3
    room_size = 6

    def request_data(self):
        url_data = urlfetch.fetch(self.service_url, deadline=DEADLINE_CAPACITY)
        soup = BeautifulSoup(url_data.content, "lxml", from_encoding="euc-kr")

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


class RoomCrawler(Crawler):
    service_url = 'http://203.237.174.66/roomview5.asp?room_no=%d'
    service_room_index = 0
    service_room_object = None

    def set_room(self, room_object, index):
        self.service_room_object = room_object
        self.service_room_index = index

    def request_data(self):
        url_data = urlfetch.fetch(self.service_url % self.service_room_index, deadline=DEADLINE_CAPACITY)
        soup = BeautifulSoup(url_data.content, "lxml", from_encoding="euc-kr")

        seat_list = []
        for seat_index in range(1, self.service_room_object.seat_capacity + 1):
            seat_attr_id = 'Layer%d' % seat_index
            seat_tag = soup.find('div', attrs={'id': seat_attr_id})
            td_tag = seat_tag.find('td')

            seat = Seat().number(seat_index).available(self.is_available(td_tag))
            seat_list.append(seat)
        room_detail_object = RoomDetail().date(Util.get_date()).room(self.service_room_object).seats(seat_list)
        return room_detail_object

    def is_available(self, tag):
        """
        Check seat available from tag 'bgcolor' attribute

        'gray' : available
        'red' : not available

        :param tag:
        :return: boolean
        """
        bgcolor_attr = tag['bgcolor']
        return tag['bgcolor'] == 'gray'
