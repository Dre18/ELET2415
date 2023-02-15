window.addEventListener('load',()=>{
    console.log('DASHBOARD LOADED');



//################################################################################################
//############################################# LEAFLET ##########################################
//################################################################################################
var map = L.map('map').setView([18.006134530482317, -76.74509424632292], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'tedwardsuwi/cl0d2e6io000t14qntylpu4j4',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGVkd2FyZHN1d2kiLCJhIjoiY2wwZDJuamg4MDBsODNkbnJieGpvdmZtcSJ9.f5Xli1XZ3VXzZr7oFpmG5g'
}).addTo(map);
 
// var marker = L.marker([18.006134530482317, -76.74509424632292]).addTo(map);
// style URL  tedwardsuwi/cl0d2e6io000t14qntylpu4j4      OR mapbox/streets-v11
// TOKEN  pk.eyJ1IjoidGVkd2FyZHN1d2kiLCJhIjoiY2wwZDJuamg4MDBsODNkbnJieGpvdmZtcSJ9.f5Xli1XZ3VXzZr7oFpmG5g


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
                msg = JSON.parse(r_message.payloadString);           
                console.log(msg);
                if (msg.STATION === "UWI"){ 
                
                  let latitude = parseFloat(msg.LATITUDE);
                  let longitude = parseFloat(msg.LONGITUDE);
                  var marker = L.marker([latitude, longitude],{title:"UWI",opacity:1.0,riseOnHover:true,riseOffset:200}).addTo(map);
                  marker.bindTooltip( `<h6> ${msg.DATE} </h6>`,{interactive:true,opacity:0.8}).openTooltip();
                }
                if (msg.STATION === "UWI_MET"){ 
                
                  let latitude = parseFloat(msg.LATITUDE);
                  let longitude = parseFloat(msg.LONGITUDE);
                  var marker = L.marker([latitude, longitude],{title:"UWI_MET",opacity:1.0,riseOnHover:true,riseOffset:200}).addTo(map);
                  marker.bindTooltip( `<h6> ${msg.DATE} </h6>`,{interactive:true,opacity:0.8}).openTooltip();
                }
                
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
        return false;

            }
 
     
}

function  connect(){
        MQTTconnect();
    }

    connect();  // CONNECT AS SOON AS PAGE LOADS


//################################################################################################
//################################################## MQTT END ####################################
//################################################################################################



    Highcharts.theme = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
             
             
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#F0F0F3',
                    style: {
                        fontSize: '13px'
                    }
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            },
            title: {
                style: {
                    color: '#C0C0C0'
                }
            }
        },
        credits: {
            style: {
                color: '#667'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },
        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },
        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },
        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },
        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },
        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        }
    };
    // Apply the theme
  Highcharts.setOptions(Highcharts.theme);


// Create the chart
Highcharts.chart('container', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Browser market shares. January, 2018'
    },
    subtitle: {
      text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
    },
    accessibility: {
      announceNewData: {
        enabled: true
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total percent market share'
      }
  
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      }
    },
  
    tooltip: {
      
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total value<br/>'
    },
  
    series: [
      {
        name: "Browsers",
        colorByPoint: true,
        data: [
          {
            name: "Chrome",
            y: 62.74,
            drilldown: "Chrome"
          },
          {
            name: "Firefox",
            y: 10.57,
            drilldown: "Firefox"
          },
          {
            name: "Internet Explorer",
            y: 7.23,
            drilldown: "Internet Explorer"
          },
          {
            name: "Safari",
            y: 5.58,
            drilldown: "Safari"
          },
          {
            name: "Edge",
            y: 4.02,
            drilldown: "Edge"
          },
          {
            name: "Opera",
            y: 1.92,
            drilldown: "Opera"
          },
          {
            name: "Other",
            y: 7.62,
            drilldown: null
          }
        ]
      }
    ],
    drilldown: {
      series: [
        {
          name: "Chrome",
          id: "Chrome",
          data: [
            [
              "v65.0",
              0.1
            ],
            [
              "v64.0",
              1.3
            ],
            [
              "v63.0",
              53.02
            ],
            [
              "v62.0",
              1.4
            ],
            [
              "v61.0",
              0.88
            ],
            [
              "v60.0",
              0.56
            ],
            [
              "v59.0",
              0.45
            ],
            [
              "v58.0",
              0.49
            ],
            [
              "v57.0",
              0.32
            ],
            [
              "v56.0",
              0.29
            ],
            [
              "v55.0",
              0.79
            ],
            [
              "v54.0",
              0.18
            ],
            [
              "v51.0",
              0.13
            ],
            [
              "v49.0",
              2.16
            ],
            [
              "v48.0",
              0.13
            ],
            [
              "v47.0",
              0.11
            ],
            [
              "v43.0",
              0.17
            ],
            [
              "v29.0",
              0.26
            ]
          ]
        },
        {
          name: "Firefox",
          id: "Firefox",
          data: [
            [
              "v58.0",
              1.02
            ],
            [
              "v57.0",
              7.36
            ],
            [
              "v56.0",
              0.35
            ],
            [
              "v55.0",
              0.11
            ],
            [
              "v54.0",
              0.1
            ],
            [
              "v52.0",
              0.95
            ],
            [
              "v51.0",
              0.15
            ],
            [
              "v50.0",
              0.1
            ],
            [
              "v48.0",
              0.31
            ],
            [
              "v47.0",
              0.12
            ]
          ]
        },
        {
          name: "Internet Explorer",
          id: "Internet Explorer",
          data: [
            [
              "v11.0",
              6.2
            ],
            [
              "v10.0",
              0.29
            ],
            [
              "v9.0",
              0.27
            ],
            [
              "v8.0",
              0.47
            ]
          ]
        },
        {
          name: "Safari",
          id: "Safari",
          data: [
            [
              "v11.0",
              3.39
            ],
            [
              "v10.1",
              0.96
            ],
            [
              "v10.0",
              0.36
            ],
            [
              "v9.1",
              0.54
            ],
            [
              "v9.0",
              0.13
            ],
            [
              "v5.1",
              0.2
            ]
          ]
        },
        {
          name: "Edge",
          id: "Edge",
          data: [
            [
              "v16",
              2.6
            ],
            [
              "v15",
              0.92
            ],
            [
              "v14",
              0.4
            ],
            [
              "v13",
              0.1
            ]
          ]
        },
        {
          name: "Opera",
          id: "Opera",
          data: [
            [
              "v50.0",
              0.96
            ],
            [
              "v49.0",
              0.82
            ],
            [
              "v12.1",
              0.14
            ]
          ]
        }
      ]
    }
  });






})