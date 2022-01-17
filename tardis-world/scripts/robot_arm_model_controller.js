
AFRAME.registerComponent('robot_arm_model_controller',{
    init: function(){
        
        setTimeout(function() {        
            client.subscribe('robot_arm_positions')
            mqtt_add_topic_callback('robot_arm_positions', function (topic, message) {
                var obj = JSON.parse(message);
                console.log(obj)

                this.Base = this.el.sceneEl.querySelector("#Joint1_Container")
                this.Shoulder = this.el.sceneEl.querySelector("#Joint2_Container")
                this.Elbow = this.el.sceneEl.querySelector("#Joint3_Container")
                this.Wrist1 = this.el.sceneEl.querySelector("#Joint4_Container")
                this.Wrist2 = this.el.sceneEl.querySelector("#Joint5_Container")
                this.Wrist3 = this.el.sceneEl.querySelector("#Joint6_Container")
                
                var new_base_rotation = obj["base"]
                console.log(obj["base"])
                var new_shoulder_rotation = obj["shoulder"]
                var new_elbow_rotation = obj["elbow"]
                var new_wrist1_rotation = obj["wrist1"]
                var new_wrist2_rotation = obj["wrist2"]
                var new_wrist3_rotation = obj["wrist3"]


                var current_rotation = this.Base.getAttribute("rotation")
                this.Base.setAttribute("animation__turn", "property: rotation.y; to: "+ new_base_rotation +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")  
                var current_rotation = this.Shoulder.getAttribute("rotation")     
                this.Shoulder.setAttribute("animation__turn", "property: rotation.x;  to: "+ new_shoulder_rotation +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                var current_rotation = this.Elbow.getAttribute("rotation") 
                this.Elbow.setAttribute("animation__turn", "property: rotation.x; to: "+ new_elbow_rotation +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                var current_rotation = this.Wrist1.getAttribute("rotation") 
                this.Wrist1.setAttribute("animation__turn", "property: rotation.x; to: "+ new_wrist1_rotation +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                var current_rotation = this.Wrist2.getAttribute("rotation")
                this.Wrist2.setAttribute("animation__turn", "property: rotation.y; to: "+ new_wrist2_rotation +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                var current_rotation = this.Wrist3.getAttribute("rotation") //Gripper wrist
                this.Wrist3.setAttribute("animation__turn", "property: rotation.x; to: "+ new_wrist3_rotation +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                
                this.Base.emit("goToTarget")
                this.Shoulder.emit("goToTarget")
                this.Elbow.emit("goToTarget")
                this.Wrist1.emit("goToTarget")
                this.Wrist2.emit("goToTarget")
                this.Wrist3.emit("goToTarget")


            }.bind(this))
        }.bind(this), 1000);

    }

      
})