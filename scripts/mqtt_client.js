// a struct containing settings for the mqtt connection
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


  //connect with the mqtt client, wss stands for secure websocket and broker.emqx.io is the broker we connect to
var client  = mqtt.connect('wss://broker.emqx.io', options)
var connected = false

//set the callback for the onconnect event of the mqtt client
client.on('connect', function () {
  console.log("i am connected")
  connected = true
})

//a dictionairy of topic-list pairs, the list contains functions
var function_dict = {}


/**
 * This function is the callback used by the mqtt client, it calls all functions asociated with a topic by the mqtt_add_topic_callback function
 * @author Daan Westerhof
 * @param {String} topic the topic recieved by the client 
 * @param {String} message the message recieved by the client
 */
function mqtt_callback(topic, message){
    console.log(JSON.parse(message))
    var functions = function_dict[topic]
    for(let i = 0; i < functions.length; i++){
        functions[i](topic, message)
    }
    if("" in function_dict){
        functions = function_dict[""]
        for(let i = 0; i < functions.length; i++){
            functions[i](topic, message)
        }
    }
}

//set the callback for the on message event of the mqtt client
client.on('message', mqtt_callback)

/**
 * This function adds a callback function to the functions dictionariy, the function will be executed when a message is recieved on the specified topic.
 * @author Daan Westerhof
 * @param {String} topic the topic on wich we want to execute a function
 * @param {String} callback the function that needs to be executed. Should have 2 parameters: (Topic=string, message=string)
 */
function mqtt_add_topic_callback(topic, callback){
    if (topic in function_dict){
        function_dict[topic].push(callback)
    }else{
        function_dict[topic] = [callback]
    }
}






