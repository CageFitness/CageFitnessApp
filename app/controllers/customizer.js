// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sdata = {};
var workout_final_url = Alloy.CFG.api_url + Alloy.CFG.workout_final_path;
var config = JSON.parse(Ti.App.Properties.getString('config'));


var title = args.customTitle || 'Customize your Workout';
var image = args.customImage || 'images/layout/workout_theme.png';
var rebuilder = [];


$.header_title.text = title.toUpperCase();
$.header_background.backgroundImage = image;





var tool_labels = [
    // {title:'BEGIN WORKOUT', cb:beginWorkout},
    { title: 'ADD ROUND', cb: addRound },
    { title: 'SAVE WORKOUT', cb: saveWorkout },
]
$.customizer_btn_bar.labels = tool_labels;
$.customizer_btn_bar.addEventListener('click', function(e) {
    Ti.API.info('TOOL.BAR.TYPE:', e.source.labels[e.index]);
    $.customizer_btn_bar.labels[e.index].cb(e);
});

var tool_edit = [
    { title: 'REPLACE', cb: enableFeature, mode: 'replace', right: 10, left: 10 },
    { title: 'INSERT', cb: enableFeature, mode: 'insert', right: 10, left: 10 },
    { title: 'REMOVE', cb: enableFeature, mode: 'edit', right: 10, left: 10 },
]
$.insert_remove.labels = tool_edit;
$.insert_remove.addEventListener('click', function(e) {
    Ti.API.info('TOOL.BAR.EDIT:', e.source.labels[e.index]);

    $.insert_remove.labels[e.index].cb(e, $.insert_remove.labels[e.index].mode);
});

(function constructor() {
    init({ menu_id: 'menu_customizer' });
})();

// $.customizer_list_view.addEventListener('click',function(e){
// 	Ti.API.info('ELEMENT.CLICKED',e);
// });
// Ti.API.info('HEADER.CHILDREN:',$.cutomizer_header.children);


function beginWorkout() {

}


function enableFeature(e, mode) {
    Ti.API.info('ENABLE.FEATURE', e, e.source);



    _.each($.customizer_list_view.sections, function(section, index) {
        var sec = $.customizer_list_view.sections[index];
        var els = sec.getItems();
        _.each(els, function(item) {
            // Ti.API.info('==== ITEM:',item.properties.launch_data.ID);
            if (mode == 'insert') {
                item.properties.canEdit = false;
                item.properties.canInsert = true;
                item.sub.visible = false;
            } else if (mode == 'edit') {
                item.properties.canEdit = true;
                item.properties.canInsert = false;
                item.sub.visible = false;
            } else if (mode == 'replace') {
                item.properties.canEdit = false;
                item.properties.canInsert = false;
                item.sub.visible = true;
            }
        });
        sec.replaceItemsAt(0, _.size(els), els);
    });

    if (mode == 'insert') {
        $.customizer_list_view.canInsert = true;
        $.customizer_list_view.canEdit = false;
        $.customizer_list_view.setEditing(true);
    } else if (mode == 'edit') {
        $.customizer_list_view.canInsert = false;
        $.customizer_list_view.canEdit = true;
        $.customizer_list_view.setEditing(true);
    } else if (mode == 'replace') {
        $.customizer_list_view.canInsert = false;
        $.customizer_list_view.canEdit = true;
        $.customizer_list_view.setEditing(false);
    }

}

function enableRemove(e) {
    Ti.API.info('ENABLE.REMOVE', e);
}




function init(e) {
    Ti.API.info('INIT.CALLED', e);
    if (e.menu_id == 'menu_customizer') {
        $.add_label.applyProperties({ text: 'LOADING WORKOUT...' });
        loadWorkout();

    }
}

// Ti.App.addEventListener('cage/drawer/item_click', init);


function getIndex(n) {
    r = Number(n) + 1;
    return r;
}


// =========================================
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function enableToolButtons() {
    _.each($.customizer_btn_bar.labels, function(btn, index) {
        $.customizer_btn_bar.labels[index].cb();
    })
}

