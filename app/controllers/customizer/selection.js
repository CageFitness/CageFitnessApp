// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.popover_ob.contentView.height=Ti.UI.FILL;
function equipmentWindow(selection_ob) {
    var equipmentWin = Alloy.createController('customizer/equipment', {
    	validate:args.validate,
     	selection:selection_ob,
     	exerciseWindow:exerciseWindow,
     	roundWin:$.roundWin,
     }).getView();
    $.navWin.openWindow(equipmentWin);
}

function typeWindow(selection_ob) {
    var typeWin = Alloy.createController('customizer/type', {
    	validate:args.validate,
    	selection:selection_ob,
    	equipmentWindow:equipmentWindow,
    	}).getView();
    $.navWin.openWindow(typeWin);
}

function exerciseWindow(selection_ob) {
    var exercisesWin = Alloy.createController('customizer/list', {
    	validate:args.validate,
    	selection:selection_ob,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	}).getView();
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
    ob.rounds=item.properties.slug;
    args.validate(ob);
    // args.validate({'rounds':5, 'type':'warm-up', 'equipment':'bands'});
    // args.validate(ob);
    typeWindow(ob);

    // setTimeout(function(e){
    // 	$.popover_ob.hide();

    // },500);


});
