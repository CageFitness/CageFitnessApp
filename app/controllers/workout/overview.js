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
	

var items = [];


function getIndex(n){
	r = Number(n)+1; 
	return r;
}

function getExerciseDuration(round_size){
	// Ti.API.info('ROUND.SIZE:',round_size);

	var cfg = args.config;
	var duration_ob = _.findWhere( cfg.acf.round_configs, {'config_round_num':round_size} );

  	// Ti.API.info('DURATION:',duration_ob);
  	// Ti.API.info('DURATION:',duration_ob);
	return duration_ob;

}

function describeRound2(){
	_.each(round,function(item,index){

		var duration;
		if(_.size(round)-1 === index){
			// Ti.API.info('this is last', index, exercise_number, getExerciseDuration(exercise_number));
			duration = getExerciseDuration(exercise_number).config_round_duration_last;
		}
		else{
			duration = getExerciseDuration(exercise_number).config_round_duration;
		}

		var ob = {
			properties:{height:30},
			name:{text:item.post_title},
			rxIndex:{color:'#090', text:round_number+"."+getIndex(index)},
			duration:{text:duration+'s'}
		}

		items.push(ob);
	});
	

}

function describeRound(){
	for (each in round){
		var o = round[each];

	// duration_config
	var last = '';
	if(each === (round.length - 1)){
       last = 'last';
    }

		var ob = {
			properties:{height:30},
	        // mass : {text : o.ID}, 
	        name : {text : o.post_title + 'test'},
	        // number : { text : round_number},
	        rxIndex : { color : "#090", text : round_number+"."+getIndex(each)},
	        // slide_data : {text: getIndex(each) +' | '+duration}
	    }

	    items.push(ob);
	}
}

describeRound2();
$.elementsList.sections[0].setItems(items);

