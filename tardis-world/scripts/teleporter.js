var teleporting = false

AFRAME.registerComponent('teleporter',{
    schema: {
        teleporter_id: {default: 0},
        target_id: {default: 1},
      },
    /**
     * Initialisation function of the component
     * It adds the event listeners and makes sure the buttons are pressable
     */
    init: function(){
        this.home_position = new THREE.Vector3();
        this.el.setAttribute("button_listener", "button_channel: teleporter_" + this.data.teleporter_id)
        this.el.addEventListener('teleporter_pressed', this.teleportsequence.bind(this))
        this.el.addEventListener("player_teleported", this.end_animation.bind(this))
        this.el.addEventListener("start_teleport", this.start_animation.bind(this))

        var tube = document.createElement("a-cylinder")
        tube.setAttribute("material","side: double; transparent: true; opacity: 0.3")
        tube.setAttribute("open-ended","true")
        tube.setAttribute("color","#AAAAFD")
        tube.setAttribute("height", "0")
        tube.setAttribute("radius", "1")
        tube.setAttribute("id", "tube_" + this.data.teleporter_id)
        tube.setAttribute("animation__lower", "property: object3D.position.y; from: 2; to: 1; easing: easeInOutQuad; dur: 2000; loop: false; startEvents: teleporter_initiated;")
        tube.setAttribute("animation__sizer", "property: height; from: 0; to: 2; easing: easeInOutQuad; dur: 2000; loop: false; startEvents: teleporter_initiated;")
        tube.setAttribute("animation__fullify", "property: material.opacity; from: 0.3; to: 1; dur: 2000; startEvents: teleporter_initiated_2;")
        
        
        tube.setAttribute("animation__rise", "property: object3D.position.y; from: 1; to: 2; easing: easeInOutQuad; dur: 2000; loop: false; startEvents: player_recieved_2")
        tube.setAttribute("animation__shrink", "property: height; from: 2; to: 0; easing: easeInOutQuad; dur: 2000; loop: false; startEvents: player_recieved_2")
        tube.setAttribute("animation__glassify", "property: material.opacity; from: 1; to: 0.3; dur: 2000; startEvents: player_recieved;")
        
        tube.setAttribute("button_listener", "button_channel: teleporter_" + this.data.teleporter_id)
        this.el.appendChild(tube);

        var top = document.createElement("a-cylinder")
        top.setAttribute("position", "0 2 0")
        top.setAttribute("height", "0.15")
        top.setAttribute("radius",  "1.2")
        top.setAttribute("color", "#FFFFFF")
        this.el.appendChild(top)

        var floor = document.createElement("a-cylinder")
        floor.setAttribute("position", "0 0 0")
        floor.setAttribute("height", "0.15")
        floor.setAttribute("radius",  "1.2")
        floor.setAttribute("color", "#FFFFFF")
        this.el.appendChild(floor)

        var base = document.createElement("a-box")
        base.setAttribute("height", "1")
        base.setAttribute("width", "0.1")
        base.setAttribute("depth", "0.1")
        base.setAttribute("color", "#FFFFFF")
        base.setAttribute("position", "0 0.5 0")
        this.el.appendChild(base)

        // var button = document.createElement("a-entity")
        // button.setAttribute("button", "button_channel: teleporter_" + this.data.teleporter_id +"; event_start: teleporter_pressed;")
        // button.setAttribute("position", "0 1.05 0")
        // this.el.appendChild(button)

        var button = document.createElement("a-button")
        button.setAttribute("button_channel", "teleporter_" + this.data.teleporter_id)
        button.setAttribute("event_start","teleporter_pressed")
        button.setAttribute("position", "0 1.05 0")
        this.el.appendChild(button)

    },

    start_animation: function(){
        var tub = this.el.querySelector("#tube_"+ this.data.teleporter_id)
        tub.emit("teleporter_initiated")
        setTimeout(function() {
            var tub = this.el.querySelector("#tube_"+ this.data.teleporter_id)
            tub.emit("teleporter_initiated_2")
        }.bind(this), 2000);
    },

    end_animation: function(){
        var tub = this.el.querySelector("#tube_"+ this.data.teleporter_id)
        tub.emit("player_recieved")
        setTimeout(function() {
            tub.emit("player_recieved_2")
            teleporting = false
        }.bind(this), 2000);
    },

    teleportsequence: function(){
        var TeleporterList = this.el.sceneEl.querySelectorAll("[teleporter]")
        var Destteleporter
        for (i = 0; i <  TeleporterList.length; i++){
            if(TeleporterList[i].components.teleporter.data.teleporter_id == this.data.target_id){
                Destteleporter = TeleporterList[i]
                break
            }
        }
        if( !teleporting){
            teleporting = true
            this.start_animation()
            Destteleporter.emit("start_teleport")

            setTimeout( function() {
                this.teleportPlayer(Destteleporter)
            }.bind(this), 4500);
        }
    },

    teleportPlayer: function(target){
        var cur_location = this.el.getAttribute('position').clone()
        var dest_location = target.getAttribute('position').clone()
        var dif = new THREE.Vector3
        dif.x = dest_location.x - cur_location.x
        dif.y = dest_location.y - cur_location.y
        dif.z = dest_location.z - cur_location.z

        var rig = this.el.sceneEl.querySelector("#rig")
        var pos = rig.getAttribute("position")
        pos.add(dif)
        rig.setAttribute("position", pos)
        target.emit("player_teleported")
        this.end_animation()
    }
      
})


AFRAME.registerPrimitive('a-teleporter', {
    // Attaches the `ocean` component by default.
    // Defaults the ocean to be parallel to the ground.
    defaultComponents: {
      teleporter: {},
      position: {x:0, y:0, z:0}
    },
  
    // Maps HTML attributes to the `ocean` component's properties.
    mappings: {
      teleporter_id: 'teleporter.teleporter_id',
      target_id: 'teleporter.target_id'
    }
});