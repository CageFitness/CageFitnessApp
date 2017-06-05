// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var controls=require('controls');

var args = $.args;
Ti.API.info('WINDOW',$.id);


$.main.add(Alloy.createController('workout_player').getView());
function onButtonClose(e){
	Ti.API.info('WTYPE CHECK FROM WINDOW.XML: ', e.window_type);
	if(e.window_type == 'modal'){
		$.win.remove($.main);
		$.main = null;
		$.win.close();
	}
}
Ti.App.addEventListener('cage/topbar/menu_button/close', onButtonClose);