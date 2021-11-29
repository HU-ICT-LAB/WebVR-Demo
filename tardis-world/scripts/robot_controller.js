/**
 * An A-Frame componenct to controll the robot arm, it listens to aframe events and sends the mqtt command that is needed to perform the requested action
 */
AFRAME.registerComponent('robot_controller',{
    init: function(){
        this.el.addEventListener('move_left', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_left"}))
        });
        this.el.addEventListener('move_right', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_right"}))
        });
        this.el.addEventListener('move_up', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_up"}))
        });
        this.el.addEventListener('move_down', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_down"}))
        });
        this.el.addEventListener('move_forward', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_forward"}))
        });
        this.el.addEventListener('move_backward', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_backward"}))
        });
        this.el.addEventListener('move_close', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_close"}))
        });
        this.el.addEventListener('move_open', function(){
            client.publish('hbo_ict_robot_arm_controll', JSON.stringify({command: "move_open"}))
        });

    }
})