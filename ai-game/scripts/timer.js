function updatescore() {
    /*
    receive the current score and uses it as a message to publish it on the topic
     */

    var score = document.querySelector("#score");
    var username = document.querySelector("#username");
    var currentscore = (score.getAttribute('text').value).toString();
    var currentname = (username.getAttribute('text').value);
    score.setAttribute('text', 'value', 0)
    console.log((currentname.substr(14) + ":" + currentscore))
    client.publish('request_updatescore', (currentname.substr(14) + ":" + currentscore))}

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
               var username = document.querySelector("#username");
                updatescore()
               getrandomizedname(username)
                // document.querySelector("#debug").setAttribute('text', 'value', "updatescore()");


                ;}
            else {
                // document.querySelector("#debug").setAttribute('text', 'value', "decrease")
                sixtytimer.setAttribute('text', 'value', (sixtyseconds--));}
        }, 1000);}}) //1000 milliseconds = 1 second timer