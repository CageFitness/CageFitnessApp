var Alloy=require('alloy');

exports.getMainView =function(){
	return Alloy.createController('class_builder');
};

exports.getMenuView =function(){
	return Alloy.createController('menuview');	
};

exports.getCustomizerView = function(){
    return Alloy.createController('customizer');
};

exports.getCustomizerView =function(){
    return Alloy.createController('customizer');
};
exports.getConfigView =function(){
    return Alloy.createController('config');
};

exports.getExerciseView =function(){
    return Alloy.createController('exercise');
};

exports.getExternalView =function(){
    return Alloy.createController('external');
};

exports.getHelpView =function(){
    return Alloy.createController('help');
};

exports.getProfileView =function(){
    return Alloy.createController('profile');
};

exports.getWorkoutView =function(){
    return Alloy.createController('workout_player');
};
