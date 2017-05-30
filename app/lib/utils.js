var Alloy=require('alloy');

exports.getRandomColor = function(){
	return 'rgba(' + _.random(0,255) + ',' + _.random(0,255) + ',' + _.random(0,255) + ', 1.0)';	
}