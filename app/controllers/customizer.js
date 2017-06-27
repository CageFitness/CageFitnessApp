// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sdata = {};
var workout_final_url = Alloy.CFG.api_url + Alloy.CFG.workout_final_path;


var tool_labels=[
	{title:'ADD ROUND', cb:createNewRound},
	{title:'SAVE WORKOUT', cb:saveWorkout},
]
$.customizer_btn_bar.labels = tool_labels;
$.customizer_btn_bar.addEventListener('click',function(e){
	Ti.API.info('TOOL.BAR.TYPE:',e.source.labels[e.index]);
	$.customizer_btn_bar.labels[e.index].cb(e);
});



var tool_edit=[
	{title:'Remove', cb:enableFeature, mode:'edit'},
	{title:'Insert', cb:enableFeature, mode:'insert'},
]
$.insert_remove.labels = tool_edit;
$.insert_remove.addEventListener('click',function(e){
	Ti.API.info('TOOL.BAR.EDIT:',e.source.labels[e.index]);

	$.insert_remove.labels[e.index].cb(e, $.insert_remove.labels[e.index].mode);
});



function enableFeature(e, mode){
	Ti.API.info('ENABLE.INSERT',e);

		_.each($.customizer_list_view.sections,function(section,index){
			
			var sec = $.customizer_list_view.sections[index];
			var els = sec.getItems();

			_.each(els,function(item){
				Ti.API.info('ITEM:',item.properties);
				if(mode=='insert'){
					item.properties.canEdit=false;
					item.properties.canInsert=true;
				}
				else if(mode=='edit'){
					item.properties.canInsert=false;
					item.properties.canEdit=true;
				}
			});
			
			sec.replaceItemsAt(0,_.size(els),els);

	})



}
function enableRemove(e){
	Ti.API.info('ENABLE.REMOVE',e);
}


(function constructor() {
	// init('menu_customizer');
})();

function init(e){
	Ti.API.info('INIT.CALLED');
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


function enableToolButtons(){
	_.each($.customizer_btn_bar.labels,function(btn,index){
		$.customizer_btn_bar.labels[index].cb();
	})
}

function loadWorkout(){
	var wid = Ti.App.Properties.getString('my_workout');
	var wurl = workout_final_url+wid;
	Ti.API.info('ATTEMPT.LOAD.WORKOUT_PLAYER', wurl);
	xhr.GET(wurl, onSuccessCustomizer, onErrorWorkoutCallback, Alloy.Globals.XHROptions);
}

function saveWorkout(e){
	// preare POST request here...
	Ti.API.info('CUSTOMIZER.SAVE.WORKOUT');
	showOptions();

}
function showOptions(){
    $.dialog.show();
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
	Ti.API.info('EXERCISES.IN.ROUND: ', _.size(round.customizer), roundIndex);
	var roundData = [];
	_.each(round.customizer,function(exercise){
		// Ti.API.info('EXERCISE.DATA:', exercise.ID, exercise.post_title);
	    var ob = {
	    	template:'RoundItemTemplate',
	    	properties: { title: exercise.post_title, searchableText:exercise.post_title, launch_data:exercise, 
	    	canMove:true, canInsert:false, canEdit:true, accessoryType:Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE},
	    	pic:{image: exercise.acf.video_featured.url},
	    	main:{text:exercise.post_title},
	    	sub:{text:'REPLACE'},
	    }
	    roundData.push(ob);
	})

	var round_title = 'Round '+roundIndex;
	var hT = Alloy.createController('customizer/header',{htitle:round_title, round_index:roundIndex, onHeaderItemClick:onHeaderItemClick}).getView();
	var roundSection = Ti.UI.createListSection({ headerView: hT});
	roundSection.setItems(roundData);
	$.customizer_list_view.appendSection(roundSection);	
}




// function handleCustomizerTools(e){

// 	Ti.API.info('TOOLS.ITEM.CLICK',e);
// 	if(e.source.type=='add'){
// 		Ti.API.info('TRIGGER.ADD.ROUND.HERE');
// 	}

// }

function onHeaderItemClick(e){
	Ti.API.info('HEADER.ITEM.CLICK',e);
	if(e.source.type=='add'){
		Ti.API.info('TRIGGER.ADD.ROUND.HERE');
	}
}

function handleListViewClick(e){
    
    var sec = $.customizer_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    var exercise = row.properties.launch_data;
    Ti.API.info('URLTEST:',e, e.sectionIndex, e.itemIndex, e.source, row.properties.launch_data.ID);
    launchExercise({'url':exercise.acf.video.url, 'title':exercise.post_title});

}

function launchExercise(e){

	Ti.API.info('LAUNCHING.EXTERNAL.WINDOW.WITH:', e.url);
    var win = Alloy.createController('window', {'cage_url':e.url, 'type':'exercise', 'video_data':e}).getView();

    win.open({modal:true});
    Alloy.Globals.modalWindow = win;

}

function createNewRound(e){
    var round_popover = Alloy.createController('customizer/round', {validate:addNewRound} ).getView();
    round_popover.show({animated:true, view:$.pover_target});
}

// function createNewRoundBelow(e){
//     var round_popover = Alloy.createController('customizer/round', {validate:addNewRound} ).getView();
//     round_popover.show({animated:true, view:$.pover_target});
// }

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
	Ti.API.info('WORKOUT.INSERT.BUTTONBAR:',e);
	$.customizer_list_view.canEdit=false;
	$.customizer_list_view.canInsert=true;
	$.customizer_list_view.setEditing(e.value);



}

function handleEnableEditing(e){
	Ti.API.info('WORKOUT.EDIT.SWITCH:',e);
	$.customizer_list_view.canInsert=false;
	$.customizer_list_view.canEdit=true;
	$.customizer_list_view.setEditing(e.value);

	if(e.value){
		Animation.fadeIn($.insert_remove,100);
	}
	else{
		Animation.fadeOut($.insert_remove,100);
	}


}
// ============================================


