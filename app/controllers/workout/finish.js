// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var id = args.id || 'v565989';
var title = args.title || '';
var subtitle = args.subtitle || '';
var counter = args.counter || '59';
var round = args.round || [];
var item_index = args.item_index || 0;
var file_index = args.file_index || 0;
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



