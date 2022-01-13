AFRAME.registerComponent('modeldodgemovement', {
    init: function () {
        /*
        Uses the middelpoint and the predicted point to determine the next position the robot needs to go, to dodge the punch.
        This position will be used in an position animation, so you can see the robot move.
        */
        var predictedmove = document.querySelector("#testbox");
        var middlepoint = document.querySelector("#middlepoint");
        var robot = document.querySelector("#robotmodel");
        var currentpos = robot.getAttribute('position');
        var P = predictedmove.getAttribute('position');
    }})