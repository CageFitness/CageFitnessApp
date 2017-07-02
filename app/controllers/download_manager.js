// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// Require in the module
var urlSession = require('com.appcelerator.urlSession');

var sessionConfig = urlSession.createSessionConfiguration({
    identifier: 'com.cagefitness.app.101'
});

var session = urlSession.createSession({
    configuration: sessionConfig
});

Alloy.Globals.SessionDownloader = session;

Ti.API.info(urlSession);
Ti.API.info(sessionConfig);
Ti.API.info(session);

$.dlbutton.addEventListener('click', function() {
    // Create a background download task to get the asset with the URL
    Ti.API.info('clicking...',session);

    session.downloadTask({
    // session.backgroundDownloadTaskWithURL({
        url: 'https://raw.github.com/appcelerator-developer-relations/KitchenSink/master/Resources/images/dog@2x~iphone.jpg'
    });
 
    $.downprogress.show();
});




// Monitor this event to receive updates on the progress of the download
Ti.App.iOS.addEventListener('downloadprogress', function(e) {
    // Update the progress indicator
    $.downprogress.value = (e.totalBytesWritten / e.totalBytesExpectedToWrite);
});
 
// Monitor this event to know when the download completes
Ti.App.iOS.addEventListener('downloadcompleted', function(e) {
    Ti.API.info('Download completed: ' + JSON.stringify(e));
 
    // Update the image
    // imageView.image = e.data;
 
    // Invalidate the session and cancel current session tasks
    session.invalidateAndCancel();
 
    // Notify the user the download is complete if the application is in the background
    Ti.App.iOS.scheduleLocalNotification({
        alertBody: 'Download completed!',
        date: new Date().getTime() 
    });
    $.downprogress.hide();
});
 
 
// Monitor this event to know when all session tasks have completed
Ti.App.iOS.addEventListener('sessioncompleted', function(e) {
    Ti.API.info('sessioncompleted: ' + JSON.stringify(e));
    if (e.success) {
        alert('Downloads completed successfully.');
    }
});