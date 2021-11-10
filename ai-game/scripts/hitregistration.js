let scoreagaindelay = 0;
setInterval(function() {if (scoreagaindelay == 0) clearInterval(this)}, 1000);


AFRAME.registerComponent('hit', {

    init: function () {

        this.el.addEventListener('hitstart', function(){
            var scorenumber = document.querySelector("#score");

            console.log("Item touched");
            this.setAttribute('color', "#FF0000");
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
            this.setAttribute('color', "#333333");
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