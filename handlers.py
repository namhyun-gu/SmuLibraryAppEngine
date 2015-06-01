#!/usr/bin/env python
__author__ = 'namhyun'
import json
import webapp2
import keys
from utils import RoomListCrawler, RoomCrawler
from google.appengine.api import memcache

class DataUpdateHandler(webapp2.RequestHandler):
    def get(self):
        # TODO: Get data from memcache
        # TODO: Observe data and notify user to google cloud messaging service
        memcache.flush_all()
        room_list_crawler = RoomListCrawler()
        room_crawler = RoomCrawler()

        room_list_data = room_list_crawler.request_data()
        room_list_json_data = json.dumps(room_list_data, ensure_ascii=False, default=lambda o: o.__dict__)
        memcache.add(keys.ROOM_LIST_KEY, value=room_list_json_data)

        for index in range(1, room_list_crawler.room_size + 1):
            room_crawler.set_room(room_list_data.room_list[index - 1], index)
            room_data = room_crawler.request_data()
            room_json_data = json.dumps(room_data, ensure_ascii=False, default=lambda o: o.__dict__)
            memcache.add(keys.ROOM_KEY % index, value=room_json_data)

class ManageResourceHandler(webapp2.RequestHandler):
    def get(self):
        memcache.flush_all()

class ListRequestHandler(webapp2.RequestHandler):
    def get(self):
        data = memcache.get(keys.ROOM_LIST_KEY)
        if data is None:
            self.response.status = 404
        else:
            self.response.headers['content-Type'] = 'application/json'
            self.response.out.write(data)

class DetailRequestHandler(webapp2.RequestHandler):
    def get(self):
        request_room_index = self.request.get('index', default_value=0)
        data = memcache.get(keys.ROOM_KEY % int(request_room_index))
        if data is None:
            self.response.status = 404
        else:
            self.response.headers['content-Type'] = 'application/json'
            self.response.out.write(data)


app = webapp2.WSGIApplication([
    ('/cron/data_update', DataUpdateHandler),
    ('/cron/manage_resource', ManageResourceHandler),
    ('/request/room_list', ListRequestHandler),
    ('/request/room_detail', DetailRequestHandler)
], debug=True)