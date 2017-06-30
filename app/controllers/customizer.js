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
	{title:'Replace', cb:enableFeature, mode:'replace'},
	{title:'Insert', cb:enableFeature, mode:'insert'},
	{title:'Remove', cb:enableFeature, mode:'edit'},
]
$.insert_remove.labels = tool_edit;
$.insert_remove.addEventListener('click',function(e){
	Ti.API.info('TOOL.BAR.EDIT:',e.source.labels[e.index]);

	$.insert_remove.labels[e.index].cb(e, $.insert_remove.labels[e.index].mode);
});

(function constructor() {
	init({menu_id:'menu_customizer'});
})();

// $.customizer_list_view.addEventListener('click',function(e){
// 	Ti.API.info('ELEMENT.CLICKED',e);
// });





function enableFeature(e, mode){
	Ti.API.info('ENABLE.INSERT',e);

		if(mode=='insert'){
			$.customizer_list_view.canInsert=true;
			$.customizer_list_view.canEdit=false;
			$.customizer_list_view.setEditing(true);
		}
		else if (mode=='edit'){
			$.customizer_list_view.canInsert=false;
			$.customizer_list_view.canEdit=true;
			$.customizer_list_view.setEditing(true);
		}
		else if (mode=='replace'){
			$.customizer_list_view.canInsert=false;
			$.customizer_list_view.canEdit=false;
			$.customizer_list_view.setEditing(false);
		}

		_.each($.customizer_list_view.sections,function(section,index){
			
			var sec = $.customizer_list_view.sections[index];
			var els = sec.getItems();

			_.each(els,function(item){
				Ti.API.info('==== ITEM:',item.properties.launch_data.ID);
				if(mode=='insert'){
					item.properties.canEdit=false;
					item.properties.canInsert=true;
					item.sub.visible=false;
				}
				else if(mode=='edit'){
					item.properties.canEdit=true;
					item.properties.canInsert=false;
					item.sub.visible=false;
				}
				else if(mode=='replace'){
					item.properties.canEdit=false;
					item.properties.canInsert=false;
					item.sub.visible=true;
				}
			});
			
			sec.replaceItemsAt(0,_.size(els),els);

	})



}
function enableRemove(e){
	Ti.API.info('ENABLE.REMOVE',e);
}




function init(e){
	Ti.API.info('INIT.CALLED', e);
	if(e.menu_id=='menu_customizer'){
		loadWorkout();
	}
}

// Ti.App.addEventListener('cage/drawer/item_click', init);


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

$.dialog.addEventListener('click',function(e){
	Ti.API.info('DIALOG.RETURNED:',e);

	// $.activity_wrapper.show();
	// $.activity_indicator.show();
	// sendData();

});