function loadWorkout() {
    var wid = Ti.App.Properties.getString('my_workout');
    var wurl = workout_final_url + wid;

    Alloy.Globals.updateWorkout = 1;
    var updatedCall = Alloy.Globals.updateWorkout ? '?rn=' + getRandomInt(0, 999999999) : '';
    Ti.API.info('ATTEMPT.LOAD.WORKOUT_PLAYER', wurl);

    xhr.GET(wurl + updatedCall, onSuccessCustomizer, onErrorWorkoutCallback, Alloy.Globals.XHROptions);
    Alloy.Globals.updateWorkout = 0;
}


function SaveAsWorkout(){
	Ti.API.info('SAVE.AS.WORKOUT');
	gatherCurrentSelectionClone($.customizer_list_view, to_clone.title);
}

$.dialog.addEventListener('click', function(e) {
    Ti.API.info('DIALOG.RETURNED:', e);
    if (e.index === 0) {
        // $.activity_wrapper.show();
        // $.activity_indicator.show();
        // send_updateCustomizer();
        gatherCurrentSelection($.customizer_list_view);
        Alloy.Globals.updateWorkout = 0;
    }

    else if (e.index === 1){
	    
	    Ti.API.info('BEFORE.POPOVER.WORKOUT.CLONE');
	    to_clone = { id:null, title:'Duplicated Workout'};
	    var new_workout_name_popover = Alloy.createController('builder/create', {follow:SaveAsWorkout, data:to_clone} ).getView();
	    new_workout_name_popover.show({ animated:true, view:$.pover_target});
    }

});



function saveWorkout(e) {
    // preare POST request here...
    Ti.API.info('CUSTOMIZER.SAVE.WORKOUT');
    var review = [];
    var result = '';
    _.each($.customizer_list_view.sections, function(section, index) {
        var experRound = _.size(section.getItems());
        // result
        Ti.API.info('THIS.SECTION.HAS:', experRound);
        result += '\nROUND ' + getIndex(index) + ': ' + experRound + ' exercises.';
        review.push(experRound);
    })
    var valids = [5, 7, 10];
    var is_valid = _.every(review, function(num) {
        return _.contains(valids, num);
    });
    if (is_valid) {
        showOptions();
    } else {
        alert('Please ensure your rounds have 5,7 or 10 exercises:\n' + result);
    }


    // showOptions();

}

function showOptions() {
    $.dialog.show();
}

function onSuccessCustomizer(e) {
    var wkt = Ti.App.Properties.getString('my_workout');
    $.add_label.applyProperties({ text: 'ADD ROUND' });
    var copied = e.data.acf.round_selector[0];
    Ti.API.info('ROUND.DATA.NOT.CUSTOMIZER:');

    _.each(e.data.acf.round_selector, function(item, index) {
        createRound(item, index);
    });

}

function onErrorWorkoutCallback(e) {
    Ti.API.info(e.data);
}
// =========================================

function generateRound(selection, roundIndex) {
    Ti.API.info('GENERATE.ROUND.WITH.CUSTOMIZER:', selection);
    // createRoundFromSelection(selection, roundIndex);
}


function createRound(round, roundIndex) {
    Ti.API.info('EXERCISES.IN.ROUND: ', _.size(round.customizer), roundIndex);
    var roundData = [];

    _.each(round.customizer, function(exercise, index) {
        // Ti.API.info('EXERCISE.DATA:', exercise.ID, exercise.post_title);

        var ob = {
        	// type:'remote',
            template: 'RoundItemTemplate',
            properties: {
                title: exercise.post_title,
                searchableText: exercise.post_title,
                launch_data: exercise,
                exercise_index: index,

                wo_exercise_number: round.wo_exercise_number,
                wo_equipment: round.wo_equipment,
                wo_round_type: round.wo_round_type,

                canMove: true,
                canInsert: false,
                canEdit: true,
                accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
            },
            header_info: {
                wo_exercise_number: round.wo_exercise_number,
                wo_equipment: round.wo_equipment,
                wo_round_type: round.wo_round_type,
            },
            pic: { image: exercise.acf.video_featured.url },
            main: { text: exercise.post_title },
            sub: { text: 'REPLACE' },
        }
        roundData.push(ob);
    });

    var round_title = 'Round.createRound ' + getIndex(roundIndex) + ': ';
    Ti.API.info('HEADER.TITLE.OUT', round_title);
    var hT = Alloy.createController('customizer/header', {
        htitle: round_title,
        round_index: roundIndex,
        onHeaderItemClick: onHeaderItemClick,

        wo_round_type: round.wo_round_type,
        wo_equipment: round.wo_equipment,
        wo_exercise_number: round.wo_exercise_number,

        roundOptions: roundOptions,
        optType: optType,
        optEquipment: optEquipment,

    }).getView();
    // hT.addEventListener('click',roundOptions);
    var roundSection = Ti.UI.createListSection({ headerView: hT });


    roundSection.setItems(roundData);



    $.customizer_list_view.appendSection(roundSection);
}


