var Alloy=require('alloy');

exports.getMainView=function(){
	return Alloy.createController('class_builder');
};

exports.getMenuView=function(){
	return Alloy.createController('menuview');	
};

exports.getConfigView=function(){
    return Alloy.createController('config');
};

exports.getExerciseView=function(){
    return Alloy.createController('exercise');
};

exports.getHelpView=function(){
    return Alloy.createController('external');
};

exports.getProfileView=function(){
    return Alloy.createController('profile');
};

exports.getWorkoutView=function(){
    return Alloy.createController('workout_player');
};

exports.getMenuButton=function(args){
	var v=Ti.UI.createView({
		height: args.h,
		width: args.w,
		backgroundColor: '#fff',
	});
	
	var b=Ti.UI.createView({
		top:25,
		height: 30,
		width: 30,
		backgroundImage: "images/icons/menu.png",
		// bubbleParent:true
		touchEnabled:false,
	});
	
	v.add(b);
	
	return v;
};