
/**
 * This is a component to create an arrow that points torwards the given target using the target_id
 * It gets the position of the target and the world position of the right hand controller. 
 * It uses the angle bewteen those positions to set the rotation of the arrow
 */
AFRAME.registerComponent('compas',{
    schema: {
        target_id: {default: "#House_build"}
    },

    /**
     * This function generates the entities required for the compas, and fetches the objects it needs for calulations
     * It also adds two event listeners to the gripper to show and hide the compas arrow
     */
    init: function() {
        this.compas_container = document.createElement("a-entity")
        this.compas_container.setAttribute("id", "compas_container")
        this.compas_container.setAttribute("position","0 -0.1 0")

        this.arrow = document.createElement("a-cone")
        this.arrow.setAttribute("color", "red")
        this.arrow.setAttribute("radius-bottom", 2)
        this.arrow.setAttribute("radius-top", 0)
        this.arrow.setAttribute("id", "arrow")
        this.arrow.setAttribute("rotation", "-90 0 0")
        this.arrow.setAttribute("position", "0 0 -0.1")
        this.arrow.setAttribute("scale", "0.004 0.04 0.004")
        this.arrow.setAttribute('material', 'opacity: 0.0; transparent: true')

        this.compas_container.appendChild(this.arrow)
        this.el.sceneEl.querySelector("#rig").appendChild(this.compas_container)


        this.r_hand = this.el.sceneEl.querySelector("#rightcontrl")          
        this.house_pos = this.el.sceneEl.querySelector(this.data.target_id).getAttribute("position")
        this.rotation = this.compas_container.getAttribute("rotation")

        this.r_hand.addEventListener("gripdown", function(){
            this.arrow.setAttribute('material', 'opacity: 1.0; transparent: false')
        }.bind(this))
        this.r_hand.addEventListener("gripup", function(){
            this.arrow.setAttribute('material', 'opacity: 0.0; transparent: true')
        }.bind(this))
    },
    /**
     * This function calculates the angle the compas should be in, and it updates the arrows positions
     */
    tick: function() {

        this.compas_container.setAttribute("position", this.r_hand.getAttribute("position"))
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(this.r_hand.object3D.matrixWorld);
        var dir = Math.atan2(worldPos.x - this.house_pos.x, worldPos.z - this.house_pos.z) * 180 / Math.PI;                    
        this.rotation.y = dir
        this.compas_container.setAttribute("rotation", this.rotation)
    }
})

/**
 * This is a wrapper entity around the compas component, to make it easier to use the compas component in the html files
 */
AFRAME.registerPrimitive('a-compas', {
    defaultComponents: {
      compas: {},
    },
    mappings: {
        target_id: 'compas.target_id'
    }
});