// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
// var xhr = new XHR();






function onSuccessAutoGenerate(e){

	Ti.API.info('SUCCESS: ',e.data);

}

function onErrorWorkoutCallback(e){
	Ti.API.info('ERROR: ',e);
}

function sendData(){

	var rounds = [
	{
		'roundType':'warm-up',
		'roundTypeName':'warm-up',
		'numexercises':5,
		'equipment':'body-weight',
		'round':1,
	},
	{
		'roundType':'warm-up',
		'roundTypeName':'warm-up',
		'numexercises':7,
		'equipment':'body-weight',
		'round':2,
	},
	{
		'roundType':'warm-up',
		'roundTypeName':'warm-up',
		'numexercises':10,
		'equipment':'body-weight',
		'round':3,
	},			
	];

	// rounds[0]["roundType"]="warm-up";
	// rounds[0]["roundTypeName"]="warm-up";
	// rounds[0]["numexercises"]="5";
	// rounds[0]["equipment"]="body-weight";
	// rounds[0]["round"]="1";
	// rounds[1]["roundType"]="upper-body";
	// rounds[1]["roundTypeName"]="upper-body";
	// rounds[1]["numexercises"]="5";
	// rounds[1]["equipment"]="body-weight";
	// rounds[1]["round"]="2";


    var token = Ti.App.Properties.getString('user_token');
    var data = {};
    data.filter = 'red';
    data.build = 'auto';
    data.update = 'true';
    data.rounds = rounds;

    finalData = JSON.stringify(data);

	Ti.API.info('UNO', finalData);
	Ti.API.info('DOS', token);

	var urlx = Alloy.CFG.api_url+Alloy.CFG.workout_create_update;
	Ti.API.info('URL:',urlx);

	xhr.POST('https://cagefitness.com/wp-json/app/v1/my-workout', finalData, onSuccessAutoGenerate, onErrorWorkoutCallback);

}



