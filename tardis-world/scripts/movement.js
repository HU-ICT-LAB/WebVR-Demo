/**
 * A component to let the user move forward using the joysticks
 */
AFRAME.registerComponent('thumbstick-logging',{
    //initialisation function of the component
    init: function () {
        //set a event listener for this component
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);

    },
    /**
     * Function that moves the player forward based on joystick movement.
     * @param {any} evt 
     */
    logThumbstick: function (evt) {
        var rig = document.querySelector("#rig")
        var player = document.querySelector("#camera")
        var angle = player.getAttribute("rotation")
        var x = (-evt.detail.y)/25 * Math.cos(angle.y * Math.PI / 180)
        var y = (-evt.detail.y)/25 * Math.sin(angle.y * Math.PI / 180)
        var pos = rig.getAttribute("position")
        pos.x -= y;
        pos.z -= x;
        rig.setAttribute("position", pos);
    }
});

/**
 * This function adds a value to the front of a array, and pops the last item if the length of the array is longer than "length".
 * It functions like a queue
 * @param {Array} items 
 * @param {Number} length 
 * @param {number} item 
 * @returns {Array} the new array with the added value
 */
function queueAdder(items, length, item){
    if (items.length < length){
        items.unshift(item)
    }else{
        items.unshift(item)
        items.pop()
    }
    return items
}


/**
 * This function returns the total value/distance of travel based on the positions in the vals array.
 * @param {Array} vals 
 * @returns {number} the total distance traveled
 */
function getTotalDistance(vals){
    var dist = 0
    for (let j = 0; j < vals.length-1; j++){
        dist += Math.abs(vals[j] - vals[j+1]) //calculate the diffrence and add it
    }
    return dist
}

/**
 * This function returns the total value/distance of travel based on the positions in the vals array.
 * @param {Array} vals 
 * @returns {number} the total distance traveled
 */
function getSummedDistance(vals){
    var dist = 0
    for (let j = 0; j < vals.length-1; j++){
        dist += vals[j] - vals[j+1] //calculate the diffrence and add it
    }
    return dist
}

/**
 * This function returns a new point made of a given point, this point is changed on the horizontal axises, the direction is based on rotation.
 * It will move forward in the given direction unless the distance value is negative, it will then move backwards
 * @param {Vector3} start_pos the starting position
 * @param {Number} rotation the direction to move in
 * @param {Number} distance the distance to move
 */
function move_pos(start_pos, rotation, distance){
    var x = distance * Math.cos(rotation.y * Math.PI / 180) 
    var y = distance * Math.sin(rotation.y * Math.PI / 180)
    start_pos.x -= y;
    start_pos.z -= x;
    return start_pos
}

//A mulitiplier used by the relative-movement component, it changed the speed of acceleration, 1 is doubled, 0 is no acceleration and negative slows you down after -1 you got backwards
var movement_multiplier = 0

/**
 * A component that can influence the speed you walk with in the game. 
 */
AFRAME.registerComponent('relative-movement',{
    /**
     * Initialisation function of the component
     */
    init: function() {
        var head = document.querySelector("#camera")
        this.current_position = head.getAttribute('position')
        this.last_position = new THREE.Vector3();  
        this.doing = false
        this.con = false
    },

    /**
     * This function changes the acceleration and movement of the user
     * By moving the camera rig that the player in the same or oposite direction we can change the players percieved speed.
     */
    tick: function() {
        if (connected){
            if(!this.con){
                //recieve the speed value from the mqtt server
                client.subscribe('hbo-ict-walking-speed')
                mqtt_add_topic_callback('hbo-ict-walking-speed', function(topic, message){
                    console.log(JSON.parse(message))
                    movement_multiplier = parseFloat(JSON.parse(message), 10);
                })
                this.con = true

            }
        }


        var rig = document.querySelector("#rig")
        var head = document.querySelector("#camera")



        this.current_position = head.getAttribute('position')


        var ps = new THREE.Vector3();
        ps.x = this.current_position.x
        ps.y = this.current_position.y
        ps.z = this.current_position.z
        ps = move_pos(ps, head.getAttribute('rotation'), -0.09) //get the correct position of the player head and not the headset



        //we want to wait one tick before we start changing the percieved movement, so we can get a "last_position" value first
        if(this.doing){
            var diff = new THREE.Vector3();
            diff.x = ps.x - this.last_position.x
            diff.z = ps.z - this.last_position.z
            diff.y = ps.y - this.last_position.y
            var new_pos = rig.getAttribute('position')

            var new_diff = new THREE.Vector3();
            
            new_diff.x = new_pos.x +(diff.x * movement_multiplier)
            new_diff.z = new_pos.z +(diff.z * movement_multiplier)
            new_diff.y = new_pos.y //we do not change the Y movement as this would break the imersion

            rig.setAttribute('position', new_diff)
            this.last_position.x = ps.x
            this.last_position.z = ps.z
            this.last_position.y = ps.y
            
        }
        if(!this.doing){
            this.doing = true
        }
    }
})


