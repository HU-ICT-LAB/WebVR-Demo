
var i = 3;
    // This block will be executed 100 times.
setInterval(function() {
    if (i == 0) clearInterval(this);
    else {
        console.log('Currently at ' + (i--));
    }
    }, 1000);



console.log("I'm later code")