function updatescore() {
    /*
    receive the current score and uses it as a message to publish it on the topic
     */

    var score = document.querySelector("#score");
    var currentscore = (score.getAttribute('text').value).toString();
    score.setAttribute('text', 'value', 0)
    console.log(typeof currentscore)
    console.log(currentscore)
    client.publish('request_updatescore', currentscore)}

AFRAME.registerComponent('timerdown', {
    init: function () {
        /*
        create the sixtyseconds value which be used in the setinterval function to decrease it's number with 1 every second
         */
        var sixtytimer = document.querySelector("#timer");
        var score = document.querySelector("#score");
        let sixtyseconds = 5;
        var first = true;
        setInterval(function () { //this code will decrease the value number every second
            if (sixtyseconds === 0){
                sixtyseconds = 5
                sixtytimer.setAttribute('text', 'value', "Added!")
                // document.querySelector("#debug").setAttribute('text', 'value', "updatescore()");
                updatescore()

                ;}
            else {
                // document.querySelector("#debug").setAttribute('text', 'value', "decrease")
                sixtytimer.setAttribute('text', 'value', (sixtyseconds--));}
        }, 1000);}}) //1000 milliseconds = 1 second timer