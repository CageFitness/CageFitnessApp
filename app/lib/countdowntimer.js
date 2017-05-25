// implements a reusable countdown timer
// arguments:
// upper : upper limit to start countdown at
// onStart : function to execute when the timer starts
// onInterval : function to execute every second, like update screen
// onComplete : function to execute when the timer reaches 0
// onKill : function to execute when the timer is manually killed
countdownTimer = function (upper,onStart,onInterval,onComplete,onKill){
    var interval;
    
    this.interval=interval;
    this.upper=upper;
    this.iterator=upper;
    this.onStart=onStart;
    this.onInterval=onInterval;
    this.onComplete=onComplete;
    this.onKill=onKill;
}

countdownTimer.prototype.kill=function(){
    that=this;
    clearInterval(that.interval); // stop this interval
    that.onKill();  // call onKill
}

countdownTimer.prototype.start=function(){
    var that=this;

    that.onStart(); // call onstart
    that.iterator=that.upper; // set upper boundary
    that.onInterval(that.iterator); // call onInterval

    that.interval=setInterval(timer, 1000); // start timer

    function timer(){
        that.iterator--; // decrement
        that.onInterval(that.iterator); // call onInterval
        if (that.iterator === 0){ // if this is the end
            that.onComplete(); // call onComplete
            clearInterval(that.interval); // stop this interval
        }
    }
}
exports.countdownTimer=countdownTimer;