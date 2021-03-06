// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var round_index = args.round_index;

var optType = args.optType;
var optEquipment = args.optEquipment;
var createRoundFromSelection = args.createRoundFromSelection;

$.popover_ob.contentView.height=Ti.UI.FILL;


function typeWindow(selection_ob) {
    var typeWin = Alloy.createController('customizer/type', {
    	validate:args.validate,
    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,
    	selection:selection_ob,
    	equipmentWindow:equipmentWindow,
    	roundWin:$.roundWin,
    	}).getView();
    $.navWin.openWindow(typeWin);
}


function equipmentWindow(selection_ob) {
    var equipmentWin = Alloy.createController('customizer/equipment', {
    	validate:args.validate,
    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,
     	selection:selection_ob,
     	exerciseWindow:exerciseWindow,
     	roundWin:$.roundWin,
     }).getView();
    $.navWin.openWindow(equipmentWin);
}


// function roundOptionsWindow(selection_ob) {
//     var roundOptionsWin = Alloy.createController('customizer/round_options', {
//     	validate:args.validate,
//     	createRoundFromSelection:args.createRoundFromSelection,
//     	round_index:round_index,
//     	selection:selection_ob,
//     	roundWin:$.roundWin,
//     	popover:$.popover_ob,
//     	}).getView();
//     $.navWin.openWindow(roundOptionsWin);
// }

function numExercisesWindow(selection_ob) {
    var numExercisesWin = Alloy.createController('customizer/number', {
    	validate:args.validate,
    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,
    	selection:selection_ob,
    	typeWindow:typeWindow,
    	// createRoundFromSelection:args.createRoundFromSelection,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	}).getView();
    $.navWin.openWindow(numExercisesWin);
}
function exerciseWindow(selection_ob) {
    var exercisesWin = Alloy.createController('customizer/list', {
    	validate:args.validate,
    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,
    	selection:selection_ob,
    	round_index:round_index,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	}).getView();
    $.navWin.openWindow(exercisesWin);
}

// function orderWindow(selection_ob) {
//     var orderWindow = Alloy.createController('customizer/order', {
//     	validate:args.validate,
//     	selection:selection_ob,
//     	roundWin:$.roundWin,
//     	popover:$.popover_ob,
//     	customizer_list_view:args.customizer_list_view,
//     	}).getView();
//     $.navWin.openWindow(orderWindow);
// }

function generateRound(exercises){
	Ti.API.info('GENERATE.ROUND.HERE',exercises);

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

    // args.validate({'rounds':5, 'type':'warm-up', 'equipment':'bands'});
    // args.validate(ob);
    if(item.properties.slug=='add'){
    	Ti.API.info('ADDING.ROUND.FROM.ROUND.OPTIONS.REMOVE.CLICK:');
	    var ob = {};
	    ob.add=true;

	    // args.createRoundFromSelection(ob);

    	numExercisesWindow(ob);
    }
    else if(item.properties.slug=='remove'){
    	Ti.API.info('REMOVING.ROUND.FROM.ROUND.OPTIONS.REMOVE.CLICK.WITH.ROUND.INDEX:',round_index);
    	// args.removeRound(args.roundIndex);
    	args.removeRound(round_index);
	    setTimeout(function(e){
	    	$.popover_ob.hide();
	    },100);

    }






});
