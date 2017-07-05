// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sdata = {};
var workout_final_url = Alloy.CFG.api_url + Alloy.CFG.workout_final_path;
var config = JSON.parse( Ti.App.Properties.getString('config') );

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
	{title:'REPLACE', cb:enableFeature, mode:'replace', right:10, left:10},
	{title:'INSERT', cb:enableFeature, mode:'insert', right:10, left:10},
	{title:'REMOVE', cb:enableFeature, mode:'edit', right:10, left:10},
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
	Ti.API.info('ENABLE.FEATURE',e, e.source);



		_.each($.customizer_list_view.sections,function(section,index){
			var sec = $.customizer_list_view.sections[index];
			var els = sec.getItems();
			_.each(els,function(item){
				// Ti.API.info('==== ITEM:',item.properties.launch_data.ID);
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
		});

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
			$.customizer_list_view.canEdit=true;
			$.customizer_list_view.setEditing(false);
		}

}
function enableRemove(e){
	Ti.API.info('ENABLE.REMOVE',e);
}




function init(e){
	Ti.API.info('INIT.CALLED', e);
	if(e.menu_id=='menu_customizer'){
		$.add_label.applyProperties({text:'LOADING WORKOUT...'});
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
	// send_updateCustomizer();
	gatherCurrentSelection($.customizer_list_view);

	Alloy.Globals.updateWorkout=0;

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
   $.add_label.applyProperties({text:'ADD ROUND'});
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
	    	properties: { 
	    		title: exercise.post_title,
	    		searchableText:exercise.post_title,
	    		launch_data:exercise,
	    		exercise_index:index,
				wo_exercise_number:round.wo_exercise_number,
				wo_equipment:round.wo_equipment,
				wo_round_type:round.wo_round_type,
		    	canMove:true,
		    	canInsert:false,
		    	canEdit:true,
		    	accessoryType:Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
	   		 },
	   		header_info:{
				wo_exercise_number:round.wo_exercise_number,
				wo_equipment:round.wo_equipment,
				wo_round_type:round.wo_round_type,	   			
	   		},
	    	pic:{image: exercise.acf.video_featured.url},
	    	main:{text:exercise.post_title},
	    	sub:{text:'REPLACE'},
	    }
	    roundData.push(ob);
	})

	var round_title = 'Round '+roundIndex+': ';
	var hT = Alloy.createController('customizer/header',{
			htitle:round_title,
			round_index:roundIndex,
			onHeaderItemClick:onHeaderItemClick,
			wo_round_type:round.wo_round_type,
			wo_equipment:round.wo_equipment,
			wo_exercise_number:round.wo_exercise_number,
		});
	var roundSection = Ti.UI.createListSection({ headerView: hT.getView()});
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

// LITHIUMLAB

function handleElementInsert(e){
	Ti.API.info('ELEMENT.INSERT',e);
	replaceExercise(e, 'insert');
	// exercise_data must be here
	// insertItemsAt
}

function handlesCheck(e){
    var item = e.section.getItemAt(e.itemIndex);

    _.each(e.section.getItems(),function(item,index){
    	item.properties.accessoryType =Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
    });

    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
    }
    else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
    }
    e.section.updateItemAt(e.itemIndex, item);	
}

var last={};

function handleListViewClick(e){
    
    var sec = $.customizer_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    var exercise = row.properties.launch_data;
    Ti.API.info('ROW.DATA:',row.wo_exercise_number, row.wo_equipment, row.wo_round_type);
    Ti.API.info('REPLACE.INTENT:',e, e.sectionIndex, e.itemIndex, e.source, row.properties.launch_data.ID);
    last = {
    	wo_exercise_number:row.wo_exercise_number,
    	wo_equipment:row.wo_equipment,
    	wo_round_type:row.wo_round_type,
    };
    // launchExercise({'url':exercise.acf.video.url, 'title':exercise.post_title});
    // Animation.shake(row);
    handlesCheck(e);


    replaceExercise(e, 'replace');
}

function getCurrentMode(mode){
	var modes = ['insert','replace','remove'];
	return;
}

function insertExercise(newer,older,validate_mode){
	var exercise = newer.launch_data;
	// createRound(round,11);
	Ti.API.info('INSERTING EXERCISE:', older, older.sectionIndex, older.itemIndex);
	Ti.API.info('HEADER:', older);
	var original_item = $.customizer_list_view.sections[older.sectionIndex].getItemAt(older.itemIndex);
	Ti.API.info('INSERT.REQUIREMENT:',original_item.properties.title);



	var roundData = [];

	    var ob = {
	    	template:'RoundItemTemplate',
	    	properties: { 
	    	title: exercise.title.rendered,
	    	searchableText:exercise.title.rendered,
	    	launch_data:exercise,
	    	wo_round_type:original_item.properties.wo_round_type,
	    	wo_equipment:original_item.properties.wo_equipment,
	    	canMove:true, canInsert:true, canEdit:false, accessoryType:Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE},
	    	
	    	header_info:older.header_info,
	    	
	    	pic:{image: exercise.acf.video_featured.url},
	    	main:{text:exercise.title.rendered},
	    	sub:{text:'REPLACE'},
	    }
	    roundData.push(ob);

	    var mode = validate_mode;
	    if(mode=='insert'){
	    	$.customizer_list_view.sections[older.sectionIndex].insertItemsAt(older.itemIndex,roundData,{animated:true});
	    }
	    else if (mode=='replace'){
	    	$.customizer_list_view.sections[older.sectionIndex].replaceItemsAt(older.itemIndex,1,roundData,{animated:true});	
	    }
}



    	// selection:selection_ob,
    	// roundWin:$.roundWin,
    	// popover:$.popover_ob,

