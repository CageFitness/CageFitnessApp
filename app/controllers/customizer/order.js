var args = $.args;

Ti.API.info("LIST.VIEW.AVAILABLE.REORDER:",args.customizer_list_view, $.pover);





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
    Ti.API.info("SELECTIONS.REORDER:",args.selection);

    args.validate(args.selection);
    
    // args.exerciseWindow(args.selection);
    // popver.hide();
});


function finishOrderSelection(){
	Ti.API.info('LAST.STEP.FINISHED');
	args.validate(args.selection);
	args.popover.hide();
}
