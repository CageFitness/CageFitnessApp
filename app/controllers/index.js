var controls=require('controls');


var default_view = 'menu_builder'
var active_page = 'menu_builder';

var activeView = 1;


// get main and menu view as objects
var menuView 		= controls.getMenuView();
var mainView 		= controls.getMainView();

var exerciseView 	= controls.getExerciseView();
var helpView 		= controls.getHelpView();
var profileView 	= controls.getProfileView();
// var workoutView 	= controls.getWorkoutView();
var externalView 	= controls.getExternalView();
var consoleView 	= controls.getConsoleView();
var programsView 	= controls.getProgramsView();
// var customizerView 	= controls.getCustomizerView();


var menuitems = [];
menuitems['menu_builder'] = {view:mainView};
menuitems['menu_exercises']= {view:exerciseView};
menuitems['menu_help']= {view:helpView};
menuitems['menu_profile']= {view:profileView};
menuitems['menu_console']= {view:consoleView};
menuitems['menu_programs']= {view:programsView};
// menuitems['menu_customizer']= {view:customizerView};

// menuitems['menu_workouts']= {view:workoutView};

var progress_state = false;


function progressHideShow(a,b){
	// if($.dl_progress.opacity!=1){
	// 	$.dl_progress.opacity=1;
	// }
	// if( (a-1) == b ){
	// 	$.dl_progress.opacity=0;
	// }
}


function LaunchDownloadManager(e) {
	Ti.API.info('LOGIN LAUNCHED: ');
    var win = Alloy.createController('download_manager').getView();
    win.open({modal:true});
    Alloy.Globals.modalWindow = win;
}
Ti.App.addEventListener('cage/launch/download_manager', LaunchDownloadManager);

function LaunchLogin(e) {
	Ti.API.info('LOGIN LAUNCHED: ');
    var win = Alloy.createController('login').getView();
    win.open({modal:true});
    Alloy.Globals.modalWindow = win;
}
Ti.App.addEventListener('cage/launch/login', LaunchLogin);



function LaunchVideo(e) {
	Ti.API.info('LAUNCHING.EXTERNAL.WINDOW.WITH:', e.url);
    var win = Alloy.createController('window', {'cage_url':e.url, 'type':'exercise', 'video_data':e}).getView();
    win.open({modal:true});
    Alloy.Globals.modalWindow = win;
}
Ti.App.addEventListener('cage/launch/video', LaunchVideo);


function LaunchExternal(e) {
	Ti.API.info('LAUNCHING.EXTERNAL.WINDOW.WITH:', e.url);
    var win = Alloy.createController('window', {'cage_url':e.url, 'type':'external'}).getView();
    // win.open({transition : Ti.UI.iOS.AnimationStyle.FLIP_FROM_LEFT});
     win.open({modal:true});
    Alloy.Globals.modalWindow = win;
}
Ti.App.addEventListener('cage/launch/external', LaunchExternal);



function LaunchCustomizer(e) {
	Ti.API.info('LAUNCHING.CUSTOMIZER.WINDOW');
    var win = Alloy.createController('window',{type:'customizer'}).getView();
     win.open({modal:true});
    Alloy.Globals.modalWindow = win;
    // Ti.App.fireEvent('cage/drawer/item_click',{menu_id:e.menu_id});
}
Ti.App.addEventListener('cage/launch/customizer', LaunchCustomizer);

function LaunchWindow(e) {
	Ti.API.info('LAUNCHING.WINDOW.WITH:', e.key, e.workout_id);
    var win = Alloy.createController('window').getView();
    // win.open({transition : Ti.UI.iOS.AnimationStyle.FLIP_FROM_LEFT});
    win.open({modal:true});
    Alloy.Globals.modalWindow = win;
}
Ti.App.addEventListener('cage/launch/window', LaunchWindow);


