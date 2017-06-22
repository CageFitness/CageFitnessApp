// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sv = Alloy.Globals.scrollableView;
var cs = Alloy.Globals.currentSelectButton;





$.pover.addEventListener("itemclick", function(e){
	
    var section = $.pover.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    // Ti.API.info(JSON.stringify(args));
    Ti.API.info("THIS IS THE ITEM: "+JSON.stringify(item));


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

    // args.callback({'uno':'dos'});

    setTimeout(function(e){
    	$.popover_ob.hide();
    	Ti.API.info('ONLY ONCE...');
    },500);
   	// sv.scrollToView(sv.currentPage + 1);

});
