let scoreagaindelay = 0;
setInterval(function() {if (scoreagaindelay == 0) clearInterval(this)}, 1000);
//This code is a timer that clears it's value every second to prevent scoring too fast


AFRAME.registerComponent('hit', {
    init: function () {
        /*
        when hit is started there are 2 states: hitstart (when the object is collided) * hitend (when the object is not collided anymore)
        when hitstart get the score and add increase the score with 1 only when the scoreagaindelay is 0 (to prevent too fast scoring)
        when hitend print out that it's out the colliding zone.
         */
        this.el.addEventListener('hitstart', function(){
            var scorenumber = document.querySelector("#score");

            console.log("Item touched");
            var currentscore = scorenumber.getAttribute('text').value;
            console.log(currentscore);
            if (scoreagaindelay === 0) {
                scorenumber.setAttribute('text', 'value', +currentscore + 1);

                //TODO code that the robot moves away after the punch
                // var robot = document.querySelector("#robotmodel");
                // var currentposition= robot.getAttribute('position')
                // currentposition.z = currentposition.z + 0.1
                // robot.setAttribute('position', currentposition)
                // console.log("Dodged!")
                // scoreagaindelay = 1;
            }
        })

         this.el.addEventListener('hitend', function(){
             console.log("Item exited");
         })

    }
});

AFRAME.registerComponent("hitbox", {
    init: function() {
        let body = document.createElement("a-box");
        let head = document.createElement("a-box");

        body.setAttribute("position", "0 110 0");
        body.setAttribute("mixin", "body");
        head.setAttribute("position", "0 70 0");
        head.setAttribute("mixin", "head");
        body.appendChild(head)
        this.el.appendChild(body);}})

AFRAME.registerPrimitive("a-hitbox", {
    defaultComponents: {hitbox: {}}})