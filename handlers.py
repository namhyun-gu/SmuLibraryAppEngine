#!/usr/bin/env python
__author__ = 'namhyun'
import webapp2
import keys
import logging
import utils
import crawler
from google.appengine.api import memcache, urlfetch

class DataUpdateHandler(webapp2.RequestHandler):
    def get(self):
        # TODO: Support Custom Data
        # TODO: Observe data and notify user by google cloud messaging service
        memcache.flush_all()
        timer = utils.Timer()
        room_list_crawler = crawler.RoomListCrawler()
        room_list_data = room_list_crawler.fetch().request_data()
        room_list_json_data = utils.Util.to_json(room_list_data)
        memcache.add(keys.ROOM_LIST_KEY, value=room_list_json_data)
        logging.info("Request room list (Elapsed Time : %s seconds)" % timer.stop())

        # TODO: Add Multi Threading features (Improve Performance)
        room_detail_crawler = crawler.RoomDetailCrawler()
        for index in range(1, room_list_crawler.room_size + 1):
            timer.start()
            room_detail_crawler.set_room(room_list_data.room_list[index - 1], index)
            room_detail_data = room_detail_crawler.fetch().request_data()
            room_detail_json_data = utils.Util.to_json(room_detail_data)
            memcache.add(keys.ROOM_KEY % index, value=room_detail_json_data)
            logging.info("Request room detail (Index : {0}, Elapsed Time : {1} seconds)"
                          .format(index, timer.stop()))

class TestDataUpdateHandler(webapp2.RedirectHandler):
    def get(self, *args, **kwargs):
        memcache.flush_all()
        timer = utils.Timer()
        room_list_urlfetch = urlfetch.fetch(crawler.Config.room_list_url, deadline=crawler.DEADLINE_SECONDS)
        room_list_crawler = \
            crawler.TestRoomListCrawler(room_list_urlfetch.content,
                                        crawler.Config.room_start_index, crawler.Config.room_capacity)
        room_list_data = room_list_crawler.extract_data()
        memcache.add(keys.ROOM_LIST_KEY, value=utils.Util.to_json(room_list_data))
        logging.info("Request room list (Elapsed Time : %s seconds)" % timer.stop())

        timer.start()

        for index in range(0, crawler.Config.room_capacity):
            rpc = urlfetch.create_rpc()
            urlfetch.make_fetch_call(rpc, crawler.Config.room_detail_url % (index + 1))

            try:
                result = rpc.get_result()
                if result.status_code == 200:
                    room_detail_crawler = \
                        crawler.TestRoomDetailCrawler(result.content, room_list_data.room_list[index])
                    room_detail_data = room_detail_crawler.extract_data()
                    memcache.add(keys.ROOM_KEY % index, value=utils.Util.to_json(room_detail_data))
            except urlfetch.DownloadError:
                pass

        logging.info("Request room detail (Elapsed Time : %s seconds)" % timer.stop())

        # room_list_crawler = RoomListCrawler()
        # room_list_data = room_list_crawler.fetch().request_data()
        #
        # room_detail_crawler = RoomDetailCrawler()
        # for index in range(1, RoomListCrawler.room_size + 1):
        #     room_detail_crawler.set_room(room_list_data.room_list[index - 1], index)
        #     room_detail_data = room_detail_crawler.fetch().request_data()
        #
        #     service = utils.ObserveService(room_detail_data, RoomDetailCrawler, room_index=index)
        #     service.observe()

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