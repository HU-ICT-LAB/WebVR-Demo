
const options = {
    // Clean session
    clean: true,
    connectTimeout: 80000,
    // Auth
    rejectUnauthorized: false,
    protocol: 'wss',
    port: 8084,
    path: "/mqtt"
  }


var client  = mqtt.connect('wss://'+"broker.emqx.io", options)
var connected = false

client.on('connect', function () {
  console.log("i am connected")
  connected = true
})

var function_dict = {}

function mqtt_callback(topic, message){
    var functions = function_dict[topic]
    for(let i = 0; i < functions.length; i++){
        functions[i](topic, message)
    }
    functions = function_dict[""]
    for(let i = 0; i < functions.length; i++){
        functions[i](topic, message)
    }
}

client.on('message', mqtt_callback)

function mqtt_add_topic_callback(topic, callback){
    if (topic in function_dict){
        function_dict[topic].push(callback)
    }else{
        function_dict[topic] = [callback]
    }
}



