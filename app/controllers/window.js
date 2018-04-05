// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var controls=require('controls');

var args = $.args;
var cage_url = args.cage_url || '';
var wtype = args.type || '';
var ref = args.ref || null;
var video_data = args.video_data || '';

Ti.API.info('WINDOW:');
Ti.API.info('CAGE_URL:',cage_url, wtype);

if(wtype=='exercise'){
	$.main.add(Alloy.createController('exercise/full',{'video_data':video_data}).getView());
}

else if(wtype=='external'){
	$.main.add(Alloy.createController('external',{'url':cage_url}).getView());
}

else if(wtype=='program'){
	$.main.add(Alloy.createController('program/program', {winref: $.win, 'programId':args.programId}).getView());	
}

else if(wtype=='customizer'){
	$.main.add(Alloy.createController('customizer').getView());	
}

else{
	Alloy.Globals.WorkoutWindowActive = true;
	$.main.add(Alloy.createController('workout_player', {winref: $.win}).getView());
}


function onButtonClose(e){

	
	if(e.window_type == 'modal'){
		
		Alloy.Globals.WorkoutWindowActive = false;
		Ti.API.warn('WORKOUT.WINDOW.ACTIVE.SET.TO.FALSE');

		Ti.API.info('WTYPE CHECK FROM WINDOW.XML: ', e.window_type);
		// $.win.remove($.main);
		// $.main = null;
		$.win.close({animated:true});


	}
	if(wtype=='customizer'){
		Ti.API.info('REMOVING.BUTTON.CLOSE.LISTENER');
		Ti.App.removeEventListener('cage/topbar/menu_button/close', onButtonClose);
	}

}
Ti.App.addEventListener('cage/topbar/menu_button/close', onButtonClose);


$.cleanup = function cleanup() {
	Ti.API.info('WINDOW.PERFORMING.CLEANUP:');
	clearInterval(Alloy.Globals.Timer);
	$.destroy();
	$.off();

	// someController = null;
};
$.win.addEventListener('close', $.cleanup);