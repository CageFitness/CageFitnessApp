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


    var wurl = program_final_url;

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



$.dialog.addEventListener('click', function(e) {
    Ti.API.info('DIALOG.RETURNED:', e);
    if (e.index === 0) {
        Alloy.Globals.updateWorkout = 0;
    }
});






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

        // roundOptions: roundOptions,
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
var last = {};

function handleListViewClick(e) {
Ti.API.info('HANDLE.LIST.VIEW.CLICK.FROM.PROGRAMxxx', e);
    var sec = $.program_list_view.sections[e.sectionIndex];
    var row = sec.getItemAt(e.itemIndex);
    var workout = row.properties.launch_data;
    Ti.API.warn('WORKOUT.CLICK:', workout.ID);

	Ti.App.Properties.setString('my_workout', workout.ID);

	var wkt = Ti.App.Properties.getString('my_workout');

	Ti.App.fireEvent('cage/topbar/menu_button/close', {window_type:'modal'});

	Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts', 'workout_id':wkt});		


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