function createRoundFromSelection(round, roundIndex) {
    Ti.API.info('EXERCISES.IN.ROUND: ', _.size(round.customizer), roundIndex);
    var roundData = [];

    var type = Object(optType(round.exercise_type));
    var equipment = Object(optEquipment(round.exercise_equipment));


    _.each(round.customizer, function(exercise, index) {
        // Ti.API.info('EXERCISE.DATA:', exercise.ID, exercise.post_title);
        var the_title = exercise.title || exercise.post_title || exercise.title.rendered;
        Ti.API.info('IS.TITLE.VALID?', the_title);



        // var num_exercises = round.num_exercises;		


        var ob = {
        	// type:'local',
            template: 'RoundItemTemplate',
            properties: {
                title: exercise.title.rendered,
                searchableText: exercise.title.rendered,
                launch_data: exercise,
                exercise_index: index,

                // wo_exercise_number:round.wo_exercise_number,
                // wo_equipment:round.wo_equipment, 
                // wo_round_type:round.wo_round_type,

                // wo_exercise_number:num_exercises,
                wo_equipment: equipment,
                wo_round_type: type,

                canMove: true,
                canInsert: false,
                canEdit: true,
                accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
            },
            header_info: {

                // wo_exercise_number:round.wo_exercise_number,
                // wo_equipment:round.wo_equipment,
                // wo_round_type:round.wo_round_type,	

                // wo_exercise_number:num_exercises,
                wo_equipment: equipment,
                wo_round_type: type,
            },
            pic: { image: exercise.acf.video_featured.url },
            main: { text: exercise.title.rendered },
            sub: { text: 'REPLACE' },
        }
        roundData.push(ob);
    });

    var round_title = 'Round.createRoundFromSelection ' + getIndex(roundIndex) + ': ';
    var hT = Alloy.createController('customizer/header', {
        htitle: round_title,
        round_index: roundIndex,
        onHeaderItemClick: onHeaderItemClick,
        // wo_round_type:round.wo_round_type,
        // wo_equipment:round.wo_equipment,
        // wo_exercise_number:round.wo_exercise_number,
        optType: optType,
        optEquipment: optEquipment,

        // wo_exercise_number:num_exercises,
        wo_equipment: equipment,
        wo_round_type: type,

        roundOptions: roundOptions,
    }).getView();
    // hT.addEventListener('click',roundOptions);
    var roundSection = Ti.UI.createListSection({ headerView: hT });


    roundSection.setItems(roundData);
    // $.customizer_list_view.appendSection(roundSection);
    $.customizer_list_view.insertSectionAt(roundIndex, roundSection, { animated: true });
    updateCustomizerListHeaders();


}



// function handleCustomizerTools(e){

// 	Ti.API.info('TOOLS.ITEM.CLICK',e);
// 	if(e.source.type=='add'){
// 		Ti.API.info('TRIGGER.ADD.ROUND.HERE');
// 	}

// }

function onHeaderItemClick(e) {
    Ti.API.info('HEADER.ITEM.CLICK', e);
    if (e.source.type == 'add') {
        Ti.API.info('TRIGGER.ADD.ROUND.HERE');
    }
}



function launchExercise(e) {

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

function handleElementInsert(e) {
    Ti.API.info('ELEMENT.INSERT', e);
    replaceExercise(e, 'insert');
    // exercise_data must be here
    // insertItemsAt
}

function handlesCheck(e) {
    var item = e.section.getItemAt(e.itemIndex);

    _.each(e.section.getItems(), function(item, index) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
    });

    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
    } else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
    }
    e.section.updateItemAt(e.itemIndex, item);
}

var last = {};

