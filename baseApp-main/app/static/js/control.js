window.addEventListener('load',()=>{
console.log("CONTROL JS LOADED")
let replies = document.querySelector('#mqttReplies')
let sleepmodeButton = document.querySelector('#sleepmode_button');
let stationmodeButton = document.querySelector('#stationmode_button');
let telemetryButton = document.querySelector('#telemetry_button');
let firmwareButton = document.querySelector('#firmware_button')

sleepmodeButton.addEventListener('click',()=>{
    let sleepmode = document.querySelector('#sleepmode_mode'); 
    let station = document.querySelector('#sleepmode_stations'); 
    let interval  = document.querySelector('#sleepmode_interval');
    let message = {"type":"sleepmode","sleepmode":sleepmode.value,"interval":interval.value}
    
    if(station.value === "ALL"){ 
        publishmsg(JSON.stringify(message),"/aws/station/all/update");
    }
    else{
        publishmsg(JSON.stringify(message),`/aws/station/${station.value}/update`);
    }
    console.log(`Sleepmode button pressed...${sleepmode.value}  ${interval.value}`)
    
});

stationmodeButton.addEventListener('click',()=>{
    let mode = document.querySelector('#stationmode_mode'); 
    let station = document.querySelector('#stationmode_stations'); 
    let message = {"type":"remotestationmode","mode":mode.value}

    if(station.value === "ALL"){ 
        publishmsg(JSON.stringify(message),"/aws/station/all/update");
    }
    else{
        publishmsg(JSON.stringify(message),`/aws/station/${station.value}/update`);
    }
    console.log(`Stationmode button pressed...${sleepmode.value}  ${interval.value}`)
  
});

 

telemetryButton.addEventListener('click',()=>{
    let station = document.querySelector('#telemetry_select'); 
    let message = {"type":"telemetry","request":"status"};
    console.log(`Telemetry button pressed...${station.value} `)
    if(station.value === "ALL"){  
        publishmsg(JSON.stringify(message),"/aws/station/all/update");
    }
    else{
        publishmsg(JSON.stringify(message),`/aws/station/${station.value}/update`);
    }
    
    
});

firmwareButton.addEventListener('click',()=>{
    let station = document.querySelector('#firmware_stations'); 
    let version  = document.querySelector('#firmware_version');

    let message = {"type":"version","version":version.value};
    
  
    console.log(`Firmware button pressed...${station.value} `)

    if(station.value === "ALL"){ 
        publishmsg(JSON.stringify(message),"/aws/station/all/update");
    }
    else{
        publishmsg(JSON.stringify(message),`/aws/station/${station.value}/update`);
    }
    
});


createListElement = (html)=>{
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;

}



//################################################################################################
//################################################ MQTT START ####################################
//################################################################################################

var pubtopic = "";


function onConnectionLost(){
console.log("connection lost");
document.getElementById("messages").innerHTML = "Connection Lost";
}

function onFailure(message) {
console.log("Failed");
document.getElementById("messages").innerHTML = "Connection Failed- Retrying";
        setTimeout(MQTTconnect, reconnectTimeout);
        }



function onMessageArrived(r_message){ 
            try {  
                const message = r_message.payloadString
                msg = JSON.parse(message);           
                console.log(msg); 
                data = ` <li><span> ${message} </span> </li> `;
                element = createListElement(data);
                replies.prepend(element);
                 
                
            }
            catch(err) {
                console.log("Error while converting to json");
                console.log(err);
            }
            finally {
                console.log("Moving on");
            }

       
       
       
       
}

function onConnected(recon,url){
console.log(" in onConnected " +recon);
}

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    document.getElementById("messages").innerHTML ="Connected to "+ host +"on port "+ port;
    connected_flag=1
    document.getElementById("messages").innerHTML = "<b  style='color:green'>Connected <b>";
    console.log("on Connect "+connected_flag);
    //mqtt.subscribe("sensor1");
    //message = new Paho.MQTT.Message("Hello World");
    //message.destinationName = "sensor1";
    //mqtt.send(message);
    sub_topics();
 }

    function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    return result;
    }

    var IDstring = makeid(12);

    function MQTTconnect() {
    document.getElementById("messages").innerHTML ="";
    console.log("connecting to "+ host +" "+ port);
    mqtt = new Paho.MQTT.Client( host ,port,IDstring);

//document.write("connecting to "+ host);
var options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure,
     
     };

    mqtt.onConnectionLost   = onConnectionLost;
    mqtt.onMessageArrived   = onMessageArrived;
    mqtt.onConnected        = onConnected;
    mqtt.connect(options);
    return false;
 
 
}


function sub_topics(){
document.getElementById("status").innerHTML = " ";

if (connected_flag==0){
    out_msg="<b  style='color:red'>Not Connected so can't subscribe</b>"
    console.log(out_msg);
    document.getElementById("status").innerHTML = out_msg;
    setTimeout(function(){ document.getElementById("status").innerHTML = " ";  }, 3000);
    return false;
}



var stopic= "/aws/station/#"; 
console.log("Subscribing to topic = "+stopic);
mqtt.subscribe(stopic);
return false;
}




function send_message(msg){ 
    document.getElementById("status").innerHTML ="";
    if (connected_flag==0){
        out_msg="<b style='color:red'> Not Connected so can't send </b>"
        console.log(out_msg);
        document.getElementById("status").innerHTML = out_msg;
        setTimeout(function(){ document.getElementById("status").innerHTML = " ";  }, 3000);
        return false;
    }else{              
            
        var message = new Paho.MQTT.Message(msg);
        message.destinationName = pubtopic;
        mqtt.send(message);
        return true;

            }
}

 publishmsg = (msg,topic) =>{ 
    
    if (connected_flag==0){ 
        return false;
    }
    else{   
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    mqtt.send(message);
    return true;
 }
}


function  connect(){
        MQTTconnect();
    }

    connect();  // CONNECT AS SOON AS PAGE LOADS


//################################################################################################
//################################################## MQTT END ####################################
//################################################################################################



    
});