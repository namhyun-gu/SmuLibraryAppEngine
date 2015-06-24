#!/usr/bin/env python
__author__ = 'namhyun'
import keys
import json
import time
import logging
import crawler
from datetime import datetime, timedelta, tzinfo
from models import *
from google.appengine.api import memcache


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
        return datetime.now(KST()).strftime('%Y-%m-%d %H:%M')

    @staticmethod
    def to_json(data):
        return json.dumps(data, ensure_ascii=False, default=lambda o: o.__dict__)

    @staticmethod
    def from_json(json_data, type):
        json_object = json.loads(json_data)
        if type == RoomList:
            room_lists = []
            room_lists_data = json_data['room_list']
            for room_info in room_lists_data:
                room_object = Room()
                room_object.name = room_info['name']
                room_object.seat_capacity = room_info['seat_capacity']
                room_object.used_seat = room_info['used_seat']
                room_object.available_seat = room_info['available_seat']
                room_lists.append(room_object)

            room_list_object = RoomList()
            room_list_object.update_date = json_data['update_date']
            room_list_object.room_list = room_lists
            room_list_object.room_size = json_data['room_size']
            return room_list_object

        elif type == RoomDetail:
            seat_lists = []
            seat_lists_data = json_object['seat_list']
            for seat_data in seat_lists_data:
                seat_object = Seat()
                seat_object.seat_number = seat_data['seatNumber']
                seat_object.is_available = seat_data['is_available']
                seat_lists.append(seat_object)

            room_data = json_object['room_object']
            room_object = Room()
            room_object.name = room_data['name']
            room_object.seat_capacity = room_data['seat_capacity']
            room_object.used_seat = room_data['used_seat']
            room_object.available_seat = room_data['available_seat']

            room_detail_object = RoomDetail()
            room_detail_object.update_date = json_object['update_date']
            room_detail_object.room_object = room_object
            room_detail_object.seat_list = seat_lists
            return room_detail_object


class Timer:
    start_time = None

    def __init__(self):
        self.start_time = time.time()

    def stop(self):
        return time.time() - self.start_time

    def start(self):
        self.start_time = time.time()


class ObserveService:
    observe_data = None
    observe_type = None
    observe_room_index = None

    def __init__(self, observe_data, type, room_index=None):
        self.observe_data = observe_data
        self.observe_type = type
        self.observe_room_index = room_index

    def observe(self):
        if self.observe_type == crawler.RoomListCrawler:
            memcache_data = memcache.get(keys.ROOM_LIST_KEY)
            if memcache_data is None:
                return
            room_list_object = Util.from_json(memcache_data, RoomList)

            # logging.info(room_list_object)

        elif self.observe_type == crawler.RoomDetailCrawler:
            if self.observe_room_index is None:
                return
            memcache_data = memcache.get(keys.ROOM_KEY % self.observe_room_index)
            if memcache_data is None:
                return
            observe_seat_list = Util.from_json(memcache_data, RoomDetail).seat_list
            cached_seat_list = observe_seat_list
            changed_seat_list = []
            for index in range(0, len(cached_seat_list)):
                cached_seat = cached_seat_list[index]
                observe_seat = self.observe_data.seat_list[index]
                if cached_seat.__is_available != observe_seat.__is_available:
                    changed_seat_list.append(observe_seat)
            self._notify(changed_seat_list)

    def _notify(self, dataset):
        if not dataset:
            return

        if self.observe_type == crawler.RoomDetailCrawler:
            change_available_seats = []
            for seat in dataset:
                if seat.__is_available:
                    change_available_seats.append(seat)
            logging.info(change_available_seats)


class GCMService:
    api_key = None
    headers = None

    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            'Authorization': 'key=%s' % self.api_key,
        }
