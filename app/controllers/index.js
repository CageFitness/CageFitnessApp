var controls=require('controls');

// get main and menu view as objects
var menuView 		= controls.getMenuView();
var mainView 		= controls.getMainView();

var exerciseView 	= controls.getExerciseView();
var helpView 		= controls.getHelpView();
var profileView 	= controls.getProfileView();
var workoutView 	= controls.getWorkoutView();
var externalView 	= controls.getExternalView();

var menuitems = [];
menuitems['menu_builder'] = {view:mainView};
menuitems['menu_exercises']= {view:exerciseView};
menuitems['menu_help']= {view:helpView};
menuitems['menu_profile']= {view:profileView};
menuitems['menu_external']= {view:externalView};
menuitems['menu_workouts']= {view:workoutView};

var progress_state = false;


function progressHideShow(a,b){
	if($.dl_progress.opacity!=1){
		$.dl_progress.opacity=1;
	}
	if( (a-1) == b ){
		$.dl_progress.opacity=0;
	}
}


Ti.App.addEventListener('cage/downloadmanager/progress', function(e){
	
	$.dl_progress_text.text = e.percent_pretty + ' | ' + e.bps_pretty;
	$.dl_progress_bar.width = e.percent_pretty + '%';
	Ti.API.info('OVERALL: ', e.overall.total, e.overall.downloaded, e.overall.remaining);

	$.pb.value = e.overall.downloaded;
	$.pb.min = 0;
	$.pb.max = e.overall.total;
	progressHideShow($.pb.max,$.pb.value);

});

Ti.App.addEventListener('cage/tobar/menu_button/close', function(e){
	$.drawermenu.showhidemenu();
	$.drawermenu.menuOpen=!$.drawermenu.menuOpen;	
});

Ti.App.addEventListener('cage/external/link', handleExternal);

function handleExternal(e){
	Ti.API.info('HELLO WORLD:', e, e.itemIndex);
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

	clicked_view = getMenuObject(e.rowData.id);
	Ti.API.info('CURRENT CHILDREN BEFORE: ',$.drawermenu.drawermainview.children)
	if( e.rowData.id == default_view ){
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
}



initWindowButtons(menuitems);
$.drawermenu.init({
    menuview:menuView.getView(),
    mainview:mainView.getView(),
    duration:200,
    parent: $.index
});


var default_view = 'menu_builder'
var active_page = 'menu_builder';
var activeView = 1;

menuView.menuTable.addEventListener('click',handleMenuClickEvent);

$.index.open();