function handleListViewClick(e) {

    var sec = $.customizer_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    var exercise = row.properties.launch_data;
    Ti.API.info('ROW.DATA.CUSTOMIZER:', row.wo_exercise_number, row.wo_equipment, row.wo_round_type);
    Ti.API.info('REPLACE.INTENT.CUSTOMIZER:', e, e.sectionIndex, e.itemIndex, e.source, row.properties.launch_data.ID);
    last = {
        wo_exercise_number: row.wo_exercise_number,
        wo_equipment: row.wo_equipment,
        wo_round_type: row.wo_round_type,
    };
    // launchExercise({'url':exercise.acf.video.url, 'title':exercise.post_title});
    // Animation.shake(row);
    handlesCheck(e);


    replaceExercise(e, 'replace');
}

function getCurrentMode(mode) {
    var modes = ['insert', 'replace', 'remove'];
    return;
}

function insertExercise(newer, older, validate_mode) {
    var exercise = newer.launch_data;
    // createRound(round,11);
    Ti.API.info('INSERTING EXERCISE:', older, older.sectionIndex, older.itemIndex);
    Ti.API.info('HEADER:', older);
    var original_item = $.customizer_list_view.sections[older.sectionIndex].getItemAt(older.itemIndex);
    Ti.API.info('INSERT.REQUIREMENT:', original_item.properties.title);



    var roundData = [];

    var ob = {
    	// type:'local'
        template: 'RoundItemTemplate',
        properties: {
            title: exercise.title.rendered,
            searchableText: exercise.title.rendered,
            launch_data: exercise,
            wo_round_type: original_item.properties.wo_round_type,
            wo_equipment: original_item.properties.wo_equipment,
            canMove: true,
            canInsert: true,
            canEdit: false,
            accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
        },

        header_info: older.header_info,

        pic: { image: exercise.acf.video_featured.url },
        main: { text: exercise.title.rendered },
        sub: { text: 'REPLACE' },
    }
    roundData.push(ob);

    var mode = validate_mode;
    if (mode == 'insert') {
        $.customizer_list_view.sections[older.sectionIndex].insertItemsAt(older.itemIndex, roundData, { animated: true });
    } else if (mode == 'replace') {
        $.customizer_list_view.sections[older.sectionIndex].replaceItemsAt(older.itemIndex, 1, roundData, { animated: true });
    }
}



// selection:selection_ob,
// roundWin:$.roundWin,
// popover:$.popover_ob,

function replaceExercise(e, insert_mode) {
    Ti.API.info('\n\nBUILD.QUERY');
    var sec = $.customizer_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    // Ti.API.warn('ROW.DATA.REPLACE.INTENT', row.properties);
    var insert_popover = Alloy.createController('customizer/insert', {
        insertExercise: insertExercise,
        validate_mode: insert_mode,
        include: 'customizer/list',
        selection: {
            exercise_equipment: row.properties.wo_equipment.value | row.properties.wo_equipment.term_id,
            exercise_type: row.properties.wo_round_type.value | row.properties.wo_round_type.term_id
            // rounds:row.properties.wo_exercise_number,
        },
        optType: optType,
        optEquipment: optEquipment,
        launch_data: row.properties.launch_data,
        customizerListItem: e,
    }).getView();

    insert_popover.show({ animated: true, view: $.pover_target });
}

// var shared ={
// 	optType:optType,

// }

function roundOptions(roundIndex) {
    Ti.API.info('CALLING.ROUND.OPTIONS.POPOVER', roundIndex);
    var round_popover = Alloy.createController('customizer/round_options', {

        validate: addNewRoundValidate,
        createRoundFromSelection: createRoundFromSelection,
        optType: optType,
        optEquipment: optEquipment,
        round_index: roundIndex,

        customizer_list_view: $.customizer_list_view,
        removeRound: removeRound,


    }).getView();
    round_popover.show({ animated: true, view: $.pover_target });
    // createNewRound(e);
}


function addRound(e) {
    scrollToLast(e);
    createNewRound(e);
}

function createNewRound(e) {
    var round_popover = Alloy.createController('customizer/selection', {

        validate: addNewRoundValidate,
        generateRound: generateRound,
        createRoundFromSelection: createRoundFromSelection,
        optType: optType,
        optEquipment: optEquipment,
        round_index: $.customizer_list_view.getSections().length,

        customizer_list_view: $.customizer_list_view
    }).getView();
    round_popover.show({ animated: true, view: $.pover_target });
}

