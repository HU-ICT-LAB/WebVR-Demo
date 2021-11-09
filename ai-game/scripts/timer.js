function updatescore() {
    var score = document.querySelector("#score");
    var currentscore = score.getAttribute('text').value;
    client.publish('request_updatescore', currentscore)}

AFRAME.registerComponent('timerdown', {
    init: function () {
        var sixtytimer = document.querySelector("#timer");
        let sixtyseconds = 5;
        setInterval(function () { //this code will decrease the value number every second
            if (sixtyseconds === 0){
                updatescore()
                sixtytimer.setAttribute('text', 'value', "Score added!")
                sixtyseconds = 5;}
            else {
                sixtytimer.setAttribute('text', 'value', (sixtyseconds--));}
        }, 1000);}}) //1000 milliseconds = 1 second timer