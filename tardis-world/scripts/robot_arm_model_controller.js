
AFRAME.registerComponent('robot_arm_model_controller',{
    schema: {
        r_scale: {default: "1 1 1"}
    },
    init: function(){
        var Robot_Arm = document.createElement("a-entity")
        Robot_Arm.setAttribute("rotation", "0 -135 0")
        Robot_Arm.setAttribute("position", "0 -5.8 -2.5")
        Robot_Arm.setAttribute("scale", this.data.r_scale)
        
        var Joint1_Container = document.createElement("a-entity")
        Robot_Arm.appendChild(Joint1_Container)

        var Joint1 = document.createElement("a-cylinder")
        Joint1.setAttribute("height", "0.152")
        Joint1.setAttribute("radius", "0.05")
        Joint1.setAttribute("color", "blue")
        Joint1_Container.appendChild(Joint1)

        var Joint2_Container = document.createElement("a-entity")
        Joint2_Container.setAttribute("position", "0.04 0.025 0")
        Joint1_Container.appendChild(Joint2_Container)

        var Joint2_Connection = document.createElement("a-cylinder")
        Joint2_Connection.setAttribute("radius", "0.05")
        Joint2_Connection.setAttribute("height", "0.15")
        Joint2_Connection.setAttribute("rotation", "0 0 90")
        Joint2_Connection.setAttribute("position", "0.05 0 0")
        Joint2_Connection.setAttribute("color", "blue")
        Joint2_Container.appendChild(Joint2_Connection)

        var Joint2_Arm = document.createElement("a-cylinder")
        Joint2_Arm.setAttribute("height", "0.244")
        Joint2_Arm.setAttribute("radius", "0.045")
        Joint2_Arm.setAttribute("position", "0.07 0.13 0")
        Joint2_Container.appendChild(Joint2_Arm)

        var Joint3_Container = document.createElement("a-entity")
        Joint3_Container.setAttribute("position", "0.10 0.26 0")
        Joint2_Container.appendChild(Joint3_Container)

        var Joint3_Connection = document.createElement("a-cylinder")
        Joint3_Connection.setAttribute("height", "0.23")
        Joint3_Connection.setAttribute("radius", "0.05")
        Joint3_Connection.setAttribute("rotation", "0 0 90")
        Joint3_Connection.setAttribute("position", "-0.09 0 0")
        Joint3_Connection.setAttribute("color", "blue")
        Joint3_Container.appendChild(Joint3_Connection)

        var Joint3_Arm = document.createElement("a-cylinder")
        Joint3_Arm.setAttribute("height", "0.213")
        Joint3_Arm.setAttribute("radius", "0.04")
        Joint3_Arm.setAttribute("position", "-0.15 0.13 0")
        Joint3_Container.appendChild(Joint3_Arm)

        var Joint4_Container = document.createElement("a-entity")
        Joint4_Container.setAttribute("position", "-0.15 0.24 0")
        Joint3_Container.appendChild(Joint4_Container)

        var Joint4_Connection = document.createElement("a-cylinder")
        Joint4_Connection.setAttribute("height", "0.17")
        Joint4_Connection.setAttribute("radius", "0.045")
        Joint4_Connection.setAttribute("rotation", "0 0 90")
        Joint4_Connection.setAttribute("position", "0.03 0 0")
        Joint4_Connection.setAttribute("color", "blue")
        Joint4_Container.appendChild(Joint4_Connection)

        var Joint5_Container = document.createElement("a-entity")
        Joint5_Container.setAttribute("position", "0.08 0.03 0")
        Joint4_Container.appendChild(Joint5_Container)

        var Joint5_Connection = document.createElement("a-cylinder")
        Joint5_Connection.setAttribute("height", "0.17")
        Joint5_Connection.setAttribute("radius", "0.045")
        Joint5_Connection.setAttribute("rotation", "0 0 0")
        Joint5_Connection.setAttribute("position", "0.02 0 0")
        Joint5_Connection.setAttribute("color", "blue")
        Joint5_Container.appendChild(Joint5_Connection)

        var Joint6_Container = document.createElement("a-entity")
        Joint6_Container.setAttribute("position", "0.03 0.1 0")
        Joint5_Container.appendChild(Joint6_Container)

        var Joint6_Connection = document.createElement("a-cylinder")
        Joint6_Connection.setAttribute("height", "0.13")
        Joint6_Connection.setAttribute("radius", "0.045")
        Joint6_Connection.setAttribute("rotation", "0 0 90")
        Joint6_Connection.setAttribute("position", "0 0 0")
        Joint6_Connection.setAttribute("color", "blue")
        Joint6_Container.appendChild(Joint6_Connection)

        var Gripper_Model = document.createElement("a-entity")
        Gripper_Model.setAttribute("position", "0.1 0 0")
        Joint6_Container.appendChild(Gripper_Model)

        var Gripper_Arm = document.createElement("a-cylinder")
        Gripper_Arm.setAttribute("height", "0.08")
        Gripper_Arm.setAttribute("radius", "0.03")
        Gripper_Arm.setAttribute("rotation", "0 0 90")
        Gripper_Arm.setAttribute("position", "0 0 0")
        Gripper_Arm.setAttribute("color", "black")
        Gripper_Model.appendChild(Gripper_Arm)

        var Gripper_Base = document.createElement("a-box")
        Gripper_Base.setAttribute("height", "0.10")
        Gripper_Base.setAttribute("depth", "0.05")
        Gripper_Base.setAttribute("width", "0.01")
        Gripper_Base.setAttribute("position", "0.045 0 0")
        Gripper_Base.setAttribute("rotation", "90 0 0")
        Gripper_Base.setAttribute("color", "black")
        Gripper_Model.appendChild(Gripper_Base)

        var Gripper_Finger_Left = document.createElement("a-box")
        Gripper_Finger_Left.setAttribute("width", "0.06")
        Gripper_Finger_Left.setAttribute("depth", "0.02")
        Gripper_Finger_Left.setAttribute("height", "0.01")
        Gripper_Finger_Left.setAttribute("position", "0.035 0.045 0")
        Gripper_Finger_Left.setAttribute("color", "black")
        Gripper_Base.appendChild(Gripper_Finger_Left)

        var Gripper_Finger_Right = document.createElement("a-box")
        Gripper_Finger_Right.setAttribute("width", "0.06")
        Gripper_Finger_Right.setAttribute("depth", "0.02")
        Gripper_Finger_Right.setAttribute("height", "0.01")
        Gripper_Finger_Right.setAttribute("position", "0.035 -0.045 0")
        Gripper_Finger_Right.setAttribute("color", "black")
        Gripper_Base.appendChild(Gripper_Finger_Right)

        this.el.appendChild(Robot_Arm)
        
        setTimeout(function() {        
            client.subscribe('robot_arm_positions')
            mqtt_add_topic_callback('robot_arm_positions', function (topic, message) {
                var obj = JSON.parse(message);
                console.log(obj)

                var new_base_rotation = obj["base"]
                console.log(obj["base"])
                var new_shoulder_rotation = obj["shoulder"]
                var new_elbow_rotation = obj["elbow"]
                var new_wrist1_rotation = obj["wrist1"]
                var new_wrist2_rotation = obj["wrist2"]
                var new_wrist3_rotation = obj["wrist3"]

                current_1 = Joint1_Container.getAttribute("rotation").y
                current_2 = Joint2_Container.getAttribute("rotation").x
                current_3 = Joint3_Container.getAttribute("rotation").x
                current_4 = Joint4_Container.getAttribute("rotation").x
                current_5 = Joint5_Container.getAttribute("rotation").y
                current_6 = Joint6_Container.getAttribute("rotation").x


                Joint1_Container.setAttribute("animation__turn", "property: rotation.y; from:"+ current_1 +" ;to: "+ this.GetRotationTarget(current_1, new_base_rotation) +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")  
                Joint2_Container.setAttribute("animation__turn", "property: rotation.x; from:"+ current_2 +" ;to: "+ this.GetRotationTarget(current_2, new_shoulder_rotation)+"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                Joint3_Container.setAttribute("animation__turn", "property: rotation.x; from:"+ current_3 +" ;to: "+ this.GetRotationTarget(current_3, new_elbow_rotation) +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                Joint4_Container.setAttribute("animation__turn", "property: rotation.x; from:"+ current_4 +" ;to: "+ this.GetRotationTarget(current_4, new_wrist1_rotation) +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                Joint5_Container.setAttribute("animation__turn", "property: rotation.y; from:"+ current_5 +" ;to: "+ this.GetRotationTarget(current_5, new_wrist2_rotation) +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                Joint6_Container.setAttribute("animation__turn", "property: rotation.x; from:"+ current_6+ " ;to: "+ this.GetRotationTarget(current_6, new_wrist3_rotation) +"; easing: easeInOutQuad; dur: 1000; loop: false; startEvents: goToTarget")
                
                Joint1_Container.emit("goToTarget")
                Joint2_Container.emit("goToTarget")
                Joint3_Container.emit("goToTarget")
                Joint4_Container.emit("goToTarget")
                Joint5_Container.emit("goToTarget")
                Joint6_Container.emit("goToTarget")

                setTimeout(function() {   
                    Joint1_Container.setAttribute("rotation.y", new_base_rotation)
                    Joint2_Container.setAttribute("rotation.x", new_shoulder_rotation)
                    Joint3_Container.setAttribute("rotation.x", new_elbow_rotation)
                    Joint4_Container.setAttribute("rotation.x", new_wrist1_rotation)
                    Joint5_Container.setAttribute("rotation.y", new_wrist2_rotation)
                    Joint6_Container.setAttribute("rotation.x", new_wrist3_rotation)
                }.bind(this), 1000)

                
            }.bind(this))
        }.bind(this), 1000);

    },
    /**
     * This function calulates to wich degree the object should rotate in the animation to avoid incorrect animations.
     * 
     * @param {float} current_rotation the current rotation of the joint
     * @param {float} target_rotation the target rotation of the joint
     * @returns the rotation of the animation to the designed target
     */
    GetRotationTarget: function(current_rotation, target_rotation){
        var default_rot = 0
        var other = 0
        if(current_rotation > target_rotation){ 
            default_rot = current_rotation - target_rotation
            other = 360 - current_rotation + target_rotation
            if(default_rot < other){
                return target_rotation
            }else{
                return current_rotation + other
            }
        }else{
            default_rot = target_rotation - current_rotation
            other = 360 - target_rotation + current_rotation
            if(default_rot < other){
                return target_rotation
            }else{
                return current_rotation - other
            }
        }
     } 
})

/**
 * A wrapper around the robot_arm component so you can use it as a entity.
 */
AFRAME.registerPrimitive('a-robot-arm', {
    defaultComponents: {
      robot_arm_model_controller: {},
      position: {x:0, y:0, z:0},
      rotation: {x:0, y:0, z:0},
      r_scale: {x:0, y:0, z:0}
    },

    mappings: {
        r_scale: 'robot_arm_model_controller.r_scale'
    }

});