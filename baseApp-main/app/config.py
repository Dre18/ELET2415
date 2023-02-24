import os
from dotenv import load_dotenv

load_dotenv()  # LOAD .env FILES IN CURRENT FOLDER

class Config(object):
    """Base Config Object""" 
    FLASK_DEBUG     = eval(os.environ.get('FLASK_DEBUG') )
    SECRET_KEY      = os.environ.get('SECRET_KEY', 'Som3$ec5etK*y') 
    FLASK_RUN_PORT  = os.environ.get('FLASK_RUN_PORT') 
    FLASK_RUN_HOST  = os.environ.get('FLASK_RUN_HOST') 
    SYSFILES = os.environ.get("SYSFILES") 
    # DB_USERNAME="msojAdmin" 
    # DB_PASSWORD="iUUofDcSkAndou5L62cCpZ4Ue7725QT6G95N" 
    # # DB_USERNAME="" 
    # DB_PASSWORD="" 
    # DB_SERVER="localhost" 
    # DB_PORT=27017
    DB_USERNAME = os.environ.get('DB_USERNAME') 
    DB_PASSWORD = os.environ.get('DB_PASSWORD') 
    DB_SERVER = os.environ.get('DB_SERVER') 
    DB_PORT = os.environ.get('DB_PORT')
    