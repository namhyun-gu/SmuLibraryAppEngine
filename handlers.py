#!/usr/bin/env python
__author__ = 'namhyun'
import json
import webapp2
import keys
import logging
import time
import utils
from google.appengine.api import memcache

class DataUpdateHandler(webapp2.RequestHandler):
    def get(self):
        # TODO: Get data from memcache
        # TODO: Observe data and notify user by google cloud messaging service
        memcache.flush_all()
        timer = utils.Timer()
        room_list_crawler = utils.RoomListCrawler()
        room_list_data = room_list_crawler.fetch().request_data()
        room_list_json_data = json.dumps(room_list_data, ensure_ascii=False, default=lambda o: o.__dict__)
        memcache.add(keys.ROOM_LIST_KEY, value=room_list_json_data)
        logging.info("Request room list (Elapsed Time : %s seconds)" % timer.stop())

        # TODO: Add Multi Threading features (Improve Performance)
        room_detail_crawler = utils.RoomDetailCrawler()
        for index in range(1, room_list_crawler.room_size + 1):
            timer.start()
            room_detail_crawler.set_room(room_list_data.room_list[index - 1], index)
            room_detail_data = room_detail_crawler.fetch().request_data()
            room_detail_json_data = json.dumps(room_detail_data, ensure_ascii=False, default=lambda o: o.__dict__)
            memcache.add(keys.ROOM_KEY % index, value=room_detail_json_data)
            logging.info("Request room detail (Index : {0}, Elapsed Time : {1} seconds)"
                          .format(index, timer.stop()))

class TestDataUpdateHandler(webapp2.RedirectHandler):
    def get(self, *args, **kwargs):
        room_list_crawler = utils.RoomListCrawler()
        room_list_data = room_list_crawler.fetch().request_data()

        start_time = time.time()
        room_detail_crawler = utils.RoomDetailCrawler()
        room_detail_crawler.set_room(room_list_data.room_list[1], 2)
        room_detail_data = room_detail_crawler.fetch().request_data()
        room_detail_json_data = json.dumps(room_detail_data, ensure_ascii=False, default=lambda o: o.__dict__)
        logging.info("Request room detail (Index : {0}, Elapsed Time : {1} seconds)"
                     .format(2, time.time() - start_time))

        self.response.headers['content-Type'] = 'application/json'
        self.response.out.write(room_detail_json_data)

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
    ('/test/data_update', TestDataUpdateHandler),
    ('/request/room_list', ListRequestHandler),
    ('/request/room_detail', DetailRequestHandler)
], debug=True)