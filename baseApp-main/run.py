#! /usr/bin/env python
from app import app, Config, Mqtt
#from .config import Config

print(Config.FLASK_RUN_PORT)
Client = Mqtt("620108055","localhost",1883)
if __name__ == "__main__":
    app.run(debug=Config.FLASK_DEBUG, host=Config.FLASK_RUN_HOST, port=Config.FLASK_RUN_PORT)

