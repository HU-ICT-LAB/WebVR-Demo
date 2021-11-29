
/**
 * A component that can be attached to the camera rig. it loggs the information of the headset and controllers over mqtt
 * This information can then be used on another webpage or device.
 */
AFRAME.registerComponent('mqtt-logger', {
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
                    console.log(message.toString())
                })
                this.con = true
            }

            var left_controller = this.el.querySelector("#left_controller")
            var right_controller = this.el.querySelector("#right_controller")
            var headset = this.el.querySelector("#camera")

            var packet = {}
            //if we are connected to the mqtt broker, publish the data
            if (connected){
                var pos = left_controller.getAttribute('position')
                var obj = {'x': pos.x.toPrecision(8), 'y': pos.y.toPrecision(8), 'z': pos.z.toPrecision(8)};
                packet['left_controller_pos'] = obj


                pos = right_controller.getAttribute('position')
                obj = {'x': pos.x.toPrecision(8), 'y': pos.y.toPrecision(8), 'z': pos.z.toPrecision(8)};
                packet['right_controller_pos'] = obj

                pos = headset.getAttribute('position')
                obj = {'x': pos.x.toPrecision(8), 'y': pos.y.toPrecision(8), 'z': pos.z.toPrecision(8)};
                packet['headset_pos'] = obj

                pos = left_controller.getAttribute('rotation')
                obj = {'x': pos.x.toPrecision(8), 'y': pos.y.toPrecision(8), 'z': pos.z.toPrecision(8)};
                packet['left_controller_rot'] = obj

                pos = right_controller.getAttribute('rotation')
                obj = {'x': pos.x.toPrecision(8), 'y': pos.y.toPrecision(8), 'z': pos.z.toPrecision(8)};
                packet['right_controller_rot'] = obj

                pos = headset.getAttribute('rotation')
                obj = {'x': pos.x.toPrecision(8), 'y': pos.y.toPrecision(8), 'z': pos.z.toPrecision(8)};
                packet['headset_rot'] = obj
                client.publish('hbo_ict_vr_game_player_stats', JSON.stringify(packet))
            }
        }

    }
});

/**
 * A component that can be attached to a entity
 * It required the document to have a object with the id: "left_hand", "right_hand" and "head". 
 * These will be given the position and rotation recieved on the topic: "hbo_ict_vr_game_player_stats" of the mqtt client.
 */
AFRAME.registerComponent('mqtt-pos-setter', {
    /**
     * Initialisation function of the component
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
                client.subscribe('hbo_ict_vr_game_player_stats')

                this.con = true
                //The setting of locations isnt actualy a component function but a mqtt claback function, that is why this is only called once, but it is in the tick function as we can only set this once the mqtt client is connected.
                mqtt_add_topic_callback('hbo_ict_vr_game_player_stats', function (topic, message) {
                    var left_controller = document.querySelector("#left_hand")
                    var right_controller = document.querySelector("#right_hand")
                    var headset = document.querySelector("#head")
                    // message is Buffer
                    var pos = new THREE.Vector3();

                        var obj = JSON.parse(message);
                        var set = obj['left_controller_pos']
                        pos.x = set.x;
                        pos.y = set.y;
                        pos.z = set.z;
                        left_controller.setAttribute('position', pos)

                        set = obj['right_controller_pos']
                        pos.x = set.x;
                        pos.y = set.y;
                        pos.z = set.z;
                        right_controller.setAttribute('position', pos)


                        set = obj['headset_pos']
                        pos.x = set.x;
                        pos.y = set.y;
                        pos.z = set.z;
                        headset.setAttribute('position', pos)


                        set = obj['left_controller_rot']
                        pos.x = set.x;
                        pos.y = set.y;
                        pos.z = set.z;
                        left_controller.setAttribute('rotation', pos)


                        set = obj['right_controller_rot']
                        pos.x = set.x;
                        pos.y = set.y;
                        pos.z = set.z;
                        right_controller.setAttribute('rotation', pos)

                        set = obj['headset_rot']
                        pos.x = set.x;
                        pos.y = set.y;
                        pos.z = set.z;
                        headset.setAttribute('rotation', pos)
                    //log the recieved positions and rotations to the console
                    console.log(message.toString())
                  })
            }
        }
    }
});