/**
 * A simple class with no values, it is used to identify objects that can push buttons
 */
class hand{

}

/**
 * This is the button pressed callback function for the pushable component. It gets called when the button collides with a hand
 */
function colliding() {
    if( !this.collided){
        this.collided = true
        this.el.object3D.translateY(-0.03)
        
        var objects = this.el.sceneEl.querySelectorAll('[button_listener]')
        for(let i = 0; i < objects.length; i++){
            let chan = objects[i].components.button_listener.data.button_channel
            
            if (chan === this.data.button_channel || chan === "all"){
                objects[i].emit(this.data.event_start, {}, false)
            }
        }
    }
}

/**
 * This is the button released callback function for the pushable component. It gets called when the button no longer collides with a hand
 */
function collend(){
    if(this.collided){
        this.collided = false
        this.el.object3D.translateY(0.03)

        var objects = this.el.sceneEl.querySelectorAll('[button_listener]')
       
        for(let i = 0; i < objects.length; i++){
            let chan = objects[i].components.button_listener.data.button_channel
            
            if (chan === this.data.button_channel || chan === "all"){
                objects[i].emit(this.data.event_stop, {}, false)
            }
        }
    }
    
}

/**
 * A component used by the button component, it registers the collision with objects with the class hand and emits events to the objects that listen to button presses
 */
AFRAME.registerComponent('pushable',{
    schema: {
        color: {default: '#FFF'},
        event_start: {type: 'string', default: "buttonpressed"},
        event_stop: {type: 'string', default: "buttonreleased"},
        button_channel: {type: 'string', default: "button"}
      },
    /**
     * Initialisation function of the component
     * It adds the event listeners and makes sure the buttons are pressable
     */
    init: function(){
        this.collided = false
        this.home_position = new THREE.Vector3();
        this.el.addEventListener('hitstart', colliding.bind(this))
        this.el.addEventListener('hitend', collend.bind(this));
        this.el.classList.add("clickable");

        this.el.addEventListener("mousedown", colliding.bind(this))
        this.el.addEventListener("mouseup", collend.bind(this))
        this.el.addEventListener("mouseleave", collend.bind(this))
    }
})


/**
 * A component that can be added to an empty a-entity. It generates a button and a button base.
 * button_color: The collor of the button
 * base_color: The collor of the base of the button
 * event_start: the event that should be emited when the button is pressed
 * event_end: the event that should be emited when the button is released
 * button_channel: the channel on wich the button events should be emited
 */
AFRAME.registerComponent('button',{
    schema: {
        button_color: {default: '#FFF'},
        base_color: {default: '#000'},
        event_start: {type: 'string', default: "buttonpressed"},
        event_stop: {type: 'string', default: "buttonreleased"},
        button_channel: {type: 'string', default: "button"}
      },
    /**
     * Initialisation function of the component, it generates a base and button of the base. It sets their values and components and attaches them to the parent entity
     */
    init: function(){
        var scene = document.querySelector('a-scene');
        this.home_position = new THREE.Vector3();
        var push = document.createElement('a-cylinder');
        var base = document.createElement('a-box');

        
        push.setAttribute('color', this.data.button_color)
        push.setAttribute('height', "0.04")
        push.setAttribute('radius', "0.04")
        push.setAttribute('position', "0 0.01 0")
        push.setAttribute("pushable", "event_start: " + this.data.event_start + "; event_stop: " + this.data.event_stop + "; button_channel: " + this.data.button_channel)
        push.setAttribute('aabb-collider',"objects: .hand")
        this.el.appendChild(push);
        

        base.setAttribute('color', this.data.base_color)
        base.setAttribute('height', "0.04")
        base.setAttribute('width', "0.08")
        base.setAttribute('depth', "0.08")
        base.setAttribute('position', "0 -0.03 0")
        this.el.appendChild(base);
    }
})

/**
 * A component that can be attached to any entity, it allows the entity to listen to button presses on the specified channel
 * if channel "all" is selected all button events will be emited on the entity
 */
AFRAME.registerComponent('button_listener',{
    schema: {
        button_channel: {type: 'string', default: "button"}
    }
})
