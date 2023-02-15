#! /usr/bin/env python
from app import app, Config
#from .config import Config
print(Config.FLASK_RUN_PORT)

if __name__ == "__main__":
    app.run(debug=Config.FLASK_DEBUG, host=Config.FLASK_RUN_HOST, port=Config.FLASK_RUN_PORT)

