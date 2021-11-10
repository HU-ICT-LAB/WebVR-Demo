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

