var Alloy=require('alloy');

exports.getMainView=function(){
	return Alloy.createController('class_builder');;
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

exports.getMenuButton=function(args){
	var v=Ti.UI.createView({
		height: args.h,
		width: args.w,
		backgroundColor: '#A1D0E0'
	});
	
	var b=Ti.UI.createView({
		height: "20dp",
		width: "20dp",
		backgroundImage: "/106-sliders.png"
	});
	
	v.add(b);
	
	return v;
};