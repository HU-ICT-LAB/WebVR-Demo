
/**
 * This is a component to create an arrow that points torwards the given target using the target_id
 * It gets the position of the target and the world position of the right hand controller. 
 * It uses the angle bewteen those positions to set the rotation of the arrow
 */
AFRAME.registerComponent('compass',{
    schema: {
        target_id: {default: ""}
    },

    /**
     * This function generates the entities required for the compass, and fetches the objects it needs for calulations
     * It also adds two event listeners to the gripper to show and hide the compass arrow
     */
    init: function() {
        this.compass_container = document.createElement("a-entity")
        this.compass_container.setAttribute("id", "compass_container")
        this.compass_container.setAttribute("position","0 -0.1 0")

        this.arrow = document.createElement("a-cone")
        this.arrow.setAttribute("color", "red")
        this.arrow.setAttribute("radius-bottom", 2)
        this.arrow.setAttribute("radius-top", 0)
        this.arrow.setAttribute("id", "arrow")
        this.arrow.setAttribute("rotation", "-90 0 0")
        this.arrow.setAttribute("position", "0 0 -0.1")
        this.arrow.setAttribute("scale", "0.004 0.04 0.004")
        this.arrow.setAttribute('material', 'opacity: 0.0; transparent: true')

        this.compass_container.appendChild(this.arrow)
        this.el.sceneEl.querySelector("#rig").appendChild(this.compass_container)


        this.r_hand = this.el.sceneEl.querySelector("#rightcontrl")          
        this.target = this.el.sceneEl.querySelector(this.data.target_id)
        this.rotation = this.compass_container.getAttribute("rotation")

        this.r_hand.addEventListener("gripdown", function(){
            this.arrow.setAttribute('material', 'opacity: 1.0; transparent: false')
        }.bind(this))
        this.r_hand.addEventListener("gripup", function(){
            this.arrow.setAttribute('material', 'opacity: 0.0; transparent: true')
        }.bind(this))
    },
    /**
     * This function calculates the angle the compass should be in, and it updates the arrows positions
     */
    tick: function() {

        this.compass_container.setAttribute("position", this.r_hand.getAttribute("position"))
        var right_controll_pos = new THREE.Vector3();
        right_controll_pos.setFromMatrixPosition(this.r_hand.object3D.matrixWorld);

        var target_world_pos = new THREE.Vector3();
        target_world_pos.setFromMatrixPosition(this.target.object3D.matrixWorld);


        var dir = Math.atan2(right_controll_pos.x - target_world_pos.x, right_controll_pos.z - target_world_pos.z) * 180 / Math.PI;                    
        this.rotation.y = dir
        this.compass_container.setAttribute("rotation", this.rotation)
    },

    /**
     * Set a new target for the compass to point to
     * @param {string} target_id The id of the new target
     */
    setTarget: function(target_id) {
        this.data.target_id = target_id
        this.target = this.el.sceneEl.querySelector(target_id)
    }

})

/**
 * This is a wrapper entity around the compass component, to make it easier to use the compass component in the html files
 */
AFRAME.registerPrimitive('a-compass', {
    defaultComponents: {
      compass: {},
    },
    mappings: {
        target_id: 'compass.target_id'
    }
});