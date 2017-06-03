// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function handleListViewClick(e){
    var item = $.help_list_view.sections[e.sectionIndex].getItemAt(e.itemIndex);
    Ti.API.info('URL:',item.url);
	Ti.App.fireEvent('cage/external/link',e);
}


var elementData = [
	{"name":"Hydrogen", url:"uno.com" },
	{"name":"Helium" },
	{"name":"Lithium" },
	{"name":"Beryllium" },
	{"name":"Boron"	},
	{"name":"Carbon" },
	{"name":"Nitrogen"}
];
var items = _.map(elementData, function(element) {
	return {
		properties: {
			title: element.name
		}
	};
});
$.help_list_view.sections[0].setItems(items);