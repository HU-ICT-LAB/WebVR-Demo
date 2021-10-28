
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




AFRAME.registerComponent('mqtt-logger', {

    init: function () {
        this.time = 0;
        this.con = false
    },
    tick: function (time, timeDelta) {
        if (connected){
            if (!this.con){
                client.on('message', function (topic, message) {
                    // message is Buffer
                    console.log(message.toString())
                })
                this.con = true
            }

            var left_controller = this.el.querySelector("#left_controller")
            var right_controller = this.el.querySelector("#right_controller")
            var headset = this.el.querySelector("#camera")

            var packet = {}
            
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

AFRAME.registerComponent('mqtt-pos-setter', {

    init: function () {
        this.time = 0;
        this.con = false
        
    },
    tick: function (time, timeDelta) {
        if (connected){
            if(!this.con){
                client.subscribe('hbo_ict_vr_game_player_stats')

                this.con = true
                client.on('message', function (topic, message) {
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

                    console.log(message.toString())
                  })
            }
        }
    }
});