var args = $.args;
var sdata;
var flashDelay = 0;
var numberSelection = null;

Animation.fadeOut($.step_line, 0);


function LogSDATA() {
    Ti.API.info('SELECTION.DATA: ', JSON.stringify(sdata));
}

function updateStep_REVIEW(row) {
    var sec = $.listview_step7.sections[0];
    var item = sec.getItemAt(row.rowIndex);

    Ti.API.info('DATA.UPDATE.REVIEW:', item, row.value);
    item.sub.value = row.value;
    item.properties.height = Ti.UI.SIZE;
    sec.updateItemAt(row.rowIndex, item);

}

function updateStep_UPDATE(row) {
    Ti.API.info('DATA.UPDATE.UPDATE:', row);
    sdata.update = true;
}

function updateStep_BUILD(row, mode) {
    Ti.API.info('DATA.UPDATE.BUILD:', row, mode);
    sdata.build = 'auto';
}

function updateStep_EQUIPMENT(row) {
    Ti.API.info('DATA.UPDATE.EQUIPMENT', row.rowIndex);
    // _.each(sdata.rounds, function(prop){
    // 	prop.equipment = row.slug;
    // });
    // updateStep_REVIEW({rowIndex:3,value:row.title});
    // LogSDATA();


    sdata.rounds[row.rowIndex].equipment = row.slug;
    var res = _.map(sdata.rounds, function(prop) { return prop.equipment });
    updateStep_REVIEW({ rowIndex: 3, value: res.join(', ') });
    LogSDATA();

}

function updateStep_EXERCISES(row) {
    Ti.API.info('DATA.UPDATE.EXERCISES');
    sdata.rounds[row.rowIndex].numexercises = row.numexercises;
    var res = _.map(sdata.rounds, function(prop) { return 'Round ' + prop.round + ': ' + prop.numexercises; });
    updateStep_REVIEW({ rowIndex: 2, value: res.join(', ') });
    LogSDATA();
}

function updateStep_TYPE(row) {
    Ti.API.info('DATA.UPDATE.TYPE');
    sdata.rounds[row.rowIndex].roundType = row.slug;
    sdata.rounds[row.rowIndex].roundTitle = row.title;
    var res = _.map(sdata.rounds, function(prop) { return prop.roundTitle });
    updateStep_REVIEW({ rowIndex: 1, value: res.join(', ') });
    LogSDATA();

}


function updateStep_ROUND(nrounds) {
    Ti.API.info('DATA.UPDATE.ROUND');
    var r = [];
    for (var i = 0; i < nrounds; i++) {
        var ob = {};
        ob.round = getIndex(i);
        r.push(ob);
    }
    sdata.rounds = r;
    updateStep_REVIEW({ rowIndex: 0, value: _.size(sdata.rounds) + ' Rounds' });
    LogSDATA();
}

function handleNewWorkoutPopover(e) {
    // Alloy.Globals.currentSelectButton = e.source;
    // Ti.API.info(e.itemIndex)
    Ti.API.info('BEFORE.POPOVER');
    var new_workout_popover = Alloy.createController('builder/create', { follow: doWorkout, data: sdata, row: e.itemIndex }).getView();
    Ti.API.info('AFTER.POPOVER');
    new_workout_popover.show({ animated: true, view: $.step7_btn });

}

function handleClickPopOver(e) {
    Alloy.Globals.currentSelectButton = e.source;
    // Ti.API.info(e.itemIndex)
    var round_popover = Alloy.createController('round_popover', { validate: updateStep_TYPE, row: e.itemIndex }).getView();
    round_popover.show({ animated: true, view: e.source });
}

function initSelectionData() {

    sdata = {
        build: 'auto',
        update: 'true',
        rounds: [],
    };
    Ti.API.info('CLEARING.SELECTION.DATA:', sdata);

}

function getIndex(n) {
    r = Number(n) + 1;
    return r;
}


