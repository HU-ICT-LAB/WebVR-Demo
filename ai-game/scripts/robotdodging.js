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
        var M = middlepoint.getAttribute('position');

        var x_distance = M.x - P.x;
        var movemultiplier = 1/x_distance*0.2;
        var robotmove = movemultiplier;

        var animationMoveString = "property: position; from: "+ currentpos.x + " " + currentpos.y + " " + (currentpos.z-1) + "; to: " + robotmove + " " + currentpos.y + " " + (currentpos.z-1) + " dur: 10000; easing: linear"
        robot.setAttribute("animation", animationMoveString);
    }})