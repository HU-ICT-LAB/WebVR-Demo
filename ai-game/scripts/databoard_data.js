

/**
 * A component that can be attached to the camera rig. it loggs the information of the headset and controllers over mqtt
 * This information can then be used on another webpage or device.
 */
AFRAME.registerComponent('lastmovement-logger', {
    /**
     * The initialisation function of the component
     */
    init: function () {
        //tells if we already set an mqtt calback or subscription, can only be true after the mqtt client has been connected
        this.con = false
    },
    
    /**
     * Function that is executed every tick, it gets the controllers and headsets current position & name
     * It then puts that information into a json object and sends it over mqtt to the topic: hbo_ict_vr_data_last_movement
     * then it asks to request the data from the database from the topic: hbo_ict_vr_request_database
     */
    tick: function (time) {
        // console.log(time)
        if (Math.round(time) % 4 === 0) {
            if (connected) {
                if (!this.con) {
                    this.con = true
                }
                console.log("runned")
                var positions = getPositions(this.el) //runs the function with the element (camera) and gets from hand-positions, the positions
                var name = document.querySelector("#username");
                var current_name = name.getAttribute('text').value.substr(14)
                client.publish('hbo_ict_vr_data_last_movement', JSON.stringify([current_name, positions]))
                client.publish('hbo_ict_vr_request_database', "{0}")
            }
        }
    }
});

/**
 * A component that can be attached to a entity
 * It required the document to have a object with the id: "left_hand", "right_hand" and "head". 
 * These will be given the position and rotation recieved on the topic: "hbo_ict_vr_game_player_stats" of the mqtt client.
 */
AFRAME.registerComponent('databoard_updating', {
    /**
     * updates the databoard with subscribed topics
     */
    init: function () {
        //tells if we already set an mqtt calback or subscription, can only be true after the mqtt client has been connected
        this.con = false
    },
    /**
     * A function that executes every tick, it gets player controller positions over mqtt.
     * It then sets the positions to the databoard with setAttribute on the Lastmovement entity
     */
    tick: function () {
        if (connected){
            if(!this.con){
                this.con = true
                //last movement data:
                client.subscribe('hbo_ict_vr_request_simplified_lastmovement') //topic to receive the lastmovement data back
                client.publish('hbo_ict_vr_request_database', "{0}") //topic to ask the lastmovement data back
                mqtt_add_topic_callback('hbo_ict_vr_request_simplified_lastmovement', function (topic, message) {
                    var LastMovement = document.querySelector("#LastMovement") //add the message from the topic to the databoard
                    LastMovement.setAttribute('text','value', message.toString())
                  })

                //punch moves data:
                //TODO: get hand movements from the database with a subscribed topic and set it to it's databoard attribute

                //fastest punch data:
                //TODO: get fast movements from the database with a subscribed topic and set it to it's databoard attribute

                //slowest punch data:
                //TODO: get slow movements from the database with a subscribed topic and set it to it's databoard attribute

                //most punches data:
                //TODO: get most accurate punches today from the database with a subscribed topic and set it to it's databoard attribute

                //most punches data:
                //TODO: get total calories burned from movements today from the database with a subscribed topic and set it to it's databoard attribute
            }
        }
    }
});