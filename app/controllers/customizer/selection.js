// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var exercise_selection=[];
var customizer_list_view = args.customizer_list_view;
// var round_index = _.last(customizer_list_view.sections);
var round_index = args.round_index;

var optType = args.optType;
var optEquipment = args.optEquipment;
var createRoundFromSelection = args.createRoundFromSelection;


$.popover_ob.contentView.height=Ti.UI.FILL;


function typeWindow(selection_ob) {
    var typeWin = Alloy.createController('customizer/type', {

    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,

    	validate:args.validate,
    	selection:selection_ob,
    	equipmentWindow:equipmentWindow,
    	roundWin:$.roundWin,
    	}).getView();
    $.navWin.openWindow(typeWin);
}


function equipmentWindow(selection_ob) {
    var equipmentWin = Alloy.createController('customizer/equipment', {

    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,

    	validate:args.validate,
     	selection:selection_ob,
     	exerciseWindow:exerciseWindow,
     	roundWin:$.roundWin,
     }).getView();
    $.navWin.openWindow(equipmentWin);
}


function roundOptionsWindow(selection_ob) {
    var roundOptionsWin = Alloy.createController('customizer/round_options', {

    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,

    	validate:args.validate,
    	selection:selection_ob,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	}).getView();
    $.navWin.openWindow(roundOptionsWin);
}

function numExercisesWindow(selection_ob) {
    var numExercisesWin = Alloy.createController('customizer/number', {

    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,

    	validate:args.validate,
    	selection:selection_ob,
    	orderWindow:orderWindow,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	}).getView();
    $.navWin.openWindow(numExercisesWin);
}
function exerciseWindow(selection_ob) {
    var exercisesWin = Alloy.createController('customizer/list', {

    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,

    	validate:args.validate,
    	selection:selection_ob,
    	orderWindow:orderWindow,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	}).getView();
    $.navWin.openWindow(exercisesWin);
}

function orderWindow(selection_ob) {
    var orderWindow = Alloy.createController('customizer/order', {

    	createRoundFromSelection:args.createRoundFromSelection,
		optType:args.optType,
		optEquipment:args.optEquipment,    	
    	round_index:round_index,

    	validate:args.validate,
    	selection:selection_ob,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	customizer_list_view:args.customizer_list_view,
    	}).getView();
    $.navWin.openWindow(orderWindow);
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

    // exercise_selection.push(item.info.data);
    // Ti.API.info('HOW.MANY?', _.size(exercise_selection) );

    // args.validate(ob,round_index);
    // args.validate({'rounds':5, 'type':'warm-up', 'equipment':'bands'});
    args.validate(ob);
    typeWindow(ob);

    // setTimeout(function(e){
    // 	$.popover_ob.hide();

    // },500);


});
