

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
     * Function that is executed every tick, it gets the controllers and headsets current position and rotation
     * It then puts that information into a json object and sends it over mqtt to the topic: hbo_ict_vr_game_player_stats
     */
    tick: function () {
        if (connected){
            if (!this.con){
                mqtt_add_topic_callback("", function (topic, message) {
                    // message is Buffer
                    // console.log(message.toString())
                })
                this.con = true
            }
            var packet = getPositions(this.el) //runs the function with the element (camera) and gets from hand-positions, the positions
            client.publish('hbo_ict_vr_data_last_movement', JSON.stringify(packet))

            client.publish('hbo_ict_vr_request_data', "{0}")
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
     * A function that executes every tick, it gets player headset and controller positions and rotations over mqtt.
     * It then sets the rotations and positions of 3 objects called "left_hand", "right_hand" and "head"
     */
    tick: function () {
        if (connected){
            if(!this.con){
                //last movement data:
                client.subscribe('hbo_ict_vr_request_simplified_lastmovement') //topic to receive the lastmovement data back
                client.publish('hbo_ict_vr_request_data', "{0}") //topic to ask the lastmovement data back
                this.con = true
                //The setting of locations isnt actualy a component function but a mqtt claback function, that is why this is only called once, but it is in the tick function as we can only set this once the mqtt client is connected.
                mqtt_add_topic_callback('hbo_ict_vr_request_simplified_lastmovement', function (topic, message) {
                    var LastMovement = document.querySelector("#LastMovement") //add the message from the topic to the databoard
                    LastMovement.setAttribute('text','value', message.toString())
                  })
                //moves data:

            }
        }
    }
});