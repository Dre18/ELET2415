from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, TextAreaField, PasswordField,SelectField,IntegerField
from wtforms.validators import DataRequired, Email, InputRequired
from .config import Config
from pymongo import MongoClient 

client = MongoClient(Config.MONGO_URI)
result = client['data12']['hourly'].distinct("station")
print(result)
alloptions = [(x,x) for x in result]
alloptions.append(('ALL','ALL'))
print(alloptions)


options = [('cpp', 'C++'), ('py', 'Python'), ('text', 'Plain Text')]

class ContactForm(FlaskForm):
    """ContactForm"""
    name        = StringField("Name",validators=[DataRequired()])
    email       = EmailField("E-mail",validators=[DataRequired(),Email()])
    subject     = StringField("Subject", validators=[DataRequired()])
    message     = TextAreaField("Message", validators=[DataRequired()]) 
    
    

class LoginForm(FlaskForm):
    """LoginForm"""
    username    = StringField("Name",validators=[DataRequired()])
    email       = EmailField("E-mail",validators=[DataRequired(),Email()])
    password    = PasswordField("Password", validators=[InputRequired()]) 
    

class SignupForm(FlaskForm):
    """SignupForm"""
    username    = StringField("Username",validators=[DataRequired()])
    email       = EmailField("Email",validators=[DataRequired(),Email()])
    password    = PasswordField("Password", validators=[InputRequired()]) 


class SleepmodeForm(FlaskForm):
    """SleepmodeForm"""
    state       = SelectField('SLEEPMODE', choices= [('on', 'ENABLE'), ('off', 'DISABLE')])
    stations    = SelectField('Stations', choices=alloptions)
    interval    = IntegerField('Interval',validators=[InputRequired()])

class StationmodeForm(FlaskForm):
    """StationmodeForm"""
    state       = SelectField('STATIONMODE', choices= [('enable', 'ENABLE'), ('disable', 'DISABLE')])
    stations    = SelectField('Stations', choices=alloptions) 
    
class TelemetryForm(FlaskForm):
    """TelemetryForm"""
    # [('cpp', 'C++'), ('py', 'Python'), ('text', 'Plain Text')]
    stations = SelectField('TELEMETRY', choices=alloptions)

class UpdateForm(FlaskForm):
    """ Firmware UpdateForm"""
    firmware    = IntegerField('FIRMWARE',validators=[InputRequired()])
    stations    = SelectField('Stations', choices=alloptions)
    
