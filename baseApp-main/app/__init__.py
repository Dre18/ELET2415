from flask import Flask 
from .config import Config  
from .function import DB, Mqtt

app = Flask(__name__)
app.config.from_object(Config)
 

from app import views 
