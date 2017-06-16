// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// $.external_view.url = args.cage_url || "https://cagefitness.com/app/help/terms-of-service";
// $.external_view.url = args.url || "https://cagefitness.com/instructors-area/class-builder";
// $.external_view.willHandleTouches = args.willHandleTouches || false;
var url = args.url || 'https://cagefitness.com/app/help/terms-of-service';

var onBeforeLoad =function(e){
	//...
	Ti.API.info('BEFORE.LOADED...');
}
var onLoad =function(e){
	//...
	Ti.API.info('AFTER.LOADED...');
}

var tkn = Ti.App.Properties.getString('user_token');
Ti.API.info('TKN_:', tkn);
var webview = Titanium.UI.createWebView({
		url:url,
		requestHeaders:{
			'Authorization':'Bearer '+tkn
		},
		willHandleTouches:false,
	});

$.mainView.add(webview);
