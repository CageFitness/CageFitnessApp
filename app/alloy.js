// _ = require('alloy/underscore'); 
// _ = require('underscore')._; 
Timer = require('countdowntimer');
NappDownloadManager = require("dk.napp.downloadmanager");
Animation = require('alloy/animation');
XHR = require('xhr');
Utils = require('utils');


Alloy.Globals.XHROptions = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};


var xhr = new XHR();