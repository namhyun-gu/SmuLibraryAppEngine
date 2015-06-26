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
    def get_time():
        return datetime.now(KST()).strftime('%H:%M')

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
                seat_object.seat_number = seat_data['seat_number']
                seat_object.is_available = seat_data['is_available']
                try:
                    seat_object.use_time = seat_data['use_time']
                except KeyError:
                    seat_object.use_time = None
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

    @staticmethod
    def create_error_response(code, message):
        return Util.to_json(Error(code, message))

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
    observe_index = None
    memcache_data = None

    def __init__(self, observe_data, type, index=None):
        self.observe_data = observe_data
        self.observe_type = type
        self.observe_index = index
        self.memcache_data = memcache.get(keys.ROOM_KEY % self.observe_index)

    def get_cache_list(self):
        if self.memcache_data is None:
            return None
        return Util.from_json(self.memcache_data, RoomDetail).seat_list

    def observe(self):
        if self.observe_type == crawler.RoomDetailCrawler:
            if self.observe_index is None:
                return

            cached_seat_list = self.get_cache_list()
            if cached_seat_list is None:
                return

            for index in range(0, len(cached_seat_list)):
                cached_seat = cached_seat_list[index]
                observe_seat = self.observe_data.seat_list[index]

                if cached_seat.is_available != observe_seat.is_available:
                    if observe_seat.is_available:
                        observe_seat.use_time = None
                        #TODO: Notify data changed to user (GCM or Mail)
                elif observe_seat.is_available is False:
                    if cached_seat.use_time is None:
                        observe_seat.use_time = Util.get_time()
                    else:
                        observe_seat.use_time = cached_seat.use_time