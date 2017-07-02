var getURLSessionIdentifier = function(){
	var prefix = 'com.cagefitness.app';
	var sid = Utils.getRandomInt(0,1000000);
	return prefix+'.'+sid;
};


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


Ti.App.addEventListener('uncaughtException',function(e){
	Ti.API.info('APP.ERROR:',e);
});

Ti.API.info('===============');

// Require in the module
var urlSession = require('com.appcelerator.urlSession');

var sid = getURLSessionIdentifier();
Ti.API.info(sid);
var sessionConfig = urlSession.createSessionConfiguration({
    identifier: sid
});

var session = urlSession.createSession({
    configuration: sessionConfig
});

Alloy.Globals.SessionDownloader = session;
Alloy.Globals.DownloadProgress = 0;
Alloy.Globals.WorkoutAssets = [];





// // Monitor this event to receive updates on the progress of the download
Ti.App.iOS.addEventListener('downloadprogress', function(e) {
    // Update the progress indicator

    var progress = (e.totalBytesWritten / e.totalBytesExpectedToWrite);
    // $.downprogress.value = (e.totalBytesWritten / e.totalBytesExpectedToWrite);
   // Alloy.Globals.DownloadProgress = progress;
});
 
// Monitor this event to know when the download completes
Ti.App.iOS.addEventListener('downloadcompleted', function(e) {
    // Ti.API.info('Download completed: ' + JSON.stringify(e), e.source, e.data);
    var task_completed = _.findWhere(Alloy.Globals.WorkoutAssets,{task:e.taskIdentifier});
    if(task_completed){
    	task_completed.complete=true;
    }




    if( task_completed && task_completed.filename ) {

    	Ti.API.info('AFTER.ASKING:');

    	var completed = _.size(_.where(Alloy.Globals.WorkoutAssets, {complete: true}));
	    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cached/'+task_completed.filename);
		file.write(e.data);
		if(file.exists()) {
			Ti.API.info('[SAVE.FILE: YES ] (' + file.nativePath + ')');
			// Ti.API.info('ASSET.DOWNLOAD.COMPLETE:', completed, _.size(Alloy.Globals.WorkoutAssets), file.exists(), JSON.stringify(task_completed));
			var inqueue = _.size(Alloy.Globals.WorkoutAssets);
			Ti.API.info('ASSET.DOWNLOAD.COMPLETE:', completed, inqueue, completed/inqueue,  JSON.stringify(task_completed));
			Alloy.Globals.DownloadProgress=completed/inqueue;
		} else {
			Ti.API.info('[SAVE.FILE:] NO ]');
		}


	}


    

   

});
 
 // Monitor this event to know when the download completes
Ti.App.iOS.addEventListener('sessioneventscompleted', function(e) {
    Ti.API.info('Session Events Completed: ' + JSON.stringify(e));


});
 
 
// Monitor this event to know when all session tasks have completed
Ti.App.iOS.addEventListener('sessioncompleted', function(e) {
    
    if (e.success) {
        
        var completed = _.size(_.where(Alloy.Globals.WorkoutAssets, {complete: true}));
        var total = _.size(Alloy.Globals.WorkoutAssets);

    	if(completed>0 && completed===total){
    		Ti.API.info('ONSESSIONCOMPLETED: ' + JSON.stringify(e));
    		Ti.API.info(' ========== ALL DOWNLOADS COMPLETE, GO WORKOUT!!!!');
    		// Ti.App.iOS.removeEventListener('downloadcompleted', onDownloadComplete);
    		if(Alloy.Globals.prog){
    			Alloy.Globals.prog.hide();
    		}
		    // Notify the user the download is complete if the application is in the background
		    // Ti.App.iOS.scheduleLocalNotification({
		    //     alertBody: 'Cage Downloads Completed!',
		    //     date: new Date().getTime() 
		    // });
		    // alert('Downloads completed successfully.');
    	}

    


    }
});



Ti.API.info('===============');






