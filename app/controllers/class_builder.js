

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;




// =========================================





// $.button_matrix.backgroundColor='red';
$.button_matrix.addEventListener('click', function(e){

	if(e.source._type=='btn'){
		activateRoundTypeRows(Number(e.source.title));
	}
});



function activateRoundTypeRows(n){

}

function createRoundTypeRows(round_number){
	var items = [];
	for (var i = 0; i < round_number; i++) {
		
		var ob = {
			info: {text: "Round "+Utils.getIndex(i)},
	    }
	    items.push(ob);		
	}

	return items;

}





/**
 * The scoped constructor of the controller.
 **/
(function constructor() {

    var config = JSON.parse( Ti.App.Properties.getString('config') );
    Ti.API.info('CONFIGURATION:',config.acf.opt_rounds);
    var roundItems = createRoundTypeRows(config.acf.opt_rounds);
    // $.listview_step3.sections[0].setItems(roundItems);

})();





var flashDelay = 0;

Animation.fadeOut($.step_line,0);


function updateStepItem(parent,page){

    var item = parent.children[page];

    item.backgroundColor='#white';
    // Ti.API.info(item.children[0]);
    item.children[0].color="#000";

    Animation.shake(item,flashDelay);


}

function updateSteps(page){
    
    var par = $.step_track;

    for(istep in $.step_track.children){
        // Ti.API.info('ONUPDATESTEPS:' );
        // Ti.API.info('ONUPDATESTEPS:', JSON.stringify(par.children[istep]) );

        var item = par.children[istep];
        item.backgroundColor="#d9e153";
        item.children[0].color = "#7b7b3e";

    }

    if (page == 0 ) {
      Animation.fadeOut($.step_line,100);
    }

    if (page == 1) {
        updateStepItem(par,0);
    }
    if (page == 2) {
        updateStepItem(par,1);
    }
    if (page == 3) {
        updateStepItem(par,2);
    }
    if (page == 4) {
        updateStepItem(par,3);
    }
    if (page == 5) {
        updateStepItem(par,4);
    }
    if (page == 6) {
        updateStepItem(par,5);
    }
    if (page == 7) {
        updateStepItem(par,6);
    }
    // if (page == 8) {
    //    updateStepItem(par,7);
    // }

}

// $.login_box.addEventListener('click',function(e){

// })
$.scrollableView.addEventListener('scrollend',function(e){
    updateSteps(e.currentPage)
});

$.scrollableView.addEventListener('dragstart',function(e){
    Ti.App.fireEvent('cage/class_builder/dragstart',{'hello':'world'});
    Ti.API.info('DRAGSTART:', e);
});



$.listview_step4.addEventListener('itemclick', function(e){

    var section = $.listview_step4.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);

});

function ToggleMe(e){


    e.source.getParent().children[0].backgroundColor = "#ffffff";
    e.source.getParent().children[2].backgroundColor = "#ffffff";
    e.source.backgroundColor="#d9e153"

}

$.listview_step5.addEventListener('itemclick', function(e){
    var section = $.listview_step5.sections[e.sectionIndex];
    clickAndFollow(section,e);
});

$.listview_step6.addEventListener('itemclick', function(e){
    var section = $.listview_step6.sections[e.sectionIndex];
    clickAndFollow(section,e);
});

function clickAndFollow(section,e){
    var item = section.getItemAt(e.itemIndex);
    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        item.properties.color = 'black';
    }
    else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        item.properties.color = 'black';
    }
    section.updateItemAt(e.itemIndex, item);
    getNext();
}

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
myTimer = setTimeout(decrease, 1000);
var myCount = 30;

function stepClickHandler(e){
    
    Ti.API.info('HANDLE.STEPS:',e.source.args);

    var item, view
    for (item in $.step_track.children) {
        view = $.step_track.children[item];

    }

}

function nextStep(){


}

function playNextVideo() {
    Ti.API.info('play next video...');
    // $.videoPlayer1.play();
}

function stopCounter() {
    playNextVideo();
    clearTimeout(myTimer);

}

function decrease() {

    // if(myCount<1){
    //  stopCounter();
    //  Ti.API.info('Call Next');
    // }
    // else{
    //  Ti.API.info(myCount);
    //  $.prog.setValue(myCount--);
    //  $.step_8_title_right.text = '00:'+myCount--;
    // }
}

function getNext(){
    $.scrollableView.scrollToView($.scrollableView.currentPage + 1);
    Animation.fadeIn($.step_line,100);
}
function stepClick(e) {
    Ti.API.info('THISPAGE: ' + $.scrollableView.currentPage);
    getNext();
}


function doProgress(e) {
   var wkt = Ti.App.Properties.getString('my_workout');
   Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts', workout_id:wkt });
}

function doWorkout(e) {
   var wkt = Ti.App.Properties.getString('my_workout');
   Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts', workout_id:wkt });
}

function openRoundPopover() {
    var round_popover = Alloy.createController('round_popover').getView();
    round_popover.show({view:$.step3_btn});
    Ti.API.info('Round PopOver Openend');
};

function itemClickBuildWorkout(e){
    // Ti.API.info('TESTING...');
}

function handleClickWorkoutTheme (e) {
  Ti.API.info('working?');
}

function handleClickSelectEquipment (e) {
    Ti.API.info('SELECT EQUIPMENT...');
}


function handleClickBeginWorkout (e) {
     Ti.API.info('BEGIN WORKOUT...');
}


function handleClickBuildWorkout(e) {
     Ti.API.info('BUILD WORKOUT...');
}

function handleClickNumberOfExercises(e) {
    var section = $.pover.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    item.selectorRight.backgroundColor = "#ffffff";
    item.selectorLeft.backgroundColor = "#ffffff";
    e.source.backgroundColor = "#d9e153";

    section.updateItemAt(e.itemIndex, item);
}

function handleClickPopOver(e) {
    Alloy.Globals.currentSelectButton = e.source;
    var round_popover = Alloy.createController('round_popover').getView();
    round_popover.show({animated:true,view:e.source});
}


function stepLineClick(){
    Ti.API.info('clicked...');
}

// $.steps.open();

Alloy.Globals.parent = $.mainView;
Alloy.Globals.scrollableView = $.scrollableView;
// Alloy.createController('dialog', args).getView().open();
// stepClickHandler();
$.scrollableView.scrollToView(0);





