var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var fancyTimeFormat = function(time)
{   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

NappDownloadManager = require("dk.napp.downloadmanager");
NappDownloadManager.permittedNetworkTypes = NappDownloadManager.NETWORK_TYPE_ANY;
NappDownloadManager.maximumSimultaneousDownloads = 2;
NappDownloadManager.stopDownloader();
NappDownloadManager.cleanUp();

Timer = require('countdowntimer');
Animation = require('alloy/animation');
XHR = require('xhr');
Utils = require('utils');
Alloy.Globals.updateWorkout = false;
Alloy.Globals.Timer = 0;
clearInterval(Alloy.Globals.Timer);
Alloy.Globals.XHROptions = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};

var xhr = new XHR();
Ti.API.info('XHR.CLEAN.TRIGGERED.ON.APP.START');
xhr.clean();

Ti.API.info('===============');
Ti.API.info('===============');

