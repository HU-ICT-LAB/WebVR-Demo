AFRAME.registerComponent('thumbstick-logging',{
    init: function () {
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);

    },
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

function queueAdder(items, length, item){
    if (items.length < length){
        items.unshift(item)
    }else{
        items.unshift(item)
        items.pop()
    }
    return items
}


function getTotalDistance(vals){
    var dist = 0
    for (let j = 1; j < vals.length-1; j++){
        dist += Math.abs(vals[j] - vals[j+1])
    }
    return dist
}

function move_pos(start_pos, rotation, distance){
    var x = distance * Math.cos(rotation.y * Math.PI / 180) 
    var y = distance * Math.sin(rotation.y * Math.PI / 180)
    start_pos.x -= y;
    start_pos.z -= x;
    return start_pos
}

var movement_multiplier = 10

AFRAME.registerComponent('relative-movement',{
    init: function() {
        var head = document.querySelector("#camera")
        this.current_position = head.getAttribute('position')
        this.last_position = new THREE.Vector3();  
        this.doing = false
    },

    tick: function() {
        var rig = document.querySelector("#rig")
        var head = document.querySelector("#camera")



        this.current_position = head.getAttribute('position')


        var ps = new THREE.Vector3();
        ps.x = this.current_position.x
        ps.y = this.current_position.y
        ps.z = this.current_position.z
        ps = move_pos(ps, head.getAttribute('rotation'), -0.09)




        if(this.doing){
            var diff = new THREE.Vector3();
            diff.x = ps.x - this.last_position.x
            diff.z = ps.z - this.last_position.z
            diff.y = ps.y - this.last_position.y
            var new_pos = rig.getAttribute('position')

            var new_diff = new THREE.Vector3();
            
            new_diff.x = new_pos.x +(diff.x * movement_multiplier)
            new_diff.z = new_pos.z +(diff.z * movement_multiplier)
            new_diff.y = new_pos.y

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


AFRAME.registerComponent('headbob-movement',{
    init: function() {
        this.y_positions = []
        this.x_positions = []
        this.z_positions = []
        this.x_rotation = []
        this.length = 20
    },

    tick: function () {
        var rig = document.querySelector("#rig")
        var player = document.querySelector("#camera")
        var head = document.querySelector("#camera_head")
        var right = document.querySelector("#rightcontrl")
        var left = document.querySelector("#leftcontrl")

        this.z_positions = queueAdder(this.z_positions,this.length, player.getAttribute('position').z)
        this.x_positions = queueAdder(this.x_positions,this.length, player.getAttribute('position').x)
        this.x_rotation = queueAdder(this.x_rotation,this.length, player.getAttribute('rotation').x)

        if(getTotalDistance(this.x_positions) < 0.50 && getTotalDistance(this.z_positions) < 0.50 && getTotalDistance(this.x_rotation)/this.length < 10){
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
                ps = move_pos(ps, player.getAttribute('rotation'), -0.08)
                var dir = Math.atan2(ps.x - posm.x, ps.z - posm.z) * 180 / Math.PI;

                var dist = getTotalDistance(this.y_positions)
                if(dist/this.length > 0.003){
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