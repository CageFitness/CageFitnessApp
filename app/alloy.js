// _ = require('alloy/underscore'); 
// _ = require('underscore')._; 

NappDownloadManager = require("dk.napp.downloadmanager");
NappDownloadManager.permittedNetworkTypes = NappDownloadManager.NETWORK_TYPE_ANY;
NappDownloadManager.maximumSimultaneousDownloads = 2;
NappDownloadManager.stopDownloader();
NappDownloadManager.cleanUp();

Timer = require('countdowntimer');
Animation = require('alloy/animation');
XHR = require('xhr');

Utils = require('utils');


Alloy.Globals.XHROptions = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};


var xhr = new XHR();
Ti.API.info('XHR.CLEAN.TRIGGERED.ON.APP.START');
xhr.clean();