/**
 * A component to move the player forward in the world based on head movement
 * If the player moves up and down but not sideways or forward we can conclude the player is jogging in place
 * We can then move the player forward in the direction of the controlers so the player can still look arround.
 */
var headbobmoving_value = 0

AFRAME.registerComponent('x-button-listener', {
    init: function () {
        this.el.addEventListener('xbuttondown', function () {
            headbobmoving_value += 1
        }.bind(this));
        this.el.addEventListener('xbuttonup', function () {
            headbobmoving_value -= 1
        }.bind(this));
    }
  });

  AFRAME.registerComponent('a-button-listener', {
    init: function () {
        this.el.addEventListener('abuttondown', function () {
            headbobmoving_value += 1
        }.bind(this));
        this.el.addEventListener('abuttonup', function () {
            headbobmoving_value -= 1
        }.bind(this));
    }
  });





AFRAME.registerComponent('headbob-movement',{
    init: function() {
        this.y_positions = []
        this.x_positions = []
        this.z_positions = []
        this.x_rotation = []
        this.length = 20 //the maximum amount of values stored
    },

    tick: function () {
        //get the objects needed to perform the calculations
        var rig = document.querySelector("#rig")
        var player = document.querySelector("#camera")
        var head = document.querySelector("#camera_head")
        var right = document.querySelector("#rightcontrl")
        var left = document.querySelector("#leftcontrl")

        //add the positions of the headset to the lists
        this.z_positions = queueAdder(this.z_positions,this.length, player.getAttribute('position').z)
        this.x_positions = queueAdder(this.x_positions,this.length, player.getAttribute('position').x)
        this.x_rotation = queueAdder(this.x_rotation,this.length, player.getAttribute('rotation').x)


        // if( getTotalDistance(this.y_positions)/this.length > 0.003 && getSumDistance(this.y_positions) < 0.2){

        // }
        //check if the player has not moved too much on the x and z axis and if the rotation on the x axis is minimal.
        if(headbobmoving_value > 0 && getTotalDistance(this.x_positions) < 0.50 && getTotalDistance(this.z_positions) < 0.50 && getTotalDistance(this.x_rotation)/this.length < 10){
            //check if the distance rotated on the x axis is minimal
            if (getTotalDistance(this.x_rotation)/this.length < 1.5){
                this.y_positions = queueAdder(this.y_positions,this.length, player.getAttribute('position').y)
                
                
                //to get the angle, get the positions of the two controllers, then get the average position of those two (the middle), then get the angle of the line of that point to the headset, move to that direction
                var posl = left.getAttribute('position')
                var posr = right.getAttribute('position')
                var posm = new THREE.Vector3();
                posm.x = (posl.x + posr.x)/2
                posm.y = (posl.y + posr.y)/2
                posm.z = (posl.z + posr.z)/2
                var posh = player.getAttribute('position')
                var ps = new THREE.Vector3();
                ps.x = posh.x
                ps.y = posh.y
                ps.z = posh.z
                ps = move_pos(ps, player.getAttribute('rotation'), -0.08) //get the position of the player head in the headset
                var dir = Math.atan2(ps.x - posm.x, ps.z - posm.z) * 180 / Math.PI; //find the angle between the head and the middle point of controllers

                
                var dist = getTotalDistance(this.y_positions)
                if(dist/this.length > 0.003){ //check if the distance traveled on the y axis is large enough
                    if (dist/4 > 0.3){
                        dist = 0.3*4
                    }
                    var x = (dist)/4 * Math.cos(dir * Math.PI / 180) 
                    var y = (dist)/4 * Math.sin(dir * Math.PI / 180)
                    var pos = rig.getAttribute("position")
                    pos.x -= y;
                    pos.z -= x;
                    rig.setAttribute("position", pos);
                }
            }else{
                this.y_positions = queueAdder(this.y_positions,this.length, this.y_positions[0])
            }
        }
    }
});