AFRAME.registerComponent('sethighscore', {
    init: function() {
        /*
        sets default con value on false
         */
        this.con = false},

    tick: function(){
        /*
        this function updates every tick (like a while loop)
        if connected and con is still false, subscribe to topic and send request topic. If received then read the message and put
        it's value in the highscoretext entity and set connected value to true
         */
        if(connected && !this.con) {
            client.subscribe('hbo_ict_vr_game_score')
            client.publish('request_scoretopic', "{0}")
            mqtt_add_topic_callback('hbo_ict_vr_game_score', function (topic, message) {
                var obj = JSON.parse(message);
                console.log(obj)
                this.newhighscore = "Top 10 leaderboard\n------------\n"
                for (let x in obj) {
                    this.newhighscore = this.newhighscore + x + ": " + obj[x] + "\n"}
                console.log(this.newhighscore)
                Highscoretext.setAttribute('text', 'value', this.newhighscore)})
            this.con = true
        }}});