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
    for (let j = 1; i < vals.length; j++){
        dist += MATH.abs(vals[0] - vals[j])
    }
    return dist
}


AFRAME.registerComponent('headbob-movement',{
    init: function() {
        this.y_positions = []
        this.x_positions = []
        this.z_positions = []
        this.length = 20
    },

    tick: function () {
        var rig = document.querySelector("#rig")
        var player = document.querySelector("#camera")
        var angle = player.getAttribute("rotation")

        this.z_positions = queueAdder(this.z_positions,this.length, player.getAttribute('position').z)
        this.x_positions = queueAdder(this.x_positions,this.length, player.getAttribute('position').x)

        if(getTotalDistance(this.x_positions) < 0.20 && getTotalDistance(this.z_positions) < 0.20 ){

            this.y_positions = queueAdder(this.y_positions,this.length, player.getAttribute('position').y)
            var dist = getTotalDistance(this.y_positions)
            if (dist > 0.2){
                var x = (dist)/25 * Math.cos(angle.y * Math.PI / 180)
                var y = (dist)/25 * Math.sin(angle.y * Math.PI / 180)
                var pos = rig.getAttribute("position")
                pos.x -= y;
                pos.z -= x;
                rig.setAttribute("position", pos);
            }
        }
    }
});