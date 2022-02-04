function updatescore() {
    /*
    receive the current score and uses it as a message to publish it on the topic and makes the score 0
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
        this.el.addEventListener("startbutton_pressed", function () {
            //preparation for the Game aka warming up

            if (game_start === false) {
                //if the game has not started (aka not runned when pressing the button during the game)
                game_start = true
                var timer = document.querySelector("#timer");
                var hitable = document.querySelector("#robot_hitable");
                timer.setAttribute('color', "#0D249B") //to tell the timer has been acted, the color changes
                var timeout = 1000
                let warming_uptime = 5; //warming up time in seconds


                setInterval(function () { //this code will decrease the value number every second
                    if ((game_start === true) && (warming_up_ended === true)){ //used when game is started and warming up is ended
                        if(connected && !this.con) {
                            console.log("connected!!!")
                        }
                    }
                    if (warming_uptime === 0) {
                        warming_up_ended = true
                        warming_uptime = "GO!"
                        timer.setAttribute('text', 'value', "GO!")
                        this.el.emit("warming_up_ended")
                        hitable.setAttribute('value', "true");
                        console.log("Hitable?:", hitable.getAttribute('value')) //the robot is hitable
                    } else if (Number.isInteger(warming_uptime)) {
                        timer.setAttribute('text', 'value', (warming_uptime--));
                    } else {
                        timeout = 100000000000000 //waits so many seconds to be work again

                    }
                }.bind(this), timeout); //runs the fuction with 1 second timeout
            }
        }.bind(this))
                var hitable = document.querySelector("#robot_hitable");
                //Real Game start
                this.el.addEventListener("warming_up_ended", function() {
                    var timer = document.querySelector("#timer");
                    var game_played = document.querySelector("#game_played")
                    timer.setAttribute('color', "#06CCCA")
                    let gametime = 30; //is the time to play the game in seconds
                    console.log("Warming up ended")
                    setInterval(function () { //This code will decrease the value number every second
                        if (gametime === 0) {
                            //this will be ran if the time is up
                            game_played.setAttribute('text', 'value', "True")
                            gametime = "Game over"
                            timer.setAttribute('color', "#CC0621")
                            timer.setAttribute('text', 'value', "Game Over")
                            var username = document.querySelector("#username");
                            //update the score and get a new user name when the game is ended
                            updatescore()
                            getrandomizedname(username)
                            game_start = false //set the game_start value to off
                            hitable.setAttribute('value', "false"); //make the robot unhittable again
                            console.log("Robot Hitable?:", hitable.getAttribute('value')) //the robot isn't hitable anymore

                            ;
                        } else if (Number.isInteger(gametime)) {
                            //this will be ran if the time isnt up
                            timer.setAttribute('text', 'value', (gametime--));
                        }
                    }, 1000);

                }
            )}

    }) //1000 milliseconds = 1 second timer
