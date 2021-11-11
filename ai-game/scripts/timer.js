function updatescore() {
    /*
    receive the current score and uses it as a message to publish it on the topic
     */
    var score = document.querySelector("#score");
    var currentscore = score.getAttribute('text').value;
    client.publish('request_updatescore', currentscore)}

AFRAME.registerComponent('timerdown', {
    init: function () {
        /*
        create the sixtyseconds value which be used in the setinterval function to decrease it's number with 1 every second
         */
        var sixtytimer = document.querySelector("#timer");
        let sixtyseconds = 60;
        setInterval(function () { //this code will decrease the value number every second
            if (sixtyseconds === 0){
                updatescore()
                sixtytimer.setAttribute('text', 'value', "Score added!")
                sixtyseconds = 60;}
            else {
                sixtytimer.setAttribute('text', 'value', (sixtyseconds--));}
        }, 1000);}}) //1000 milliseconds = 1 second timer