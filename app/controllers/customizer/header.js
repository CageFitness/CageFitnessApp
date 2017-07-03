// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.hTitle.text =  args.htitle;

$.exercise_type.text 		= args.wo_round_type.label;
$.exercise_equipment.text 	= args.wo_equipment.label;
// $.exercise_number.text 		= '('+args.wo_exercise_number+' Exercises)';