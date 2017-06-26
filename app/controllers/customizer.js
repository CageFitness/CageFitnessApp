// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sdata = {};
var workout_final_url = Alloy.CFG.api_url + Alloy.CFG.workout_final_path;


	
(function constructor() {
	// init('menu_customizer');
})();

function init(e){
	if(e.menu_id=='menu_customizer'){
		loadWorkout();
	}
}

Ti.App.addEventListener('cage/drawer/item_click', init);


function getIndex(n){
	r = Number(n)+1; 
	return r;
}


// =========================================

function loadWorkout(){
	var wid = Ti.App.Properties.getString('my_workout');
	var wurl = workout_final_url+wid;
	Ti.API.info('ATTEMPT.LOAD.WORKOUT_PLAYER', wurl);
	xhr.GET(wurl, onSuccessCustomizer, onErrorWorkoutCallback, Alloy.Globals.XHROptions);
}

function onSuccessCustomizer(e){
   var wkt = Ti.App.Properties.getString('my_workout');
   _.each(e.data.acf.round_selector,function(item,index){
   		var roundIndex = getIndex(index);
   		createRound(item,roundIndex);
   });
}

function onErrorWorkoutCallback(e){
	Ti.API.info(e.data);
}
// =========================================


function createRound(round, roundIndex){
	Ti.API.info('EXERCISES.IN.ROUND: ', _.size(round.customizer));
	var roundData = [];
	_.each(round.customizer,function(exercise){
		// Ti.API.info('EXERCISE.DATA:', exercise.ID, exercise.post_title);
	    var ob = {
	    	template:'RoundTemplate',
	    	properties: { title: exercise.post_title, searchableText:exercise.post_title,
	    	canMove:true, canInsert:false, canEdit:true,},
	    	main:{text:exercise.post_title},
	    	sub:{text:'Bands'},
	    }
	    roundData.push(ob);
	})

	var round_title = 'Round '+roundIndex;
	var hT = Alloy.createController('customizer/header',{htitle:round_title}).getView();
	var roundSection = Ti.UI.createListSection({ headerView: hT});
	roundSection.setItems(roundData);
	$.customizer_list_view.appendSection(roundSection);	
}

function handleListViewClick(e){
    Ti.API.info('URLTEST:',e, e.sectionIndex, e.itemIndex);
}

function createNewRound(e){
    var round_popover = Alloy.createController('customizer/round', {validate:addNewRound} ).getView();
    round_popover.show({animated:true,view:e.source});
}


function addNewRound(e){
	Ti.API.info('ADD.ROUND.CALLBACK',e)
}

// function handleClickPopOver(e) {
//     Alloy.Globals.currentSelectButton = e.source;
//     // Ti.API.info(e.itemIndex)
//     var round_popover = Alloy.createController('customizer/add_round', {validate:updateStep_TYPE, row:e.itemIndex} ).getView();
//     round_popover.show({animated:true,view:e.source});
// }

function ToggleMe(){

}

function handleEnableInserting(e){
	Ti.API.info('WORKOUT.EDIT.SWITCH:',e);
	$.customizer_list_view.canEdit=false;
	$.customizer_list_view.canInsert=true;
	$.customizer_list_view.setEditing(e.value);
}

function handleEnableEditing(e){
	Ti.API.info('WORKOUT.EDIT.SWITCH:',e);
	$.customizer_list_view.canInsert=false;
	$.customizer_list_view.canEdit=true;
	$.customizer_list_view.setEditing(e.value);
}
// ============================================


