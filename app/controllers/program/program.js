// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sdata = {};
var workout_final_url = Alloy.CFG.api_url + Alloy.CFG.workout_final_path;
// var program_final_url = Alloy.CFG.api_url + Alloy.CFG.program_path;
var program_final_url = Alloy.CFG.api_url + Alloy.CFG.program_path_test;
var config = JSON.parse(Ti.App.Properties.getString('config'));


var title = args.customTitle || '12 Week Programs';
var image = args.customImage || 'images/layout/programs.png';
var rebuilder = [];


$.header_title.text = title.toUpperCase();
$.header_background.backgroundImage = image;



(function constructor() {
    init({ menu_id: 'menu_customizer' });
})();


function enableFeature(e, mode) {
    Ti.API.info('ENABLE.FEATURE', e, e.source);



    _.each($.program_list_view.sections, function(section, index) {
        var sec = $.program_list_view.sections[index];
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
        $.program_list_view.canInsert = true;
        $.program_list_view.canEdit = false;
        $.program_list_view.setEditing(true);
    } else if (mode == 'edit') {
        $.program_list_view.canInsert = false;
        $.program_list_view.canEdit = true;
        $.program_list_view.setEditing(true);
    } else if (mode == 'replace') {
        $.program_list_view.canInsert = false;
        $.program_list_view.canEdit = true;
        $.program_list_view.setEditing(false);
    }

}

function enableRemove(e) {
    Ti.API.info('ENABLE.REMOVE', e);
}




function init(e) {
    Ti.API.info('INIT.CALLED', e);
    if (e.menu_id == 'menu_customizer') {
        $.add_label.applyProperties({ text: 'LOADING PROGRAM, PLEASE WAIT...' });
        loadProgram();

    }
}


function loadProgram() {


    // var wid = Ti.App.Properties.getString('my_workout');
    // var wurl = workout_final_url + wid;
    // var wurl = program_final_url + wid;
    var wurl = program_final_url;

    // Alloy.Globals.updateWorkout = 1;
    var updatedCall = Alloy.Globals.updateWorkout ? '?rn=' + getRandomInt(0, 999999999) : '';
    Ti.API.info('ATTEMPT.LOAD.PROGRAM', wurl);

    xhr.GET(wurl + args.programId + updatedCall, onSuccessProgram, onErrorProgramCallback, Alloy.Globals.XHROptions);
    Alloy.Globals.updateWorkout = 0;
}



function onErrorProgramCallback(e) {
    Ti.API.info(e.data);
}

function onSuccessProgram(e) {
    var wkt = Ti.App.Properties.getString('my_workout');
    $.add_label.applyProperties({ text: '' });
    var copied = e.data.acf.week[0];
    Ti.API.info('ROUND.DATA.NOT.CUSTOMIZER:');

    _.each(e.data.acf.week, function(item, index) {
        createRound(item, index);
    });

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
    // _.each($.program_btn_bar.labels, function(btn, index) {
    //     $.program_btn_bar.labels[index].cb();
    // })
}


$.dialog.addEventListener('click', function(e) {
    Ti.API.info('DIALOG.RETURNED:', e);
    if (e.index === 0) {
        // $.activity_wrapper.show();
        // $.activity_indicator.show();
        // send_updateCustomizer();

        // gatherCurrentSelection($.program_list_view);

        Alloy.Globals.updateWorkout = 0;
    }
});



function saveWorkout(e) {
    // preare POST request here...
    Ti.API.info('CUSTOMIZER.SAVE.WORKOUT');
    var review = [];
    var result = '';
    _.each($.program_list_view.sections, function(section, index) {
        var experRound = _.size(section.getItems());
        result
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



// =========================================

function generateRound(selection, roundIndex) {
    Ti.API.info('GENERATE.ROUND.WITH.CUSTOMIZER:', selection);
    // createRoundFromSelection(selection, roundIndex);
}


function createRound(week, weekIndex) {
    Ti.API.info('WORKOUTS.IN.WEEK: ', _.size(week.workouts), weekIndex);
    var roundData = [];

    _.each(week.workouts, function(workout, index) {
        // Ti.API.info('EXERCISE.DATA:', exercise.ID, exercise.post_title);

        var ob = {
        	// type:'remote',
            template: 'WeekItemTemplate',
            properties: {
                title: workout.post_title,
                searchableText: workout.post_title,
                launch_data: workout,
                exercise_index: index,

                wo_exercise_number: week.wo_exercise_number,
                wo_equipment: week.wo_equipment,
                wo_round_type: week.wo_round_type,

                // canMove: true,
                // canInsert: false,
                // canEdit: true,
                accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
            },
            header_info: {
                wo_exercise_number: week.wo_exercise_number,
                wo_equipment: week.wo_equipment,
                wo_round_type: week.wo_round_type,
            },
            // pic: { image: exercise.acf.video_featured.url },
            main: { text: workout.post_title },
            sub: { text: 'BEGIN' },
        }
        roundData.push(ob);
    });

    var round_title = 'Round.createRound ' + getIndex(weekIndex) + ': ';
    Ti.API.info('HEADER.TITLE.OUT', round_title);
    var hT = Alloy.createController('program/header', {
        htitle: round_title,
        round_index: weekIndex,
        onHeaderItemClick: onHeaderItemClick,

        wo_round_type: week.wo_round_type,
        wo_equipment: week.wo_equipment,
        wo_exercise_number: week.wo_exercise_number,

        roundOptions: roundOptions,
        optType: optType,
        optEquipment: optEquipment,

    }).getView();
    // hT.addEventListener('click',roundOptions);
    var roundSection = Ti.UI.createListSection({ headerView: hT });


    roundSection.setItems(roundData);



    $.program_list_view.appendSection(roundSection);
}




function onHeaderItemClick(e) {
    Ti.API.info('HEADER.ITEM.CLICK', e);
    // if (e.source.type == 'add') {
    //     Ti.API.info('TRIGGER.ADD.ROUND.HERE');
    // }
}



function launchExercise(e) {
    Ti.API.info('LAUNCHING.EXTERNAL.WINDOW.WITH:', e.url);
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
Ti.API.info('HANDLE.LIST.VIEW.CLICK.FROM.PROGRAMxxx', e);
    var sec = $.program_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    var workout = row.properties.launch_data;
    Ti.API.warn('WORKOUT.CLICK:', workout.ID);
    // Ti.API.info('ROW.DATA:', row.wo_exercise_number, row.wo_equipment, row.wo_round_type);
    // Ti.API.info('REPLACE.INTENT:', e, e.sectionIndex, e.itemIndex, e.source, row.properties.launch_data.ID);
    // last = {
    //     wo_exercise_number: row.wo_exercise_number,
    //     wo_equipment: row.wo_equipment,
    //     wo_round_type: row.wo_round_type,
    // };
    // // launchExercise({'url':exercise.acf.video.url, 'title':exercise.post_title});
    // // Animation.shake(row);
    // handlesCheck(e);


    // replaceExercise(e, 'replace');

	Ti.App.Properties.setString('my_workout', workout.ID);
	var wkt = Ti.App.Properties.getString('my_workout');

	Ti.App.fireEvent('cage/topbar/menu_button/close', {window_type:'modal'});
	
	Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts', 'workout_id':wkt});		


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
    var original_item = $.program_list_view.sections[older.sectionIndex].getItemAt(older.itemIndex);
    Ti.API.info('INSERT.REQUIREMENT:', original_item.properties.title);



    var roundData = [];

    var ob = {
    	// type:'local'
        template: 'WeekItemTemplate',
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
        $.program_list_view.sections[older.sectionIndex].insertItemsAt(older.itemIndex, roundData, { animated: true });
    } else if (mode == 'replace') {
        $.program_list_view.sections[older.sectionIndex].replaceItemsAt(older.itemIndex, 1, roundData, { animated: true });
    }
}



// selection:selection_ob,
// roundWin:$.roundWin,
// popover:$.popover_ob,

function replaceExercise(e, insert_mode) {
    // Ti.API.info('\n\nBUILD.QUERY');
    // var sec = $.program_list_view.sections[e.sectionIndex];
    // var row = sec.getItemAt(e.itemIndex);
    // Ti.API.info('ROW.DATA', row.properties);
    // var insert_popover = Alloy.createController('customizer/insert', {
    //     insertExercise: insertExercise,
    //     validate_mode: insert_mode,
    //     include: 'customizer/list',
    //     selection: {
    //         exercise_equipment: row.properties.wo_equipment.value,
    //         exercise_type: row.properties.wo_round_type.value,
    //         // rounds:row.properties.wo_exercise_number,
    //     },
    //     optType: optType,
    //     optEquipment: optEquipment,
    //     launch_data: row.properties.launch_data,
    //     customizerListItem: e,
    // }).getView();

    // insert_popover.show({ animated: true, view: $.pover_target });
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

        customizer_list_view: $.program_list_view,
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
        round_index: $.program_list_view.getSections().length,

        customizer_list_view: $.program_list_view
    }).getView();
    round_popover.show({ animated: true, view: $.pover_target });
}

// function createNewRoundBelow(e){
//     var round_popover = Alloy.createController('customizer/round', {validate:addNewRoundValidate} ).getView();
//     round_popover.show({animated:true, view:$.pover_target});
// }

function removeRound(roundIndex) {
    Ti.API.info('ATTEMPT.TO.REMOVE.ROUND:', roundIndex);
    $.program_list_view.deleteSectionAt(roundIndex);
    // updateCustomizerListHeaders();
}












function addNewRoundValidate(e, roundIndex) {
    Ti.API.info('ADD.ROUND.CALLBACK', e);
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
    $.program_list_view.canEdit = false;
    $.program_list_view.canInsert = true;
    $.program_list_view.setEditing(e.value);



}

$.program_list_view.addEventListener('insert', handleElementInsert)

function hideReplace(bol) {
    if (bol) {


        _.each($.program_list_view.sections, function(section, index) {

            var sec = $.program_list_view.sections[index];
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
    $.program_list_view.canInsert = false;
    $.program_list_view.canEdit = true;
    $.program_list_view.setEditing(e.value);

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
    // Ti.API.info('EDIT.REQUEST: ', e.status, e.data);
    // $.add_label.applyProperties({ text: 'LOADING WORKOUT...' });
    // Ti.API.info('SAVING.WORKOUT.PLEASE.WAIT', _.size($.program_list_view.sections));


    // loadProgram();

}


function send_updateCustomizer(selection_data) {

    // $.add_label.applyProperties({ text: 'SAVING WORKOUT...' });

    // _.each($.program_list_view.getSections(), function(section, index) {
    //     Ti.API.info('ATTEMPT TO REMOVE', section);
    //     $.program_list_view.deleteSectionAt(_.last($.program_list_view.getSections()));
    // });



    // xhr.POST('https://cagefitness.com/wp-json/app/v1/customize', JSON.stringify(selection_data), onSuccessCustomizerEdit, onErrorCustomizerEdit);


}



function optType(ttid) {
    return _.findWhere(config.acf.opt_type, { 'term_taxonomy_id': Number(ttid) });
}

function optEquipment(ttid) {
    return _.findWhere(config.acf.opt_equipment, { 'term_taxonomy_id': Number(ttid) });
}

function scrollToLast(e) {

	if($.program_list_view.getSections() > 0){
	    var sections = $.program_list_view.getSections();
	    var last_section_index = sections.length - 1;
	    var last_items = $.program_list_view.sections[last_section_index].getItems();
	    var last_item_index = last_items.length - 1;
	    $.program_list_view.scrollToItem(last_section_index, last_item_index, { animated: true });
    }
}

function gatherCurrentSelection(listview) {

    var sections = $.program_list_view.getSections();

    var sel = {
        filter: 'app',
        // build: 'auto',
        build: 'custom',
        update: 'true',
        rounds: _.map(listview.getSections(), function(round, sectionIndex) {

            var first = $.program_list_view.sections[sectionIndex].getItemAt(0);
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

