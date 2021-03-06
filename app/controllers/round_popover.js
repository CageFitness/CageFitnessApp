// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var sv = Alloy.Globals.scrollableView;
var cs = Alloy.Globals.currentSelectButton;


// Ti.API.info('ARGS.VIEW:',args.view);




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
    cs.title = item.properties.title;
    item.properties.cage_selected=true;
    args.validate({'rowIndex':args.row, 'slug':item.properties.slug, 'title':item.properties.title});
    setTimeout(function(e){
    	$.popover_ob.hide();
    },50);

});
