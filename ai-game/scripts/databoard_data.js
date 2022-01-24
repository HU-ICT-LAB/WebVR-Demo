
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
        if (Math.round(time) % 4 === 0) {
            if (connected) {
                if (!this.con) {
                    this.con = true
                }
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
        var game_played = document.querySelector("#game_played")

        if (connected) {
            if (!this.con) {
                // this.con = true
                //last movement data:
                client.subscribe('hbo_ict_vr_request_simplified_lastmovement') //topic to receive the lastmovement data back
                client.publish('hbo_ict_vr_request_database', "{0}") //topic to ask the lastmovement data back
                mqtt_add_topic_callback('hbo_ict_vr_request_simplified_lastmovement', function (topic, message) {
                    var LastMovement = document.querySelector("#LastMovement") //add the message from the topic to the databoard
                    LastMovement.setAttribute('text', 'value', message.toString())
                })

                if ((game_played.getAttribute('text').value).toString() === "True") {
                    client.subscribe('hbo_ict_vr_request_simplified_lastgame_total_controller_distance')
                    client.subscribe('hbo_ict_vr_request_simplified_lastgame_movingtime')
                    client.subscribe('hbo_ict_vr_request_simplified_lastgame_calories_burned')
                    client.subscribe('hbo_ict_vr_request_simplified_allgames_total_controller_distance')
                    client.publish('hbo_ict_vr_request_database_aftergame', "{0}") //topic to receive the lastmovement data back

                    mqtt_add_topic_callback('hbo_ict_vr_request_simplified_lastgame_total_controller_distance', function (topic, message) {
                        var cur_total_controller_distance = document.querySelector("#cur_total_controller_distance") //add the message from the topic to the databoard
                        cur_total_controller_distance.setAttribute('text', 'value', message.toString().substring(0, 7) + "m")
                    })
                    mqtt_add_topic_callback('hbo_ict_vr_request_simplified_lastgame_movingtime', function (topic, message) {
                        var movingtime = document.querySelector("#movingtime") //add the message from the topic to the databoard
                        movingtime.setAttribute('text', 'value', message.toString().substring(0, 7) + "s")
                    })
                    mqtt_add_topic_callback('hbo_ict_vr_request_simplified_lastgame_calories_burned', function (topic, message) {
                        var calories_burned = document.querySelector("#calories_burned") //add the message from the topic to the databoard
                        calories_burned.setAttribute('text', 'value', message.toString().substring(0, 7) + "calorie")
                    })
                    mqtt_add_topic_callback('hbo_ict_vr_request_simplified_allgames_total_controller_distance', function (topic, message) {
                        var all_total_controller_distance = document.querySelector("#all_total_controller_distance") //add the message from the topic to the databoard
                        all_total_controller_distance.setAttribute('text', 'value', message.toString().substring(0, 7) + "m")
                        game_played.setAttribute('text', 'value', "False")
                    })

                }
                //punch moves data:
                //TODO: get hand movements from the database with a subscribed topic and set it to it's databoard attribute

                //fastest punch data:
                //TODO: get fast movements from the database with a subscribed topic and set it to it's databoard attribute

                //slowest punch data:
                //TODO: get slow movements from the database with a subscribed topic and set it to it's databoard attribute
            }
        }
    }
});