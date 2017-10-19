// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var a = Ti.UI.createAnimation({duration: 700, top:-200});
var b = Ti.UI.createAnimation({duration: 300, top:0});

function moveItem(item){
	Ti.API.info('ANIMATION.SUBJECT: ',item);
	Animation.chainAnimate(item,[a,b], function(){
		// Animation.fadeAndRemove($.item, 500, $.preview_container,function(){
			Ti.API.info('ENDED');

		// });
	});
}

function programItemClick(e) {
	Ti.API.info('PROGRAM.EVENT.BUTTON.CLICK: ',e);
	moveItem(e.source);
}



// var items = _.map(elementData, function(element) {
// 	return {
// 		properties: {
// 			title: element.name
// 		}
// 	};
// });
// $.help_list_view.sections[0].setItems(items);