// function createNewRoundBelow(e){
//     var round_popover = Alloy.createController('customizer/round', {validate:addNewRoundValidate} ).getView();
//     round_popover.show({animated:true, view:$.pover_target});
// }

function removeRound(roundIndex) {
    Ti.API.info('ATTEMPT.TO.REMOVE.ROUND:', roundIndex);
    $.customizer_list_view.deleteSectionAt(roundIndex);
    updateCustomizerListHeaders();
}












function addNewRoundValidate(e, roundIndex) {
    // Ti.API.info('ADD.ROUND.CALLBACK', e);
    Ti.API.info('ADD.ROUND.CALLBACK');



    // if(e=='remove'){
    // 	removeRound(0);
    // }
    // createRoundFromSelection(e,roundIndex);

    
}








// function handleClickPopOver(e) {
//     Alloy.Globals.currentSelectButton = e.source;
//     // Ti.API.info(e.itemIndex)
//     var round_popover = Alloy.createController('customizer/add_round', {validate:updateStep_TYPE, row:e.itemIndex} ).getView();
//     round_popover.show({animated:true,view:e.source});
// }

function ToggleMe() {

}

function handleEnableInserting(e) {
    Ti.API.info('WORKOUT.INSERT.BUTTONBAR:', e);
    $.customizer_list_view.canEdit = false;
    $.customizer_list_view.canInsert = true;
    $.customizer_list_view.setEditing(e.value);



}

$.customizer_list_view.addEventListener('insert', handleElementInsert)

function hideReplace(bol) {
    if (bol) {


        _.each($.customizer_list_view.sections, function(section, index) {

            var sec = $.customizer_list_view.sections[index];
            var els = sec.getItems();

            _.each(els, function(item) {
                item.sub.visible = bol;
            });

            sec.replaceItemsAt(0, _.size(els), els);

        })

    }
}


function handleEnableEditing(e) {
    Ti.API.info('WORKOUT.EDIT.SWITCH:', e);
    $.customizer_list_view.canInsert = false;
    $.customizer_list_view.canEdit = true;
    $.customizer_list_view.setEditing(e.value);

    if (e.value) {
        // Animation.fadeIn($.insert_remove,100);
        // hideReplace(true);

    } else {
        // Animation.fadeOut($.insert_remove,100);
        // hideReplace(false);
    }

}
// ============================================


function onErrorCustomizerEdit(e) {
    Ti.API.info('EDIT.REQUEST: ', e);
}

function onSuccessCustomizerEdit(e) {
    Ti.API.info('EDIT.REQUEST: ', e.status, e.data);
    $.add_label.applyProperties({ text: 'LOADING WORKOUT...' });
    Ti.API.info('SAVING.WORKOUT.PLEASE.WAIT', _.size($.customizer_list_view.sections));


    loadWorkout();

}


function send_updateCustomizer(selection_data) {

    $.add_label.applyProperties({ text: 'SAVING WORKOUT...' });

    _.each($.customizer_list_view.getSections(), function(section, index) {
        Ti.API.info('ATTEMPT TO REMOVE', section);
        $.customizer_list_view.deleteSectionAt(_.last($.customizer_list_view.getSections()));
    });



    xhr.POST('https://cagefitness.com/wp-json/app/v1/customize', JSON.stringify(selection_data), onSuccessCustomizerEdit, onErrorCustomizerEdit);


}



function optType(ttid) {
    return _.findWhere(config.acf.opt_type, { 'term_taxonomy_id': Number(ttid) });
}

function optEquipment(ttid) {
    return _.findWhere(config.acf.opt_equipment, { 'term_taxonomy_id': Number(ttid) });
}

function scrollToLast(e) {

	if($.customizer_list_view.getSections() > 0){
	    var sections = $.customizer_list_view.getSections();
	    var last_section_index = sections.length - 1;
	    var last_items = $.customizer_list_view.sections[last_section_index].getItems();
	    var last_item_index = last_items.length - 1;
	    $.customizer_list_view.scrollToItem(last_section_index, last_item_index, { animated: true });
    }
}




function onSuccessClone(e) {
    Ti.API.info('CLONING.SUCEEDED: ', e.status, e.data);
    Ti.App.fireEvent('cage/topbar/menu_button/close', {window_type:'modal'});
    Ti.App.fireEvent('cage/profile/refresh');
}