function saveWorkout(e){
	// preare POST request here...
	Ti.API.info('CUSTOMIZER.SAVE.WORKOUT');
	var review =[];
	var result='';
	_.each($.customizer_list_view.sections,function(section,index){
		var experRound = _.size(section.getItems());
		result
		Ti.API.info('THIS.SECTION.HAS:', experRound );
		result+='\nROUND '+getIndex(index)+': '+experRound+' exercises.';
		review.push(experRound);
	})
	var valids = [5,7,10];
	var is_valid = _.every(review,function(num){
		return _.contains(valids,num);
	});
	if(is_valid){
		showOptions();
	}
	else{
		alert('Please ensure your rounds have 5,7 or 10 exercises:\n'+result);
	}
	

	// showOptions();

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
	_.each(round.customizer,function(exercise, index){
		// Ti.API.info('EXERCISE.DATA:', exercise.ID, exercise.post_title);

	    var ob = {
	    	template:'RoundItemTemplate',
	    	properties: { title: exercise.post_title, searchableText:exercise.post_title, launch_data:exercise, exercise_index:index,
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



function launchExercise(e){

	Ti.API.info('LAUNCHING.EXTERNAL.WINDOW.WITH:', e.url);

	// $.wx = Ti.UI.iOS.createNavigationWindow({
	//     window: Ti.UI.createWindow({
	//         title: e.title,
	//         video_data:e,
	//     })
	// });
	// $.full = Alloy.createController('exercise/full',{'video_data':e, ref:$.wx}).getView();
	// $.wx.add($.full);


	// $.wx.open({
	//     modal: true,
	//     modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
	//     modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_FORMSHEET
	// });


 //    // var win = Alloy.createController('window', {'cage_url':e.url, 'type':'exercise', 'video_data':e}).getView();

 //    // win.open({modal:true,
 //    // modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
 //    // modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_FORMSHEET
 //    // });
 //    // Alloy.Globals.modalWindow = win;

}



function handleElementInsert(e){
	Ti.API.info('ELEMENT.INSERT',e);
	replaceExercise(e, 'insert');
	// exercise_data must be here
	// insertItemsAt
}

function handleListViewClick(e){
    
    var sec = $.customizer_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    var exercise = row.properties.launch_data;
    Ti.API.info('REPLACE.INTENT:',e, e.sectionIndex, e.itemIndex, e.source, row.properties.launch_data.ID);
    // launchExercise({'url':exercise.acf.video.url, 'title':exercise.post_title});
    replaceExercise(e, 'replace');
}

function getCurrentMode(mode){
	var modes = ['insert','replace','remove'];

	return 
}

function insertExercise(el,cli,validate_mode){
	var exercise = el.launch_data;
	// createRound(round,11);
	Ti.API.info('INSERTING EXERCISE:', cli);
	var roundData = [];

	    var ob = {
	    	template:'RoundItemTemplate',
	    	properties: { title: exercise.title.rendered, searchableText:exercise.post_title, launch_data:exercise,
	    	canMove:true, canInsert:true, canEdit:false, accessoryType:Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE},
	    	pic:{image: exercise.acf.video_featured.url},
	    	main:{text:exercise.title.rendered},
	    	sub:{text:'REPLACE'},
	    }
	    roundData.push(ob);

	    var mode = validate_mode;
	    if(mode=='insert'){
	    	$.customizer_list_view.sections[cli.sectionIndex].insertItemsAt(cli.itemIndex,roundData,{animated:true});
	    }
	    else if (mode=='replace'){
	    	$.customizer_list_view.sections[cli.sectionIndex].replaceItemsAt(cli.itemIndex,1,roundData,{animated:true});	
	    }
}



    	// selection:selection_ob,
    	// roundWin:$.roundWin,
    	// popover:$.popover_ob,

function replaceExercise(e, insert_mode){

    var round_popover = Alloy.createController('customizer/insert', {
    	validate:insertExercise,
    	validate_mode:insert_mode,
    	include:'customizer/list',
    	selection:{
    		equipment:'bands',
    		type:'upper-body',
    		rounds:7,
    	},
    	customizerListItem:e,
    }).getView();

    round_popover.show({animated:true, view:$.insert_remove});
}

function createNewRound(e){
    var round_popover = Alloy.createController('customizer/selection', {validate:addNewRound} ).getView();
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

$.customizer_list_view.addEventListener('insert',handleElementInsert)

function hideReplace(bol){
	if(bol){


		_.each($.customizer_list_view.sections,function(section,index){
			
			var sec = $.customizer_list_view.sections[index];
			var els = sec.getItems();

			_.each(els,function(item){
				item.sub.visible=bol;
			});
			
			sec.replaceItemsAt(0,_.size(els),els);

	})

	}
}


function handleEnableEditing(e){
	Ti.API.info('WORKOUT.EDIT.SWITCH:',e);
	$.customizer_list_view.canInsert=false;
	$.customizer_list_view.canEdit=true;
	$.customizer_list_view.setEditing(e.value);

	if(e.value){
		// Animation.fadeIn($.insert_remove,100);
		// hideReplace(true);

	}
	else{
		// Animation.fadeOut($.insert_remove,100);
		// hideReplace(false);
	}

}
// ============================================
















function sendData(){

Ti.API.info('SAVING.WORKOUT.PLEASE.WAIT');
 //    sdata.filter='red';
 //    finalData = JSON.stringify(sdata);

	// Ti.API.info('AUTO.GENERATE.WORKOUT.WITH:', finalData);
	// // Ti.API.info('DOS', token);

	// var urlx = Alloy.CFG.api_url+Alloy.CFG.workout_create_update;
	// Ti.API.info('URL:',urlx);

	// xhr.POST('https://cagefitness.com/wp-json/app/v1/my-workout', finalData, onSuccessCustomizer, onErrorCustomizer);

}