Ti.App.addEventListener('cage/topbar/menu_button/close', function(e){
	Ti.API.info('WTYPE: ', e.window_type);
	if(e.window_type == 'modal'){
		// If workout is active run the cleanup in modal.
		if(Alloy.Globals.WorkoutWindowActive){
			var w = Alloy.Globals.modalWindow;
			w.close();
			w.remove(w.loaded_view);
			w.loaded_view = null;
		}

	}
	else{
		$.drawermenu.showhidemenu();
		$.drawermenu.menuOpen=!$.drawermenu.menuOpen;
	}

});

Ti.App.addEventListener('cage/external/link', handleExternal);



// Ti.App.addEventListener('cage/downloadmanager/progress', function(e){
	
// 	if(e.overall.total==null && e.overall.downloaded==null && e.overall.remaining==null){
// 		$.dl_progress.opacity=0;
// 	}
// 	else{

// 		$.dl_progress_text.text = e.percent_pretty + ' | ' + e.bps_pretty;
// 		$.dl_progress_bar.width = e.percent_pretty + '%';
// 		// Ti.API.info('OVERALL: ', e.overall.total, e.overall.downloaded, e.overall.remaining);
// 		$.pb.value = e.overall.downloaded;
// 		$.pb.min = 0;
// 		$.pb.max = e.overall.total;
// 		progressHideShow($.pb.max,$.pb.value);

// 	}

// });


function handleExternal(e){
	Ti.API.info('HELLO WORLD:', e, e.itemIndex);
	// menu_external
	// lll
}

function initWindowButtons(items){
	for (each in items){
		var v = items[each].view;
		Ti.API.info("MENU.ITEMS: ",each);
	}
}

function getMenuObject(item){
	return menuitems[item].view;
}

function handleMenuClickEvent(e){

    $.drawermenu.showhidemenu();
    $.drawermenu.menuOpen = false;

    if((e.rowData.id in menuitems)){
    	triggerDrawer(e);
    }
    else{
    	triggerWindow(e);
    }
}


function triggerWindow(e){
// launch workout here
Ti.API.info('Launch Workout', e.rowData.id);
Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts'});

}

function triggerDrawer(e){

	clicked_view = getMenuObject(e.rowData.id);
	Ti.API.info('CURRENT CHILDREN BEFORE: ',$.drawermenu.drawermainview.children)
	if( e.rowData.id == default_view ){

		// This can trigger init only the current window.
		Ti.App.fireEvent('cage/class_builder/init',{menu_id:e.rowData.id});
		
		if(active_page != default_view){
			Ti.API.info('CASE.01.01', 'active_page: '+active_page);
			$.drawermenu.drawermainview.remove( getMenuObject(active_page).getView() );
			active_page = default_view;
		}
		else{
			Ti.API.info('CASE.01.02', 'active_page: '+active_page);
			active_page = default_view;
		}
	}
	else{
		if( active_page != e.rowData.id ){
			Ti.API.info('CASE.02.01', 'active_page: '+active_page);
			if(active_page != default_view){
				$.drawermenu.drawermainview.remove( getMenuObject(active_page).getView() );
			}
			$.drawermenu.drawermainview.add( clicked_view.getView() );
			active_page = e.rowData.id;
		}
		else{
			Ti.API.info('CASE.02.02', 'active_page: '+active_page);
			active_page = e.rowData.id;
		}

	}
	
	Ti.API.info('CURRENT CHILDREN AFTER: ',$.drawermenu.drawermainview.children)
    Ti.API.info(e.rowData.id); 
    setTimeout(function(){
    	Ti.App.fireEvent('cage/drawer/item_click',{menu_id:e.rowData.id});
    },500);

}

initWindowButtons(menuitems);



$.drawermenu.init({
    menuview:menuView.getView(),
    mainview:mainView.getView(),
    duration:200,
    parent: $.index
});

menuView.menuTable.addEventListener('click',handleMenuClickEvent);


Ti.App.addEventListener('cage/goto/customizer',function(e){
	ob = {};
	ob.rowData={};
	ob.rowData.id=e.menu_id;
	menuView.menu_customizer.fireEvent('click',ob);
})


$.index.open();

// DISABLE LOGIN WHILE TESTING
// Ti.App.fireEvent('cage/launch/login');


