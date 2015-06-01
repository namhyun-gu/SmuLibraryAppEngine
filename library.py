__author__ = 'namhyun'
import endpoints
from protorpc import message_types
from protorpc import remote

from models import Hello


@endpoints.api(name='libraryendpoints', version='v1')
class LibraryApi(remote.Service):
    """Library API v1."""

    @endpoints.method(message_types.VoidMessage, Hello, path="sayHello", http_method='GET', name="sayHello")
    def say_hello(self, request):
        return Hello(greeting="Hello World")


api = endpoints.api_server([LibraryApi])