function send_updateCustomizerClone(selection_data) {

    $.add_label.applyProperties({ text: 'SAVING WORKOUT...' });

    _.each($.customizer_list_view.getSections(), function(section, index) {
        Ti.API.info('ATTEMPT TO REMOVE', section);
        $.customizer_list_view.deleteSectionAt(_.last($.customizer_list_view.getSections()));
    });

    xhr.POST('https://cagefitness.com/wp-json/app/v1/my-workout', JSON.stringify(selection_data), onSuccessClone, onErrorCustomizerEdit);

}



function gatherCurrentSelectionClone(listview, newtitle) {

    var sections = $.customizer_list_view.getSections();

    var sel = {
        filter: 'red',
        id: Ti.App.Properties.getString('my_workout'),
        // build: 'auto',
        title: newtitle,
        create:'true',
        build: 'custom',
        update: 'false',
        rounds: _.map(listview.getSections(), function(round, sectionIndex) {

            var first = $.customizer_list_view.sections[sectionIndex].getItemAt(0);
            var type = Object(optType(first.properties.wo_round_type.value || first.properties.wo_round_type.term_taxonomy_id));
            var equipment = Object(optEquipment(first.properties.wo_equipment.value || first.properties.wo_equipment.term_taxonomy_id));

            // Ti.API.info('GRABBING.ROUND.INFO:', first.properties['wo_round_type']);

            return {
                round: getIndex(sectionIndex),
                roundTitle: type.name,
                numexercises: _.size(round.getItems()),
                roundType: type.slug,
                equipment: equipment.slug,
                customizer: _.map(round.getItems(), function(exercise, index) {
                    return exercise.properties.launch_data.id || exercise.properties.launch_data.ID;
                })
            };
        })
    }

    Ti.API.warn('SELECTION.DATA.DYNAMIC.CLONE', sel);
    send_updateCustomizerClone(sel);

}






















function gatherCurrentSelection(listview) {
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
    var sections = $.customizer_list_view.getSections();


    // iqdev



    var sel = {
        filter: 'app',
        id: Ti.App.Properties.getString('my_workout'),
        // build: 'auto',
        build: 'custom',
        update: 'true',
        rounds: _.map(listview.getSections(), function(round, sectionIndex) {

            var first = $.customizer_list_view.sections[sectionIndex].getItemAt(0);
            var type = Object(optType(first.properties.wo_round_type.value || first.properties.wo_round_type.term_taxonomy_id));
            var equipment = Object(optEquipment(first.properties.wo_equipment.value || first.properties.wo_equipment.term_taxonomy_id));

            Ti.API.info('GRABBING.ROUND.INFO:', first.properties['wo_round_type']);

            return {
                round: getIndex(sectionIndex),
                roundTitle: type.name,
                numexercises: _.size(round.getItems()),
                roundType: type.slug,
                equipment: equipment.slug,
                customizer: _.map(round.getItems(), function(exercise, index) {
                    return exercise.properties.launch_data.id || exercise.properties.launch_data.ID;
                })
            };
        })
    }

    // Ti.API.info('SELECTION.DATA.STATIC',selection);
    Ti.API.info('SELECTION.DATA.DYNAMIC', sel);


    send_updateCustomizer(sel);


}


function updateCustomizerListHeaders(){
	// rebuilder = [];
	// _.each($.customizer_list_view.sections, function(section, index){
	// 	var items = section.getItems();
	// 	rebuilder.push(items);

	// 	// Ti.API.warn('ROUND: ',section, index);
	// 	// var headView = section.getHeaderView();
	// 	// // headView.round_index = index;
	// 	// // headView.updateRoundTitle(index);
	// 	// Ti.API.info(headView);

	// });
	// Ti.API.warn('REBUILDER:', rebuilder );
	// _.each(rebuilder,function(section, index){
	// 	$.customizer_list_view.sections[index].setItems(section);
	// });



	_.each($.customizer_list_view.sections, function(section, index){
		var header_view = section.getHeaderView();
		Ti.API.warn('UPDATE.CUSTOMIZER.LIST.HEADERS:', header_view, header_view.round_index );
		header_view.round_index = index;
		header_view.updateRoundTitle(index);
		Ti.API.warn('UPDATE.CUSTOMIZER.LIST.HEADERS.AFTER:', header_view, header_view.round_index );
	});


}

