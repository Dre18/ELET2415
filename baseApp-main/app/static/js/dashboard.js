window.onload = (event) => {
    
  console.log('page is fully loaded');
  
  var mqtt;
  var connected_flag      =  0	
  var reconnectTimeout    = 2000;  
  var pubtopic            = "620108055_lab5";       //Replace with your ID number ex. 620012345_lab3  
  var subtopic            = "620108055";            //Replace with your ID number ex. 620012345. MQTT topic for subscribing to
  var host                = "www.yanacreations.com";  // MQTT HOST
  var port                = 8883;                     // MQTT Port


  // var state = 12;
  /* HTML ELEMENT SELECTORS */
  // Query selector objects used to manipulate HTML elements
  let printMessage        = document.querySelector("#messages");          // Query by HTML Element's id. Select <div> element
  let printStatus         = document.querySelector("#status"); 

  let kitchenCard         = document.querySelector(".kitchen > p");       // Query by HTML class & element type. Select <p> element
  let kitchenCardBtn      = document.querySelector(".kitchen > button");  // Query by HTML class & element type. Select <button> element
  let kitchenCardImg         = document.querySelector(".kitchen > img"); 

  let bathroomCard       = document.querySelector(".bathroom > p");
  let bathroomCardBtn        = document.querySelector(".bathroom > button");
  let bathroomCardImg         = document.querySelector(".bathroom > img"); 

  let livingroomCard       = document.querySelector(".livingroom > p");
  let livingroomCardBtn        = document.querySelector(".livingroom > button");
  let livingroomCardImg         = document.querySelector(".livingroom > img"); 

  let hallCard       = document.querySelector(".hall > p");
  let hallCardBtn        = document.querySelector(".hall > button");
  let hallCardImg         = document.querySelector(".hall > img"); 

  let studyroomCard       = document.querySelector(".studyRoom > p");
  let studyroomCardBtn        = document.querySelector(".studyRoom > button");
  let studyroomCardImg         = document.querySelector(".studyRoom > img"); 

  
  let frontdoorCard       = document.querySelector(".frontdoor > p"); 
  let frontdoorCardImg         = document.querySelector(".frontdoor > img"); 

  let balconydoorCard       = document.querySelector(".balcony_door > p"); 
  let balconydoorCardImg         = document.querySelector(".balcony_door > img"); 

  let bedroomCard       = document.querySelector(".bedRoom > p");
  let bedroomCardBtn        = document.querySelector(".bedRoom > button");

  let limit                 = 10;
  let elevationData         = [];
 
  start = document.querySelector("#start"); 
  end = document.querySelector("#end"); 
  plotBtn = document.querySelector(".plot");
  /* EVENT LISTENERS */


  // Add event listener which sends fetch request to server once plot button is clicked 
  plotBtn.addEventListener("click", async ()=>{ 
    let starttime = new Date(start.value).getTime() / 1000; 
    let endtime = new Date(end.value).getTime() / 1000; 
    // Request data from server 
    const URL = `/data?start=${starttime}&end=${endtime}&variable=OUTTEMP`; 
    const response = await fetch(URL); 
    if(response.ok){ 
      let res = await response.json(); 
      elevationData = [...res]; 
      //Print data received to console 
      console.log(elevationData); 
      // Render plot with received data 
      graph.update({ series: [{ data: res, lineColor: Highcharts.getOptions().colors[1], 
        color: Highcharts.getOptions().colors[2], 
        fillOpacity: 0.5, name: 'Temperature', 
        marker: { enabled: false }, 
        threshold: null }] 
      });
     } 
    });


    /* GRAPH */ 
    graph = Highcharts.chart('container', {
       chart: { 
        type: 'area', 
        zoomType: 'x', 
        panning: true, 
        panKey: 'shift', 
        scrollablePlotArea: { 
          minWidth: 600 
    } 
  }, 
    title: {
       text: 'Average Outside Temperature', 
       align: 'center' 
      },
      xAxis: { 
        type: "datetime" 
      }, 
      yAxis: { 
        startOnTick: true, 
        endOnTick: false, 
        maxPadding: 0.35, 
        title: {
          text: null 
        }, 
        labels: { 
          format: '{value} °C' 
        } }, 
        tooltip: { 
          // headerFormat: 'Distance: {point.x:.1f} km<br>', 
          pointFormat: '{point.y:.1f} °C', 
          shared: true 
        }, legend: { 
          enabled: false 
        }, 
        series: [{ 
          data: elevationData, lineColor: Highcharts.getOptions().colors[1], 
          color: Highcharts.getOptions().colors[2], 
          fillOpacity: 0.5, 
          name: 'Temperature', 
          marker: { 
            enabled: false 
          }, 
          threshold: null 
        }] 
      });


      // Render live Graph 
      liveGraph = Highcharts.chart('livedata', { 
        chart: { 
          type: 'spline', 
          zoomType: 'x', 
          panning: true, 
          panKey: 'shift', 
          scrollablePlotArea: { 
            minWidth: 600 
          } 
        }, 
        title: 
        { 
          text: 'Live Temperature Data', 
          align: 'center' 
        }, 
        xAxis: { 
          type: "datetime" 
        }, 
        yAxis: { 
          startOnTick: true, 
          endOnTick: false, 
          maxPadding: 0.35, 
          title: { 
            text: null 
          }, 
          labels: { 
            format: '{value} °C' } 
          }, 
          tooltip: { 
            // headerFormat: 'Distance: {point.x:.1f} km<br>', 
            pointFormat: '{point.y:.1f} °C', 
            shared: true 
          }, 
          legend: { 
            enabled: false 
          }, 
          series: [{ 
            data: [], 
            lineColor: Highcharts.getOptions().colors[3], 
            color: Highcharts.getOptions().colors[2], 
            fillOpacity: 0.5, 
            name: 'Temperature', 
            marker: { 
              enabled: false 
            }, 
            threshold: null 
          }]
         });

  livingroomCardBtn.addEventListener("click",()=>{ 
    console.log("livingroom Button clicked");

    // Send message
    let message = {"type":"toggle","sensor":"LIVINGROOM"};
    send_message(JSON.stringify(message));
  });


  kitchenCardBtn.addEventListener("click",()=>{ 
        console.log("Kitchen Button clicked");

        
        // Send message
        let message = {"type":"toggle","sensor":"KITCHEN"};
      
        send_message(JSON.stringify(message));
  });

  bathroomCardBtn.addEventListener("click",()=>{ 
        console.log("Bathroom Button clicked");

        // Send message
        let message = {"type":"toggle","sensor":"BATHROOM"};
        send_message(JSON.stringify(message));
  });

  hallCardBtn.addEventListener("click",()=>{ 
    console.log("Hall Button clicked");

    // Send message
    let message = {"type":"toggle","sensor":"HALL"};
    send_message(JSON.stringify(message));
  });

  studyroomCardBtn.addEventListener("click",()=>{ 
    console.log("Studyroom Button clicked");

    // Send message
    let message = {"type":"toggle","sensor":"STUDYROOM"};
    send_message(JSON.stringify(message));
  });

  bedroomCardBtn.addEventListener("click",()=>{ 
    console.log("Studyroom Button clicked");

    // Send message
    let message = {"type":"toggle","sensor":"BEDROOM"};
    send_message(JSON.stringify(message));
  });
  





  /* MQTT FUNCTIONS  */  
  onMessageArrived = (r_message)=>{    
      
      try{
        // Convert message received to json object
        let mssg  = JSON.parse(r_message.payloadString); 

        
        
        // Print json message to console(View in Browser Dev Tools)
        console.log(mssg); 

        if(mssg.TYPE == "SENSOR")
        {   
          // Update webpage 
          kitchenCard.innerHTML   =  mssg.KITCHEN;
          if(mssg.KITCHEN == "ON")
          {
            kitchenCardImg.src = "../static/images/lightbulbon.png";
          }
          if(mssg.KITCHEN == "OFF")
          {
            kitchenCardImg.src = "../static/images/bulboff.png";
          }
        

          bathroomCard.innerHTML   =  mssg.BATHROOM; 

          if(mssg.BATHROOM == "ON")
          {
            bathroomCardImg.src = "../static/images/lightbulbon.png";
          }
          if(mssg.BATHROOM == "OFF")
          {
            bathroomCardImg.src = "../static/images/bulboff.png";
          }
        
          

          livingroomCard.innerHTML  =  mssg.LIVINGROOM; 
          if(mssg.LIVINGROOM == "ON")
          {
            livingroomCardImg.src = "../static/images/lightbulbon.png";
          }
          if(mssg.LIVINGROOM == "OFF")
          {
            livingroomCardImg.src = "../static/images/bulboff.png";
          }



          hallCard.innerHTML   =  mssg.HALL;
          if(mssg.HALL == "ON")
          {
            hallCardImg.src = "../static/images/lightbulbon.png";
          }
          if(mssg.HALL == "OFF")
          {
            hallCardImg.src = "../static/images/bulboff.png";
          }

          studyroomCard.innerHTML   =  mssg.STUDYROOM;
          if(mssg.STUDYROOM == "ON")
          {
            studyroomCardImg.src = "../static/images/lightbulbon.png";
          }
          if(mssg.STUDYROOM == "OFF")
          {
            studyroomCardImg.src = "../static/images/bulboff.png";
          }


          bedroomCard.innerHTML   = mssg.BEDROOM;

          frontdoorCard.innerHTML = mssg.FRONTDOOR;
          if(mssg.FRONTDOOR == "CLOSED")
          {
            frontdoorCardImg.src = "../static/images/doorclosed.png";
          }
          if(mssg.FRONTDOOR == "OPEN")
          {
            frontdoorCardImg.src = "../static/images/dooropen.png";
          }
          

          balconydoorCard.innerHTML = mssg.BALCONYDOOR; 

          if(mssg.BALCONYDOOR == "CLOSED")
          {
            balconydoorCardImg.src = "../static/images/doorclosed.png";
          }
          if(mssg.BALCONYDOOR == "OPEN")
          // else
          {
            balconydoorCardImg.src = "../static/images/dooropen.png";
          }

          let timestamp = mssg.TIMESTAMP; 
          let temperature = mssg.OUTTEMP; 

          if(limit > 0){ 
            liveGraph.series[0].addPoint({y:parseFloat(temperature) ,x:((parseInt(timestamp) - 18000 )*1000) }, true, false); 
            limit--; 
          } 
          else
          { 
            liveGraph.series[0].addPoint({y:parseFloat(temperature) ,x:((parseInt(timestamp) - 18000 )*1000) }, true, true); 
          }
        }
      
           
      }
      catch (error){
          console.error(error);
      }
   
         
  }
  
  onConnectionLost = ()=>{
      console.log("connection lost"); 
      printMessage.classList.remove("mqttConnected");
      printMessage.classList.add("mqttdisconnected");
      setTimeout(connect,3000);
    }
    
    
  onFailure = (message) => {
    console.log("Failed"); 
    printMessage.classList.remove("mqttConnected");
    printMessage.classList.add("mqttdisconnected");
    setTimeout(MQTTconnect, reconnectTimeout);
  }
    

  onConnected = (recon,url)=>{
    console.log(" in onConnected " +recon);
  }
  
  onConnect = ()=>{
   // Once a connection has been made, make a subscription and send a message. 
  connected_flag          = 1 
  printMessage.classList.add("mqttConnected");
  printMessage.classList.remove("mqttDisconnected");
  console.log(`on Connect ${connected_flag}`); 
  sub_topics();
   }
  
  
  makeid = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
  }
  
  var IDstring = makeid(12);
  
  MQTTconnect = ()=> {
  
  console.log(`connecting to  ${host}   ${port}`);
  mqtt = new Paho.MQTT.Client( host ,port,IDstring);
  
 
  var options = {
          timeout: 3,
          onSuccess: onConnect,
          onFailure: onFailure,   
          useSSL:true  
       };
  
  mqtt.onConnectionLost = onConnectionLost;
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.onConnected = onConnected;
  mqtt.connect(options);
  return false;
   
   
  }
  
  
  sub_topics = ()=>{   
  console.log("Subscribing to topic = "+ subtopic);
  mqtt.subscribe(subtopic);
  return false;
  }
  
  send_message = (msg)=>{

    printStatus.innerHTML ="";
    if (connected_flag == 0){
        out_msg="<b style='color:red'> Not Connected so can't send </b>"
        console.log(out_msg);
        printStatus.innerHTML = out_msg;
        setTimeout(function(){ printStatus.innerHTML = " ";  }, 3000);
        return false;
    }
    else{  
        // Send message                   
        var message = new Paho.MQTT.Message(msg);
        message.destinationName = pubtopic;
        mqtt.send(message);
        return true;
        }   
  }
  
  // Connect to MQTT broker
  MQTTconnect();
  
  



 
};