function onSuccessCustomizer(e) {
    var beginlabel = sdata.build == 'auto' ? 'CREATE WORKOUT...' : 'CUSTOMIZE!';

    $.step7_btn.setTitle(beginlabel);


    Ti.API.warn('ON.SUCCESS.CUSTOMIZER.SET.WY_WORKOUT', e, e.workout_modified, e.status);
    var data = JSON.parse(e.data);
    var workout_modified = data.workout_modified;
    Ti.API.warn('WORKOUT.MODIFIED:', workout_modified, '\n\n\n\n');
    if (workout_modified > 0) {
        Ti.App.Properties.setString('my_workout', workout_modified);
    }
    // var newID = Number(_data.workout_modified);
    // if(newID > 0){
    // 	Ti.App.Properties.setString('my_workout',newID);
    // 	Ti.API.info('DEFAULT.WORKOUT.CHANGED.TO:', Ti.App.properties.getString('my_workout'));
    // }

    var wkt = Ti.App.Properties.getString('my_workout');
    if (sdata.build == 'auto') {
        Ti.App.fireEvent('cage/launch/window', { key: 'menu_workouts', workout_id: wkt });
    } else {
        Ti.App.fireEvent('cage/launch/customizer', { menu_id: 'menu_customizer' });
    }
    Ti.App.fireEvent('cage/profile/reload');

    Ti.API.info('SUCCESS.CUSTOMIZER: ', e);

}

function onErrorCustomizer(e) {
    Ti.API.info('ERROR: ', e);
}

function sendData(mode) {

    // var rounds = [
    // {
    // 	'roundType':'warm-up',
    // 	'roundTypeName':'warm-up',
    // 	'numexercises':5,
    // 	'equipment':'body-weight',
    // 	'round':1,
    // },
    // {
    // 	'roundType':'warm-up',
    // 	'roundTypeName':'warm-up',
    // 	'numexercises':7,
    // 	'equipment':'body-weight',
    // 	'round':2,
    // },
    // {
    // 	'roundType':'warm-up',
    // 	'roundTypeName':'warm-up',
    // 	'numexercises':10,
    // 	'equipment':'body-weight',
    // 	'round':3,
    // },			
    // ];

    // var token = Ti.App.Properties.getString('user_token');
    // var data = {};
    // data.filter = 'red';
    // data.build = 'auto';
    // data.update = 'true';
    // data.rounds = rounds;

    sdata.filter = 'red';
    finalData = JSON.stringify(sdata);

    Ti.API.info('AUTO.GENERATE.WORKOUT.MODE:', mode);
    Ti.API.info('AUTO.GENERATE.WORKOUT.WITH:', finalData);
    // Ti.API.info('DOS', token);

    var urlx = Alloy.CFG.api_url + Alloy.CFG.workout_create_update;
    Ti.API.info('URL:', urlx);

    xhr.POST('https://cagefitness.com/wp-json/app/v1/my-workout', finalData, onSuccessCustomizer, onErrorCustomizer);
    Alloy.Globals.updateWorkout = 1;

}






// =========================================




// $.button_matrix.backgroundColor='red';
$.button_matrix.addEventListener('click', function(e) {

    if (e.source._type == 'btn') {
        // sections = [];
        // $.listview_step3.deleteSectionAt(0,{animated:false});
        // var roundTypeSection = Ti.UI.createListSection();
        // sections.push(roundTypeSection);
        // $.listview_step3.sections = sections;

        _.each(e.source.getParent().children, function(el) {
            // Ti.API.info('BUTTON.MATRIX:',el);
            el.backgroundColor = '#fff';
            el.color = '#9b9b9b';
            el.borderColor = '#b4b4b4';
        })
        e.source.backgroundColor = '#c4cb48';
        e.source.color = '#fff';
        e.source.borderColor = '#000';

        var num = Number(e.source.title);
        updateStep_ROUND(num);

        setRoundTypeItems(Number(num));
        setNumberOfExerciseItems(Number(num));
        setEquipmentItems(Number(num));
        stepClick(e);
    }
});


