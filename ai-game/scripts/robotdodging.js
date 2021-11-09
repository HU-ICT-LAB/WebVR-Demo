AFRAME.registerComponent('modeldodgemovement', {
    init: function () {
        var predictedmove = document.querySelector("#testbox");
        var middlepoint = document.querySelector("#middlepoint");
        var robot = document.querySelector("#robotmodel");
        currentpos = robot.getAttribute('position');
        P = predictedmove.getAttribute('position');
        M = middlepoint.getAttribute('position');
        x_distance = M.x - P.x;
        console.log("distance: " + x_distance)
        var movemultiplier = 1/x_distance*0.2
        var robotmove = movemultiplier
        console.log(robotmove)
        console.log(currentpos)

        var animationMoveString = "property: position; from: "+ currentpos.x + " " + currentpos.y + " " + (currentpos.z-1) + "; to: " + robotmove + " " + currentpos.y + " " + (currentpos.z-1) + " dur: 10000; easing: linear"
        console.log(animationMoveString)
        robot.setAttribute("animation", animationMoveString)
    }})