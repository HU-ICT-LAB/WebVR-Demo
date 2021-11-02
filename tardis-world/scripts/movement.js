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
        var angle = player.getAttribute("rotation")

        this.z_positions = queueAdder(this.z_positions,this.length, player.getAttribute('position').z)
        this.x_positions = queueAdder(this.x_positions,this.length, player.getAttribute('position').x)
        this.x_rotation = queueAdder(this.x_rotation,this.length, player.getAttribute('rotation').x)

        if(getTotalDistance(this.x_positions) < 0.50 && getTotalDistance(this.z_positions) < 0.50 && getTotalDistance(this.x_rotation)/this.length < 10){
            if (getTotalDistance(this.x_rotation)/this.length < 1.5){
                this.y_positions = queueAdder(this.y_positions,this.length, player.getAttribute('position').y)

                
                var dist = getTotalDistance(this.y_positions)
                if(dist/this.length < 0.01){
                    if (dist/4 > 0.3){
                        dis = 0.3*4
                    }
                    var x = (dist)/4 * Math.cos(angle.y * Math.PI / 180)
                    var y = (dist)/4 * Math.sin(angle.y * Math.PI / 180)
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