function createRoundTypeRows(round_number) {
    var items = [];
    for (var i = 0; i < round_number; i++) {

        var ob = {
            properties: {
                top: 0,
                bottom: 0,
                height: 65,
                selectionStyle: Titanium.UI.iOS.ListViewCellSelectionStyle.NONE,
                autoStyle: true,
                row_index: getIndex(i),
                // height:Ti.UI.SIZE,
            },
            info: { text: "Round " + getIndex(i) },
        }
        items.push(ob);
    }

    return items;

}



function createNumberOfExercisesRows(round_number) {

    var config = JSON.parse(Ti.App.Properties.getString('config'));
    Ti.API.info('CREATIG.NUMBER.EXERCISES:');
    // Ti.API.info('ROUND.CONFIGS:',config.acf.round_configs);



    var numbers = config.acf.round_configs;
    var items = [];
    for (var i = 0; i < round_number; i++) {

        var ob = {
            // template: 'numberOfExercises',
            properties: {
                top: 0,
                bottom: 0,
                height: 65,
                autoStyle: true,
                row_index: getIndex(i),
                selectionStyle: Titanium.UI.iOS.ListViewCellSelectionStyle.NONE,
            },
            info: { text: "Round " + getIndex(i) },
        }

        items.push(ob);
    }

    return items;

}




/**
 * The scoped constructor of the controller.
 **/
(function constructor() {


    // init_class_builder();

})();

Ti.App.addEventListener('cage/class_builder/init', init_class_builder);

function init_class_builder(e) {
    Ti.API.info('INITIALIZE.WITH:', e);

    initSelectionData();
    $.scrollableView.scrollToView(0);
    Animation.shake($.fakeButton, 400);

    var config = JSON.parse(Ti.App.Properties.getString('config'));
    Ti.API.info('CONFIGURATION:', config.acf.opt_rounds);
    // setRoundTypeItems(config.acf.opt_rounds);
    // setNumberOfExerciseItems(config.acf.opt_rounds);	
    setRoundTypeItems(0);
    setNumberOfExerciseItems(0);
    setEquipmentItems(0);
};

function setEquipmentItems(ritems) {
    var items = createEquipmeItemsRows(ritems);
    var sec = $.listview_step5.sections[0];
    sec.deleteItemsAt(0, _.size(sec.items), { animated: true });
    sec.setItems(items);
};

function setNumberOfExerciseItems(ritems) {
    var items = createNumberOfExercisesRows(ritems);
    var sec = $.listview_step4.sections[0];
    sec.deleteItemsAt(0, _.size(sec.items), { animated: true });
    sec.setItems(items);
};



function setRoundTypeItems(nitems) {
    var items = createRoundTypeRows(nitems);
    var sec = $.listview_step3.sections[0];
    sec.deleteItemsAt(0, _.size(sec.items), { animated: true });
    sec.setItems(items);
};



$.listview_step3.addEventListener('itemclick', function(e) {

    // Ti.API.info('LIST.3: ',e);
    // var row = $.listview_step3.sections[0].getItemAt(e.itemIndex);
    // Ti.API.info('LIST.3.ROW: ',row.selector);
    // LITHIUMLAB
    var section = $.listview_step3.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    section.updateItemAt(e.itemIndex, item);

});



function updateStepItem(parent, page) {
    var item = parent.children[page];
    item.applyProperties({ backgroundColor: '#fff', color: '#000', borderWidth: 4, borderColor: '#d9e153' });
    Animation.shake(item, flashDelay);
}

function updateSteps(page) {

    var par = $.step_track;

    for (istep in $.step_track.children) {

        var item = par.children[istep];
        item.setBackgroundColor('#d9e153');
        item.children[0].setColor('#7b7b3e');

    }

    if (page == 0) {
        Animation.fadeOut($.step_line, 100);
    }

    if (page == 1) {
        updateStepItem(par, 0);
    }
    if (page == 2) {
        updateStepItem(par, 1);
    }
    if (page == 3) {
        updateStepItem(par, 2);
    }
    if (page == 4) {
        updateStepItem(par, 3);
    }
    if (page == 5) {
        updateStepItem(par, 4);
    }
    if (page == 6) {
        updateStepItem(par, 5);
    }
    if (page == 7) {
        updateStepItem(par, 6);
    }


}

