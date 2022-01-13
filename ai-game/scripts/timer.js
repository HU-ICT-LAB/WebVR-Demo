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
        // let warming_up_ended = false;
        let warming_up_ended = false;
        let game_start = false;

        /*
        create the sixtyseconds value which be used in the setinterval function to decrease it's number with 1 every second
         */
        // while (game_start === true){
        //     console.log("GAME IS STARTED")
        // }


        this.el.addEventListener("startbutton_pressed", function () {
            //preparation for the Game aka warming up

            if (game_start === false) {
                game_start = true
                var timer = document.querySelector("#timer");
                var hitable = document.querySelector("#robot_hitable");
                timer.setAttribute('color', "#0D249B")
                var timeout = 1000
                let warming_uptime = 5;


                setInterval(function () { //this code will decrease the value number every second
                    if ((game_start === true) && (warming_up_ended === true)){ //used when game is started and warming up is ended
                        if(connected && !this.con) {
                            console.log("connected!!!")
                            // client.subscribe('hbo_ict_vr_request_simplified_data')
                            // client.publish('hbo_ict_vr_request_data', "{0}")
                        }
                    }
                    if (warming_uptime === 0) {
                        warming_up_ended = true
                        warming_uptime = "GO!"
                        timer.setAttribute('text', 'value', "GO!")
                        this.el.emit("warming_up_ended")
                        hitable.setAttribute('value', "hitable");
                        console.log(hitable.getAttribute('value'))
                    } else if (Number.isInteger(warming_uptime)) {
                        // document.querySelector("#debug").setAttribute('text', 'value', "decrease")
                        timer.setAttribute('text', 'value', (warming_uptime--));
                    } else {
                        // timer.setAttribute('text', 'value', "Go!")
                        timeout = 100000000000000

                    }
                }.bind(this), timeout);
            }
        }.bind(this))

                //Game start
                this.el.addEventListener("warming_up_ended", function() {
                    var timer = document.querySelector("#timer");
                    timer.setAttribute('color', "#06CCCA")
                    let gametime = 6;
                    console.log("warming up ended")
                    setInterval(function () { //this code will decrease the value number every second
                        if (gametime === 0) {
                            gametime = "Game over"
                            timer.setAttribute('color', "#CC0621")
                            timer.setAttribute('text', 'value', "Game Over")
                            var username = document.querySelector("#username");
                            updatescore()
                            getrandomizedname(username)
                            game_start = false
                            ;
                        } else if (Number.isInteger(gametime)) {

                            timer.setAttribute('text', 'value', (gametime--));
                        }
                    }, 1000);

                }
            )}

    }) //1000 milliseconds = 1 second timer
