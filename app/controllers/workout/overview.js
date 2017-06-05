// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var id = args.id || 'v565989';
var title = args.title || '';
var subtitle = args.subtitle || '';
var counter = args.counter || '59';
var round = args.round || [];
var item_index = args.item_index || 0;
var round_number = args.round_number || '';

var exercise_number = args.exercise_number || '';
var exercise_equipment = args.exercise_equipment || '';
var exercise_type = args.exercise_type || '';
var duration = args.duration || 30;
// $.overview.backgroundColor = Utils.getRandomColor();
$.overview.backgroundColor = '#fff';
	$.title.text = title;
	$.title_type.text = exercise_type.label;
	if(args.type!='static'){
		$.subtitle.text = 'Equipment: ' + exercise_equipment.label;
		$.counter_big.text = counter;
	}
	else{
		$.counter_big.text = '';
	}
	

var items = [];



function describeRound(){
	for (each in round){
		var o = round[each];
		var ob = {
	        mass : {text : o.ID}, 
	        name : {text : o.post_title },
	        number : { text : round_number},
	        symbol : { color : "#090", text : round_number+"."},
	        slide_data : {text: exercise_number +' | '+duration}
	    }
	    items.push(ob);
	}
}

describeRound();
$.elementsList.sections[0].setItems(items);

