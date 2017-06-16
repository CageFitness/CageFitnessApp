// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var controls=require('controls');

var args = $.args;
var cage_url = args.cage_url || false;
var wtype = args.type || false;

Ti.API.info('WINDOW:');
Ti.API.info('CAGE_URL:',cage_url, wtype);

if(wtype=='exercise'){
	$.main.add(Alloy.createController('exercise/full').getView());
}
else if(wtype=='external'){
	$.main.add(Alloy.createController('external',{'url':cage_url}).getView());
}
else{
	$.main.add(Alloy.createController('workout_player').getView());
}


function onButtonClose(e){
	Ti.API.info('WTYPE CHECK FROM WINDOW.XML: ', e.window_type);
	if(e.window_type == 'modal'){
		$.win.remove($.main);
		$.main = null;
		$.win.close();
	}
}
Ti.App.addEventListener('cage/topbar/menu_button/close', onButtonClose);