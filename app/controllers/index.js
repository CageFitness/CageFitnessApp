var controls=require('controls');

// get main and menu view as objects
var menuView 		= controls.getMenuView();
var mainView 		= controls.getMainView();

var exerciseView 	= controls.getExerciseView();
var helpView 		= controls.getHelpView();
var profileView 	= controls.getProfileView();
// mainView.menuButton.add(controls.getMenuButton({
//     h: '60',
//     w: '60'
// }));
// mainView.menuButton.addEventListener('click',function(){
//     $.drawermenu.showhidemenu();
//     $.drawermenu.menuOpen=!$.drawermenu.menuOpen;
// }); 


// get config view as objects
// var configView=controls.getConfigView();



var menuitems = [];
menuitems['menu_builder'] = {view:mainView, index:1};
menuitems['menu_exercises']= {view:exerciseView, index:2};
menuitems['menu_help']= {view:helpView, index:3};
menuitems['menu_profile']= {view:profileView, index:4};
// menuitems['menu_configuration']= {view:'configView'};
// menuitems['menu_workouts']= {view:workoutsView};

function initWindowButtons(items){

	for (each in items){
		var v = items[each].view;
		Ti.API.info("WHATS V: ",each);
		v.menuButton.add(controls.getMenuButton({h: '60', w: '60'}));
		v.menuButton.addEventListener('click',function(){

			Ti.API.info('ONCLICK.SHOULD.WORK');
		    $.drawermenu.showhidemenu();
		    $.drawermenu.menuOpen=!$.drawermenu.menuOpen;

		});
	}
}

initWindowButtons(menuitems);

// exerciseView.menuButton.add(controls.getMenuButton({h: '60', w: '60'}));

// exerciseView.menuButton.addEventListener('click',function(){
//     $.drawermenu.showhidemenu();
//     $.drawermenu.menuOpen=!$.drawermenu.menuOpen;
// }); 


$.drawermenu.init({
    menuview:menuView.getView(),
    mainview:mainView.getView(),
    duration:200,
    parent: $.index
});

//variable to control the open/close slide




// Ti.API.info(menuitems['menu_builder'].view)
function getMenuObject(item){
	return menuitems[item].view;
}

var default_view = 'menu_builder'
var active_page = 'menu_builder';

var activeView = 1;
menuView.menuTable.addEventListener('click',function(e){

    $.drawermenu.showhidemenu();
    $.drawermenu.menuOpen = false;

	clicked_view = getMenuObject(e.rowData.id);
	// Ti.API.info('LI: ',activeView);
	Ti.API.info('CURRENT CHILDREN BEFORE: ',$.drawermenu.drawermainview.children)
	// if home item clicked
	if( e.rowData.id == default_view ){
		// if not currently in home
		if(active_page != default_view){
			// remove any other view that is not default
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



    // if(e.rowData.id==="menu_builder"){
    //     if(activeView != 1){
    //         $.drawermenu.drawermainview.remove(exerciseView.getView());
    //         activeView = 1;
    //     } else {
    //         activeView = 1;
    //     }
    // } 
    // if(e.rowData.id==="menu_exercises"){
    //     if(activeView !=2 ){
    //         $.drawermenu.drawermainview.add(exerciseView.getView());
    //         activeView = 2;
    //     } else{
    //         activeView = 2;
    //     }
    // }
    
    // if(e.rowData.id==="menu_help"){
    //     if(activeView !=3 ){
    //         $.drawermenu.drawermainview.add(helpView.getView());
    //         activeView = 3;
    //     } else{
    //         activeView = 3;
    //     }
    // }
    // if(e.rowData.id==="menu_profile"){
    //     if(activeView !=4 ){
    //         $.drawermenu.drawermainview.add(profileView.getView());
    //         activeView = 4;
    //     } else{
    //         activeView = 4;
    //     }
    // }    

    Ti.API.info(e.rowData.id); 
});

$.index.open();


