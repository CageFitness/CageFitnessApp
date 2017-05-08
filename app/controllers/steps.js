// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;

// var videos = [
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v1", video: "CF-App-MedicineBall-SquatCleanWithPressAlternating.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v2", video: "CF-App-MedicineBall-MuffinBusters.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v3", video: "CF-App-MedicineBall-FourPointWoodChoppers.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v4", video: "CF-App-MedicineBall-SidewayKnockoutsAlternating.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v5", video: "CF-App-MedicineBall-SquatAndPressWith90DegreeHop.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v6", video: "CF-App-MedicineBall-AlternatingLungeWithPosteriorReach.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v7", video: "CF-App-3PointJumpSquatsAlternatingSides.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v8", video: "CF-App-3PointSquatsAlternatingSides.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v9", video: "CF-App-SumoSquats.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v10", video: "CF-App-SprinterLungesAlternatingSides.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v11", video: "CF-App-ForwardAndReverseLungesAlternatingSides.mp4" },
//     {label:"TestLabelHere", description:"DescriptionHere", id: "v12", video: "CF-App-MultiPlantarLunges.mp4" }
// ];





$.list1.addEventListener('itemclick', function(e){
    var section = $.list1.sections[e.sectionIndex];
    clickAndFollow(section,e);
});

// $.listview_step3.addEventListener('itemclick', function(e){
//     // var section = $.listview_step3.sections[e.sectionIndex];
//     // clickAndFollow(section,e);
// });

$.listview_step4.addEventListener('itemclick', function(e){

    var section = $.listview_step4.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);

    // Ti.API.info(JSON.stringify(item));
    // section.updateItemAt(e.itemIndex, item);
    // getNext();

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
    
    Ti.API.info(e.source.args);

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
    // 	stopCounter();
    // 	Ti.API.info('Call Next');
    // }
    // else{
    // 	Ti.API.info(myCount);
    // 	$.prog.setValue(myCount--);
    // 	$.step_8_title_right.text = '00:'+myCount--;
    // }
}

function getNext(){
    $.scrollableView.scrollToView($.scrollableView.currentPage + 1);
}
function stepClick(e) {
    // alert($.step3_5_btn.title);
    Ti.API.info('THISPAGE: ' + $.scrollableView.currentPage);
    getNext();

}


function doWorkout(e) {
    Ti.API.info('TESTING...');
    var win2 = Alloy.createController('workout').getView();
    win2.open({
        transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
   });
}

function openRoundPopover() {
    var round_popover = Alloy.createController('round_popover').getView();
    round_popover.show({view:$.step3_btn});
    Ti.API.info('Round PopOver Openend');
};

function itemClickBuildWorkout(e){
    Ti.API.info('TESTING...');
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


// $.prog.setValue(0);
// decrease();
Ti.API.info('TESTING...');
$.steps.open();

Alloy.Globals.parent = $.index;
Alloy.Globals.scrollableView = $.scrollableView;
// Alloy.createController('dialog', args).getView().open();
// stepClickHandler();
// $.scrollableView.scrollToView(5);

