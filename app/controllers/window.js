// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var controls=require('controls');

var args = $.args;
Ti.API.info('WINDOW',$.id);

// $.main.addEventListener('click',function(e){
// 	Ti.API.info('Main Window was clicked.');
// })

// var loaded_view = controls.getWorkoutView();
$.main.add(Alloy.createController('workout_player').getView());
function onButtonClose(e){
	Ti.API.info('WTYPE CHECK FROM WINDOW.XML: ', e.window_type);
	if(e.window_type == 'modal'){
		$.win.remove($.main);
		$.main = null;
		$.win.close();
		// var w = Alloy.Globals.modalWindow;
		// w.close();
		// w.remove(w.loaded_view);
		// w.loaded_view = null;		
	}
}
Ti.App.addEventListener('cage/topbar/menu_button/close', onButtonClose);