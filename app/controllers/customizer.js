// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var xhr = new XHR();






function onSuccessAutoGenerate(e){

	Ti.API.info('SUCCESS: ',e);

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
    xhr.setStaticOptions({
            requestHeaders: [
                {
                    key: 'Authorization',
                    value: 'Bearer '+token
                }
            ],
            debug: true,
            parseJSON:false,    
        });

    var data = {};
    data.action = 'cage_build_workout_html';
    data.build = 'auto';
    data.update = 'true';
    data.rounds = rounds;
	Ti.API.info(data);
	var url = 'https://cagefitness.com/wp-admin/admin-ajax.php';
	xhr.POST(url, data, onSuccessAutoGenerate, onErrorWorkoutCallback);

}

// sendData();

