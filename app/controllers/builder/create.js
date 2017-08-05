// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.cancelBtn.addEventListener("click", function(e){
		$.new_workout_popover_ob.hide();
    	Ti.API.info('WORKOUT.CANCELED!');
});


$.done.addEventListener("click", function(e){
	if($.workout_name.value!=""){
		$.new_workout_popover_ob.hide();
    	Ti.API.info('POVER.DONE:',args.data);
    	args.data.title = $.workout_name.value;
    	args.follow();
    };
});


