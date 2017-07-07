// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.hTitle.text =  args.htitle;

$.exercise_type.text 		= args.wo_round_type.label;
$.exercise_equipment.text 	= args.wo_equipment.label;
// $.exercise_number.text 		= '('+args.wo_exercise_number+' Exercises)';

var wo_round_type = args.wo_round_type;
var wo_equipment = args.wo_equipment;
var wo_exercise_number = args.wo_exercise_number;

var roundOptions = args.roundOptions;
var round_index = args.round_index;

function openOptions(e){
	Ti.API.info('POPIN.OPTIONS.BUTTON.FROM.CUSTOMIZER.HEADER');
	Animation.popIn($.round_options);
	roundOptions(round_index);
}
$.clicker.addEventListener( 'click', openOptions );