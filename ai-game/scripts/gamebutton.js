AFRAME.registerComponent('start_game', {

    init: function() {
        this.el.addEventListener("button_1_pressed", function() {
            var scorenumber = document.querySelector("#score");

            console.log("Button touched");
            var currentscore = scorenumber.getAttribute('text').value
            scorenumber.setAttribute('text', 'value', +currentscore + 1);
        })
    }
})