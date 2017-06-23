// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sv = Alloy.Globals.scrollableView;
var cs = Alloy.Globals.currentSelectButton;


// Ti.API.info('ARGS.VIEW:',args.view);




$.pover.addEventListener("itemclick", function(e){
	// THIS IS NOT THE RIGHT INDEX, THATS WHY ILL NEVER SEE ANYTHING BIGGER THAN 5
    var section = $.pover.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    // Ti.API.info(JSON.stringify(args));
    // Ti.API.info("THIS IS THE ITEM: "+JSON.stringify(item));


    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        item.properties.color = 'blue';
    }
    else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        item.properties.color = 'black';
    }
    section.updateItemAt(e.itemIndex, item);
    // Ti.API.info(item.selector.t)
    cs.title = item.properties.title;
    item.properties.cage_selected=true;


    // args.validate(item, e, args.row);
    args.validate({'rowIndex':args.row, 'slug':item.properties.slug, 'title':item.properties.title});

    setTimeout(function(e){
    	$.popover_ob.hide();
    	// Ti.API.info('ONLY ONCE...');
    },500);
   	// sv.scrollToView(sv.currentPage + 1);

});
