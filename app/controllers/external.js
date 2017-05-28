// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.external_view.url = args.url || "https://cagefitness.com/app/help/terms-of-service";
// $.external_view.url = args.url || "https://cagefitness.com/instructors-area/class-builder";
$.external_view.willHandleTouches = args.willHandleTouches || false;


var onBeforeLoad =function(e){
	//...
	Ti.API.info('BEFORE.LOADED...');
}
var onLoad =function(e){
	//...
	Ti.API.info('AFTER.LOADED...');
}


  var webview = Titanium.UI.createWebView({url:'http://www.google.com'});
    // var window = Titanium.UI.createWindow();
    $.mainView.add(webview);
    // window.open({modal:true});