// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


// var win2 = Titanium.UI.createWindow({
//     backgroundColor: 'red',
//     title: 'Red Window'
// });

// var win1 = Titanium.UI.iOS.createNavigationWindow({
//    window: win2
// });

// var win3 = Titanium.UI.createWindow({
//     backgroundColor: 'blue',
//     title: 'Blue Window'
// });

// var button = Titanium.UI.createButton({
//     title: 'Open Blue Window'
// });
// button.addEventListener('click', function(){
//     win1.openWindow(win3, {animated:true});
// });

// win2.add(button);
// var button2 = Titanium.UI.createButton({
//     title: 'Close Blue Window'
// });
// button2.addEventListener('click', function(){
//     win1.closeWindow(win3, {animated:false}); //win3.close() will also work!!
// });

// win3.add(button2);
// win1.open();


function equipmentWindow(selection_ob) {
    var equipmentWin = Alloy.createController('customizer/equipment', {validate:args.validate, selection:selection_ob, exerciseWindow:exerciseWindow}).getView();
    $.navWin.openWindow(equipmentWin);
}

function typeWindow(selection_ob) {
    var typeWin = Alloy.createController('customizer/type', {validate:args.validate, selection:selection_ob, equipmentWindow:equipmentWindow}).getView();
    $.navWin.openWindow(typeWin);
}

function exerciseWindow(selection_ob) {
    var exercisesWin = Alloy.createController('customizer/list', {validate:args.validate, selection:selection_ob, equipmentWindow:equipmentWindow}).getView();
    $.navWin.openWindow(exercisesWin);
}


function generateRound(e){
	Ti.API.info('GENERATE.ROUND.HERE');

}

// $.roundWin.open();



$.pover.addEventListener("itemclick", function(e){
    var section = $.pover.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);

    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        item.properties.color = 'blue';
    }
    else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        item.properties.color = 'black';
    }
    section.updateItemAt(e.itemIndex, item);
    item.properties.cage_selected=true;
    var ob = {};
    ob.rounds=5;
    // args.validate({'rounds':5, 'type':'warm-up', 'equipment':'bands'});
    // args.validate(ob);
    typeWindow(ob);

    // setTimeout(function(e){
    // 	$.popover_ob.hide();

    // },500);


});