function replaceExercise(e, insert_mode){
	Ti.API.info('\n\nBUILD.QUERY');
	var sec = $.customizer_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    Ti.API.info('ROW.DATA',row.properties);
    var insert_popover = Alloy.createController('customizer/insert', {
    	insertExercise:insertExercise,
    	validate_mode:insert_mode,
    	include:'customizer/list',
    	selection:{
    		equipment:row.properties.wo_equipment.value,
    		type:row.properties.wo_round_type.value,
    		rounds:row.properties.wo_exercise_number,
    	},
    	launch_data:row.properties.launch_data,
    	customizerListItem:e,
    }).getView();

    insert_popover.show({animated:true, view:$.insert_remove});
}

function createNewRound(e){
    var round_popover = Alloy.createController('customizer/selection', {validate:addNewRound, customizer_list_view:$.customizer_list_view} ).getView();
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


function onErrorCustomizerEdit(e){
	Ti.API.info('EDIT.REQUEST: ', e);
}

function onSuccessCustomizerEdit(e){
	Ti.API.info('EDIT.REQUEST: ', e.status, e.data);
	$.add_label.applyProperties({text:'LOADING WORKOUT...'});
	Ti.API.info('SAVING.WORKOUT.PLEASE.WAIT', _.size($.customizer_list_view.sections));


	loadWorkout();

}


function send_updateCustomizer(selection_data){

	 $.add_label.applyProperties({text:'SAVING WORKOUT...'});

	_.each($.customizer_list_view.getSections(), function(section,index){
		Ti.API.info('ATTEMPT TO REMOVE', section);
		$.customizer_list_view.deleteSectionAt( _.last( $.customizer_list_view.getSections() ));
	});
	


	xhr.POST('https://cagefitness.com/wp-json/app/v1/customize', JSON.stringify(selection_data), onSuccessCustomizerEdit, onErrorCustomizerEdit);
	

}



function optType(ttid){
	return _.findWhere( config.acf.opt_type, {'term_taxonomy_id':Number(ttid)} );
}

function optEquipment(ttid){
	return _.findWhere( config.acf.opt_equipment, {'term_taxonomy_id':Number(ttid)} );
}


function gatherCurrentSelection(listview){
	// round.properties.launch_data
	// listview.sections
	// listItem.getItems()

		// var selection = {
		//   filter:'red',
		//   build: 'auto',
		//   update: 'true',
		//   rounds: [
		//     {
		//       round: 1,
		//       roundType: 'upper-body',
		//       roundTitle: 'Upper Body',
		//       numexercises: 10,
		//       equipment: 'body-weight',
		//       customizer:[12381,12377,12373,12361,12357],
		//     },
		//     {
		//       round: 2,
		//       roundType: 'warm-up',
		//       roundTitle: 'Warm Up',
		//       numexercises: 10,
		//       equipment: 'body-weight',
		//       customizer:[12389,12385,12381,12377,12373],
		//     }
		//   ]
		// };

	var sel = {
		  filter:'app',
		  // build: 'auto',
		  build: 'custom',
		  update: 'true',
		  rounds: _.map(listview.getSections(),function(round,roundIndex){
		  	// var header = round.getItems()[0];

		  	// Ti.API.info('HEADER_INFO.ERROR', header.properties.header_info );
		  	// Ti.API.info('BEFORE.ERROR', header.properties.launch_data.id );

		  	// var type = Object(optType(first.properties.wo_round_type.value));
		  	// var equipment = Object(optEquipment(first.properties.wo_equipment.value));

		  	var first = $.customizer_list_view.sections[roundIndex].getItemAt(0);

		  	Ti.API.info('OUR.ITEM.TYPE:',Object(optType(first.properties.wo_round_type.value)).slug);
		  	Ti.API.info('OUR.ITEM.EQUIPMENT:',Object(optEquipment(first.properties.wo_equipment.value)).slug);

		  	var type = Object(optType(first.properties.wo_round_type.value));
		  	var equipment = Object(optEquipment(first.properties.wo_equipment.value));


			return {
				round: getIndex(roundIndex),
				roundTitle: type.name,
				numexercises: _.size(round.getItems()),
				roundType: type.slug,
				equipment: equipment.slug,
				customizer: _.map(round.getItems(),function(exercise,index){
					return exercise.properties.launch_data.id||exercise.properties.launch_data.ID;
				})
			};
		})
	}

	// Ti.API.info('SELECTION.DATA.STATIC',selection);
	Ti.API.info('SELECTION.DATA.DYNAMIC',sel);


	send_updateCustomizer(sel);


}
