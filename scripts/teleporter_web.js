//a variable to check if the player is already teleporting
var teleporting = false

/**
 * A component to create a teleporter. This component generates a few primitives and a button. 
 * By setting its id and target you can teleport between teleporters by pressing the button.
 */
AFRAME.registerComponent('web_teleporter',{
    /**
     * teleporter_id the id of this teleporter
     * target_link: the desired webpage to teleport to
     * target_text: the desired text to show above the button
     */
    schema: {
        teleporter_id: {default: 0},
        target_link: {default: ""},
        target_text: {default: ""}
      },
    /**
     * Initialisation function of the component
     * This function adds the base, top, button, button pilar and tube as child entities to the entity. 
     * It sets the properties of these entities and adds the correctt event listeners and animations
     */
    init: function(){
        this.home_position = new THREE.Vector3();
        this.el.setAttribute("button_listener", "button_channel: teleporter_" + this.data.teleporter_id)
        this.el.addEventListener('teleporter_pressed', this.teleportsequence.bind(this))
        //this.el.addEventListener("player_teleported", this.end_animation.bind(this))
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


        var button = document.createElement("a-button")
        button.setAttribute("button_channel", "teleporter_" + this.data.teleporter_id)
        button.setAttribute("event_start","teleporter_pressed")
        button.setAttribute("position", "0 1.05 0")
        this.el.appendChild(button)

        var text = document.createElement("a-text")
        text.setAttribute("id", "teleporter_" + this.data.teleporter_id + "_text")
        text.setAttribute("value", this.data.target_text)
        text.setAttribute("align", "center")
        text.setAttribute("position", "0 1.2 0")
        text.setAttribute("scale", "0.7 0.7 0.7")
        text.setAttribute("material", "side: double")
        this.el.appendChild(text)

    },

    /**
     * This function starts the multiple stages of the start animation: teleporter_initiated and teleporter_initiated2
     */
    start_animation: function(){
        var tub = this.el.querySelector("#tube_"+ this.data.teleporter_id)
        tub.emit("teleporter_initiated")
        setTimeout(function() {
            var tub = this.el.querySelector("#tube_"+ this.data.teleporter_id)
            tub.emit("teleporter_initiated_2")
        }.bind(this), 2000);
    },


    /**
     * This function starts the teleportation sequence starts the correct animation events at the right time.
     */
    teleportsequence: function(){
        if( !teleporting){
            teleporting = true
            this.start_animation()

            setTimeout( function() {
                this.teleportPlayer()
            }.bind(this), 4500);
        }
    },

    /**
     * this function teleports the player to the new web page
     */
    teleportPlayer: function(){
        console.log(this.data.target_link)
        window.location.href = this.data.target_link;
        teleporting=false;
    }
      
})

/**
 * A wrapper around the teleporter component so you can use it as a entity.
 */
AFRAME.registerPrimitive('a-web-teleporter', {
    // Attaches the `button` component by default..
    defaultComponents: {
      web_teleporter: {},
      position: {x:0, y:0, z:0}
    },
  
    // Maps HTML attributes to the `teleporter` component properties
    mappings: {
      teleporter_id: 'web_teleporter.teleporter_id',
      target_link: 'web_teleporter.target_link',
      target_text: "web_teleporter.target_text"
    }
});


/**
 * An component to change the target link and text of a web-teleporter
 */
AFRAME.registerComponent('link_selector',{
    /**
     * links:  a list of links "/path/to/file.html,/path/to/otherfile.html" sperated by a ,
     * texts: a list of strings "i am a string, i am another string" seperated by a ,
     * teleporter_id the id of the teleporter you want to controll
     * button_color: the color of the button
     * base_color: the color of the base of the button
     * changer_id: the id of this link_selector
     */
    schema: {
        links: {
            type: 'string',
            default: [""],
            parse: function (value) {
                return value.split(',');
            },
        },
        texts: {
            type: 'string',
            default: [""],
            parse: function (value) {
                return value.split(',');
            },
        },
        teleporter_id: {default: 0},
        button_color: {default: "#0000FD"},
        base_color: {default: "#DDDDFF"},
        changer_id: {default: 0}
    },

    /**
     * Initializes the component
     */
    init: function(){
        this.index = 0
        this.text_index = 0

        this.el.setAttribute("button_listener", "button_channel:  web_teleporter_links_"+ this.data.changer_id)
        this.el.addEventListener("web_teleporter_linkchange", this.change_portal.bind(this))

        var button = document.createElement("a-button")
        button.setAttribute("button_color", this.data.button_color)
        button.setAttribute("base_color", this.data.base_color)
        button.setAttribute("button_channel", "web_teleporter_links_"+ this.data.changer_id)
        button.setAttribute("event_start", "web_teleporter_linkchange")
        this.el.appendChild(button)


    },

    /**
     * Changes the link and text on the selected portal,
     * If multiple links are given, it will cycle thru the links and texts
     */
    change_portal: function(){
        var TeleporterList = this.el.sceneEl.querySelectorAll("[web_teleporter]")
        var Destteleporter
        for (i = 0; i <  TeleporterList.length; i++){
            if(TeleporterList[i].components.web_teleporter.data.teleporter_id == this.data.teleporter_id){
                Destteleporter = TeleporterList[i]
                break
            }
        }
        Destteleporter.setAttribute("web_teleporter", "target_link: "+ this.data.links[this.index])

        var text_entity = Destteleporter.querySelector("a-text")
        text_entity.setAttribute("value", this.data.texts[this.text_index])

        this.text_index += 1
        if (this.text_index >= this.data.texts.length){
            this.text_index = 0
        }
        this.index += 1
        if (this.index >= this.data.links.length){
            this.index = 0
        }
    }

})

/**
 * A wrapper around the link_selector component so you can use it as a entity.
 */
AFRAME.registerPrimitive('a-webtel-linkselector', {
    // Attaches the `button` component by default..
    defaultComponents: {
      link_selector: {},
      position: {x:0, y:0, z:0}
    },
  
    // Maps HTML attributes to the `teleporter` component properties
    mappings: {
      teleporter_id: 'link_selector.teleporter_id',
      links: 'link_selector.links',
      texts: 'link_selector.texts',
      button_color: 'link_selector.button_color',
      base_color: 'link_selector.base_color',
      changer_id: 'link_selector.changer_id'
    }
});