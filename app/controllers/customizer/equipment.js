// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var optType = args.optType;
var optEquipment = args.optEquipment;
var createRoundFromSelection = args.createRoundFromSelection;

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

   
    args.selection.exercise_equipment=item.properties.ttid;
    Ti.API.info("SELECTIONS:",args.selection);

    args.validate(args.selection);
    args.exerciseWindow(args.selection);



});