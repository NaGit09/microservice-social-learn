from mongoengine import connect

class Mongo:
    def __init__(self):
        self._connected = False

    def connect(self, **kwargs):
        if not self._connected:
            connect(**kwargs)
            self._connected = True

mongo = Mongo()
