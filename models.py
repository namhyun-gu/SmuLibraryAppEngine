#!/usr/bin/env python
__author__ = 'namhyun'
from protorpc import messages

class Hello(messages.Message):
    greeting = messages.StringField(1)

class Response(messages.Message):
    response_message = messages.StringField(1)
    response_data = messages.StringField(2, repeated=True)

class RoomList:
    update_date = None
    room_list = None
    room_size = 0

    def date(self, date):
        self.update_date = date
        return self

    def rooms(self, rooms):
        self.room_list = rooms
        return self

    def size(self, size):
        self.room_size = size
        return self

class Room:
    name = None
    seat_capacity = 0
    used_seat = 0
    available_seat = 0

    def __init__(self):
        pass

    def room_name(self, name):
        # remove spaces
        self.name = name.strip()
        return self

    def capacity(self, capacity):
        # remove spaces and unicode to int
        self.seat_capacity = int(capacity.strip())
        return self

    def used(self, used_seat):
        # remove spaces and unicode to int
        self.used_seat = int(used_seat.strip())
        return self

    def caculate(self):
        self.available_seat = self.seat_capacity - self.used_seat
        return self

class RoomDetail:
    update_date = None
    room_object = None
    seat_list = None

    def date(self, date):
        self.update_date = date
        return self

    def room(self, room):
        self.room_object = room
        return self

    def seats(self, seats):
        self.seat_list = seats
        return self

class Seat:
    seat_number = 0
    use_time = None
    is_available = False

    def number(self, number):
        self.seat_number = number
        return self

    def available(self, available):
        self.is_available = available
        return self

class Error:
    code = None
    message = None

    def __init__(self, code, message):
        self.code = code
        self.message = message