$.scrollableView.addEventListener('scrollend', function(e) {
    updateSteps(e.currentPage)
});

$.scrollableView.addEventListener('dragstart', function(e) {
    Ti.App.fireEvent('cage/class_builder/dragstart', { 'hello': 'world' });
    Ti.API.info('DRAGSTART:', e);
});

// SHOULB BE SCROLLSTART!!!!
// $.listview_step4.addEventListener('itemclick', function(e){



// });

// $.listview_step5.addEventListener('itemclick', function(e){
//     var section = $.listview_step5.sections[e.sectionIndex];
//     var item = section.getItemAt(e.itemIndex);
//     updateStep_EQUIPMENT({'rowIndex':e.itemIndex, 'slug':item.properties.slug, 'title':item.info.text});
//     clickAndFollow(section,e);
// });



function createEquipmeItemsRows(round_number) {

    var config = JSON.parse(Ti.App.Properties.getString('config'));
    Ti.API.info('CREATIG.EQUIPMENT.ROWS:');
    // Ti.API.info('ROUND.CONFIGS:',config.acf.round_configs);



    var numbers = config.acf.round_configs;
    var items = [];
    for (var i = 0; i < round_number; i++) {

        var ob = {
            // template: 'numberOfExercises',
            properties: {
                top: 0,
                bottom: 0,
                height: 65,
                autoStyle: true,
                row_index: getIndex(i),
                selectionStyle: Titanium.UI.iOS.ListViewCellSelectionStyle.NONE,
            },
            info: { text: "Round " + getIndex(i) },
            info_subtitle: { text: " " },
        }

        items.push(ob);
    }

    return items;

}



function handleEquipmentSelection(e) {
    Ti.API.info('GROUP.BUTTON.ITEM.CLICK: ', e.itemIndex, e.source.selectorValue);
    var section = $.listview_step5.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    // item.properties.slug = e.source.selectorValue;
    // item.info_subtitle.text = e.source.slug_title;
    item.properties.slug = e.source.slug;
    Ti.API.info('EQUIPMENT.ITEM.PROPERTIES:', item.properties)
    item = {
        template: 'equipmentItem',
        properties: { title: '', top: 0, bottom: 0, height: 65, autoStyle: true, rowIndex: getIndex(e.itemIndex) },
        info: { text: item.info.text },
        info_subtitle: { text: e.source.slug_title },
        select5: { backgroundColor: '#fff' },
        select7: { backgroundColor: '#fff' },
        select10: { backgroundColor: '#fff' },
        select15: { backgroundColor: '#fff' },
    }

    item['select' + e.source.selectorValue].backgroundColor = '#d9e153';
    section.updateItemAt(e.itemIndex, item);
    Ti.API.info('ON.ITEM.EVENT:', e.source.id, e.source.selectorValue);
    // updateStep_EQUIPMENT({'rowIndex':e.itemIndex, 'slug':e.source.selectorValue, 'title':item.info_subtitle.text});
    updateStep_EQUIPMENT({ 'rowIndex': e.itemIndex, 'slug': e.source.slug, 'title': item.info_subtitle.text });
}

function handleNumberExercisesSelection(e) {
    Ti.API.info('GROUP.BUTTON.ITEM.CLICK: ', e.itemIndex, e.source.selectorValue);
    var section = $.listview_step4.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    item = {
        template: 'numberOfExercises',
        properties: { title: '', top: 0, bottom: 0, height: 65, autoStyle: true, rowIndex: getIndex(e.itemIndex) },
        info: { text: item.info.text },
        select5: { backgroundColor: '#fff' },
        select7: { backgroundColor: '#fff' },
        select10: { backgroundColor: '#fff' },
    }

    item['select' + e.source.selectorValue].backgroundColor = '#d9e153';
    section.updateItemAt(e.itemIndex, item);
    Ti.API.info('ON.ITEM.EVENT:', e.source.id, e.source.selectorValue);
    updateStep_EXERCISES({ 'rowIndex': e.itemIndex, 'numexercises': e.source.selectorValue });
}




