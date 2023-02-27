 #!/usr/bin/python3


#################################################################################################################################################
#                                                    CLASSES CONTAINING ALL THE APP FUNCTIONS                                                                                                    #
#################################################################################################################################################







class Mqtt:

        def __init__(self,subtopic,server,port):


                from json import loads, dumps
                from time import time, sleep 
                from os import system, getcwd, path, popen, listdir
                from os.path import join
                import paho.mqtt.client as mqtt
                from collections import defaultdict
                from random import randint
                from .config import Config

                # import sys
                # # p = join(getcwd,"")
                # sys.path.insert(0, getcwd())
                # from app import Config

                self.Config                         = Config
                self.system             		    = system
                self.getcwd             		    = getcwd
                self.path 			                = path
                self.time 			                = time
                self.sleep 			                = sleep
                self.popen 			                = popen
                self.listdir 			            = listdir
                self.loads              		    = loads
                self.dumps 		                    = dumps
                self.subtopic                   	= subtopic
                self.server                         = server  
                self.port                           = port
                self.client                     	= mqtt.Client(client_id="updater{ID}".format(ID = str(randint(0,777))))
                self.client.on_connect          	= self.on_connect
                self.client.on_message          	= self.on_message

                # Create and instance of the DB class for use in this class
                # This gives this MQTT class access to all the functions in the DB class
                self.db                             = DB(self.Config) 
                self.Print("MQTT CALLED INIT")
                # Init MQTT Client
                self.client.connect(self.server, self.port, 60)
                self.client.loop_start()


        def Print(self,message):
                message = f" CCS: {message}"
                print(message) 
                


        # The callback for when the client receives a CONNACK response from the server.
        def on_connect(self, client, userdata, flags, rc):
                self.Print("Connected with result code "+str(rc))
                # Subscribing in on_connect() means that if we lose the connection and
                # reconnect then subscriptions will be renewed.
                self.client.subscribe(self.subtopic)   # <============== subscribe topic

        # The callback for when a PUBLISH message is received from the server.
        def on_message(self,client, userdata, msg):
                # print any message received
                self.Print(msg.topic+" "+str(msg.payload))

                # Convert mssg to python dictionary
                data = self.loads(msg.payload.decode("utf-8"))

                # Insert message into database
                self.db.insertFromCCS(data)
                 


        def Publish(self,topic,payload):
                self.client.publish(topic,payload)








class DB:

    def __init__(self,Config):

        from time import sleep, time, localtime, ctime, mktime 
        from math import floor
        from os import getcwd
        from os.path import join, exists
        from json import loads, dumps
        from datetime import timedelta, datetime
        from pymongo import MongoClient , errors
        from urllib import parse
        from urllib.request import  urlopen 
        from random import randint  
        from secrets import token_hex
     
  


        self.Config                         = Config
        self.randint                    	= randint  
        self.token_hex                      = token_hex
        self.getcwd                         = getcwd
        self.join                           = join 
        self.sleep                      	= sleep
        self.time                       	= time 
        self.localtime                  	= localtime
        self.ctime                      	= ctime
        self.mktime                     	= mktime
        self.floor                      	= floor   
        self.loads                      	= loads
        self.dumps                      	= dumps
        self.request                    	= urlopen 
        self.exists                         = exists
        self.timedelta                  	= timedelta
        self.datetime                       = datetime
        self.server			                = Config.DB_SERVER
        self.port			                = Config.DB_PORT
        self.username                   	= parse.quote_plus(Config.DB_USERNAME)
        self.password                   	= parse.quote_plus(Config.DB_PASSWORD)
        self.remoteMongo                	= MongoClient
        self.PyMongoError               	= errors.PyMongoError
        self.BulkWriteError             	= errors.BulkWriteError 
        self.DESCENDING                 	= 1
        self.ASCENDING                  	= -1  


    def testConnection(self):
        # TEST CONNECTION TO MONGODB DATABASE
        self.Print("TESTING CONNECTION TO REMOTE DATABASE ")
        result 	= False
        try:             
            #The ismaster command is cheap and does not require auth.
            remotedb 	= self.remoteMongo('mongodb://%s:%s@%s:%s' % (self.username, self.password,self.server,self.port) ) 
            result      = remotedb.server_info()
            

        except  self.PyMongoError as e:
            message 	= "UNABLE TO CONNECT TO REMOTE DATABASE ,ERROR CODE : {error} \n EXITING \n".format( error = str(e))
        else:
            self.Print("CONNECTED TO REMOTE SERVER \n")
            # self.Print(str(result))
            result 		= True
        finally:
            pass

        return result

    def Print(self,message):
        message = f" AWS: {message}"
        print(message)
        # logging.debug(message)
                

    
    def insertFromCCS(self,data):
        # INSERT DATA PUBLISHED FROM CCS HARDWARE INTO THE DATA COLLECTION OF THE DATABASE      
        try:
           
            remotedb 	= self.remoteMongo('mongodb://%s:%s@%s:%s' % (self.username, self.password,self.server,self.port))
            result      = remotedb["ELET2415"]["data"].insert_one(data)
        except Exception as e:
            error = str(e)
            if not  "duplicate" in error:
                print(error)
            return False
        else:                  
            return True 

    def plotStaticGraph(self,variable,start,end): 
        # RETRIEVE ALL THE DATA FOR A SPECIFIC VARIABLE BETWEEN START AND END TIMESTAMPS 
        try: 
            remotedb = self.remoteMongo('mongodb://%s:%s@%s:%s' % (self.username, self.password,self.server,self.port)) 
            result = list(remotedb["ELET2415"]["data"].aggregate([ { '$match': { 'TIMESTAMP': { '$gte': start, '$lte': end } } }, { '$group': { '_id': None, 'data': { '$push': { 'timestamp': '$TIMESTAMP', 'outtemp': f'${variable}' } } } }, { '$project': { '_id': 0 } } ])) 
            data = [[x['timestamp'],x['outtemp']] for x in result[0]["data"]] 
            # print(data) 
        except Exception as e: 
            print(str(e)) 
            return [] 
        else: return data     
 
       



def main():
    from config import Config
    from time import time, ctime, sleep
    from math import floor
    from datetime import datetime, timedelta

    # pubsub = Mqtt("/sensor/data","www.yanacreations.com",1883)
    one = DB(Config)
    one.plotStaticGraph("TEMPERATURE",1675365754,1675368174)
    timestamp = floor(time())
    registered = ctime(timestamp)
    # print(f"DB Connected : {one.testConnection()}")
  
     
    # print("completed")
   





if __name__ == '__main__':
    main()


    
