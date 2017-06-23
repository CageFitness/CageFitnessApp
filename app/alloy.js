// _ = require('alloy/underscore'); 
// _ = require('underscore')._; 
NappDownloadManager = require("dk.napp.downloadmanager");
NappDownloadManager.permittedNetworkTypes = NappDownloadManager.NETWORK_TYPE_ANY;
NappDownloadManager.maximumSimultaneousDownloads = 4;
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