$.listview_step6.addEventListener('itemclick', function(e) {
    Ti.API.info('CLASS.BUILDER.CUSTOMIZER:', e);
    // XXXX
    if (e.itemIndex === 1) {
        sdata.build = 'custom';
        $.step7_btn.setTitle('CUSTOMIZE!');
    } else {
        sdata.build = 'auto';
        $.step7_btn.setTitle('CREATE WORKOUT!');
    }
    setTimeout(function() {
        Animation.popIn($.step7_btn);
    }, 1000);


    var section = $.listview_step6.sections[e.sectionIndex];
    clickAndFollow(section, e);
});

function clickAndFollow(section, e) {
    var item = section.getItemAt(e.itemIndex);
    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        item.properties.color = '#000';
    } else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        item.properties.color = 'black';
    }
    section.updateItemAt(e.itemIndex, item);
    getNext();
}



function stepClickHandler(e) {

    Ti.API.info('HANDLE.STEPS:', e.source.args);

    var item, view
    for (item in $.step_track.children) {
        view = $.step_track.children[item];

    }

}

function nextStep() {


}

function playNextVideo() {
    Ti.API.info('play next video...');
    // $.videoPlayer1.play();
}

function stopCounter() {
    playNextVideo();
    clearTimeout(myTimer);

}



function getNext() {
    $.scrollableView.scrollToView($.scrollableView.currentPage + 1);
    Animation.fadeIn($.step_line, 100);
}

function stepClick(e) {
    Ti.API.info('THISPAGE: ' + $.scrollableView.currentPage);
    getNext();
}


function doProgress(e) {
    // sendData();
    Ti.App.fireEvent('cage/launch/customizer', { menu_id: 'menu_customizer' });
}


function showWorkoutDialog() {
    $.dialog_workout.show();
}



$.dialog_workout.addEventListener('click', function(e) {
    Ti.API.info('DIALOG.RETURNED:', e);
    if (e.index === 0) {
        Ti.API.info('CREATE.NEW');
        sdata.update = false.toString();
        sdata.create = true.toString();
        // sdata.title = 'My Awesome Workout!';
        handleNewWorkoutPopover(e);
        // doWorkout();
    } else if (e.index === 1) {
        sdata.update = true.toString();
        sdata.create = false.toString();
        doWorkout();
    } else {
        Ti.API.info('CANCELS');
    }
});


function doWorkout(e) {
    // var wkt = Ti.App.Properties.getString('my_workout');
    // Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts', workout_id:wkt });
    Animation.popIn($.step7_btn);
    $.step7_btn.setTitle('LOADING...');
    sendData(sdata.build);
}

function itemClickBuildWorkout(e) {
    // Ti.API.info('TESTING...');
}

function handleClickWorkoutTheme(e) {
    Ti.API.info('working?');
}

function handleClickSelectEquipment(e) {
    Ti.API.info('SELECT EQUIPMENT...');
}


function handleClickBeginWorkout(e) {
    Ti.API.info('CREATE WORKOUT...');
}


function handleClickBuildWorkout(e) {
    Ti.API.info('BUILD.TYPE:', e);
    // Ti.App.fireEvent('cage/drawer/itemclick',{menu_id:'menu_customizer'});
    var section = $.listview_step6.sections[e.sectionIndex];
    clickAndFollow(section, e);

}

function handleClickNumberOfExercises(e) {
    var section = $.pover.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    Ti.API.info('SELECTOR:', item, item.selectorRight, item.selectorCenter, item.selectorLeft);

    item.selectorRight.backgroundColor = "#ffffff";
    item.selectorCenter.backgroundColor = "#ffffff";
    item.selectorLeft.backgroundColor = "#ffffff";

    e.source.backgroundColor = "#d9e153";

    section.updateItemAt(e.itemIndex, item);
}

function stepLineClick() {
    Ti.API.info('clicked...');
}

Alloy.Globals.parent = $.mainView;
Alloy.Globals.scrollableView = $.scrollableView;

$.scrollableView.scrollToView(0);