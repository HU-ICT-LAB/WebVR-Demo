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
                var game_started = document.querySelector("#robot_hitable")
                var currentscore = scorenumber.getAttribute('text').value;
                console.log(currentscore);
                if (scoreagaindelay === 0 && game_started.getAttribute('value') === 'true') {
                    //if game is played and score cooldown is down, point will be added
                    scorenumber.setAttribute('text', 'value', +currentscore + 1);
                }
        })
         this.el.addEventListener('hitend', function(){}) //extra code when the hand has exited the collision
    }
});

AFRAME.registerComponent("hitbox", {
    /*
    this component will create a hitbox for the robot that positioned with the robot (index.html).
    If the hand collides with this, a point is added
     */
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
    /*
    here will the hitbox be added to the defaultcomponents
     */
    defaultComponents: {hitbox: {}}})