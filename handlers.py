#!/usr/bin/env python
__author__ = 'namhyun'
import webapp2
import keys
import logging
import utils
import crawler
import models
from google.appengine.api import memcache, urlfetch


class MainPageHandler(webapp2.RequestHandler):
    def get(self):
        self.redirect("static/index.html")


class DataUpdateHandler(webapp2.RequestHandler):
    def get(self):
        # TODO: Support Custom Data
        timer = utils.Timer()
        room_list_urlfetch = urlfetch.fetch(crawler.Config.room_list_url, deadline=crawler.DEADLINE_SECONDS)
        room_list_crawler = \
            crawler.TestRoomListCrawler(room_list_urlfetch.content,
                                        crawler.Config.room_start_index, crawler.Config.room_capacity)
        room_list_data = room_list_crawler.extract_data()

        logging.info("Request room list (Elapsed Time : %s seconds)" % timer.stop())

        timer.start()
        room_detail_datas = []
        for index in range(0, crawler.Config.room_capacity):
            rpc = urlfetch.create_rpc()
            urlfetch.make_fetch_call(rpc, crawler.Config.room_detail_url % (index + 1))
            try:
                result = rpc.get_result()
                if result.status_code == 200:
                    room_detail_crawler = \
                        crawler.TestRoomDetailCrawler(result.content, room_list_data.room_list[index])
                    room_detail_data = room_detail_crawler.extract_data()

                    service = utils.ObserveService(room_detail_data, crawler.RoomDetailCrawler, index)
                    service.observe()
                    room_detail_datas.append(room_detail_data)
            except urlfetch.DownloadError:
                pass

        memcache.flush_all()
        memcache.add(keys.ROOM_LIST_KEY, value=utils.Util.to_json(room_list_data))
        for index in range(0, len(room_detail_datas)):
            memcache.add(keys.ROOM_KEY % index, value=utils.Util.to_json(room_detail_datas[index]))
        logging.info("Request room detail (Elapsed Time : %s seconds)" % timer.stop())


class ListRequestHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = "origin, x-requested-with, content-type, accept"

        memcache_data = memcache.get(keys.ROOM_LIST_KEY)
        if memcache_data is None:
            self.response.status = 404
            response_data = utils.Util.create_error_response(404, "Not found cached data.")
        else:
            response_data = memcache_data
        self.response.out.write(response_data)


class DetailRequestHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = "origin, x-requested-with, content-type, accept"

        request_index = self.request.get('index', default_value=None)
        request_number = self.request.get('number', default_value=None)

        if request_index is None:
            self.response.status = 404
            response_data = utils.Util.create_error_response(404, "Missing parameter 'index'.")
            self.response.out.write(response_data)
            return

        memcache_data = memcache.get(keys.ROOM_KEY % int(request_index))
        if memcache_data is None:
            self.response.status = 404
            response_data = utils.Util.create_error_response(404, "Not found cached data.")
        else:
            if request_number is not None:
                try:
                    object = utils.Util.from_json(memcache_data, models.RoomDetail)
                    response_seat = object.seat_list[int(request_number) - 1]
                    response_data = utils.Util.to_json(response_seat)
                except IndexError:
                    self.response.status = 404
                    response_data = utils.Util.create_error_response(404, "Not found seat number from cached data.")
            else:
                response_data = memcache_data
        self.response.out.write(response_data)


app = webapp2.WSGIApplication([
    ('/', MainPageHandler),
    ('/cron/data_update', DataUpdateHandler),
    ('/request/room_list', ListRequestHandler),
    ('/request/room_detail', DetailRequestHandler)
], debug=True)
