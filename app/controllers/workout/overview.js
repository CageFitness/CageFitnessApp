// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var id = args.id || 'v565989';
var title = args.title || 'Video Title One';
var subtitle = args.subtitle || 'Video Subtitle Test';
var counter = args.counter || '10';
var round = args.round || [];
var item_index = args.item_index || 0;

var exercise_number = args.exercise_number || '';
var exercise_equipment = args.exercise_equipment || '';
var exercise_type = args.exercise_type || '';

$.overview.backgroundColor = Utils.getRandomColor();
	$.title.text = title;
	$.title_type.text = exercise_type.label;
	$.subtitle.text = 'Equipment: ' + exercise_equipment.label;
	$.counter_big.text = counter;

var items = [];



function describeRound(){
	for (each in round){
		var o = round[each];
		var ob = {
	        mass : {text : o.ID}, 
	        name : {text : o.post_title },
	        number : { text : item_index},
	        symbol : { color : "#090", text : "He"},
	        slide_data : {text: exercise_number}
	    }
	    items.push(ob);
	}
}

describeRound();

$.elementsList.sections[0].setItems(items);

