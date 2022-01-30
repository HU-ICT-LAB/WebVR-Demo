AFRAME.registerComponent('modeldodgemovement', {
    init: function () {
        /*
        Uses the middelpoint and the predicted point to determine the next position the robot needs to go, to dodge the punch.
        This position will be used in an position animation, so you can see the robot move.
        */
        var arena = document.querySelector("#arena");
        console.log("test: ", arena.getAttribute('position'))
    }})

AFRAME.registerComponent('robot_position_changer', {
    tick: function () {
        /* Robot Arena Touch checker
        Uses the distance from the middlepoint to the robot and determines if it's outside the ring, if so teleport back to beginning
        */
        var robot = document.querySelector("#robotmodel");
        var currentpos = robot.getAttribute('position');
        var middlepoint = {x: 0, y: 0, z: 0}
        let distance = Math.sqrt(Math.abs((currentpos.x - middlepoint.x)**2 + (currentpos.y - middlepoint.y)**2 + (currentpos.z - middlepoint.z)**2))

        if (distance > 2.75) {
            robot.setAttribute('position', "0 0 0");
            console.log("OUTSIDE")
        }

        /* Dodge cooldown
        If the robot has dodged an attack, the robot_dodge_cooldown will be true and need to wait "dodge_cooldown_time" amount of seconds
        to dodge again
         */
        var robot_dodge_cooldown = document.querySelector("#robot_dodge_cooldown");
        var dodge_cooldown_value = robot_dodge_cooldown.getAttribute('value')
        var dodge_cooldown_time = 1000//seconds

        if (dodge_cooldown_value === 'true'){
            setTimeout(function(){robot_dodge_cooldown.setAttribute('value', "false")},dodge_cooldown_time)
        }
    }})
