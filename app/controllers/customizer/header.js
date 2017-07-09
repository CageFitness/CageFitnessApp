// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var wo_round_type = args.wo_round_type;
var wo_equipment = args.wo_equipment;
var wo_exercise_number = args.wo_exercise_number;

var roundOptions = args.roundOptions;
var round_index = args.round_index;

var optType = args.optType;
var optEquipment = args.optEquipment;


function getIndex(n){
	r = Number(n)+1; 
	return r;
}


var round_title = 'Round '+getIndex(round_index)+':';


$.hTitle.text =  round_title;

Ti.API.warn('HEADER.INFORMATION:',wo_round_type.label||wo_round_type.name, wo_round_type);
$.exercise_type.text 		= wo_round_type.label||wo_round_type.name;
$.exercise_equipment.text 	= wo_equipment.label;
// $.exercise_number.text 		= '('+args.wo_exercise_number+' Exercises)';


Ti.API.warn('HEADER.INDEX.ON.CREATION:',round_index);


function openOptions(e){
	Ti.API.info('POPIN.OPTIONS.BUTTON.FROM.CUSTOMIZER.HEADER', round_index);
	Animation.popIn($.round_options);
	roundOptions(round_index);
}
$.clicker.addEventListener( 'click', openOptions );