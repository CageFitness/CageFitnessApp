// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
// var xhr = new XHR();



Alloy.Globals.XHROptions = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};
var data = {
    username:'pabloliz_member',
    password:'caInterno#1',
    // username:'testmember',
    // password:'testmember'    
}
var opts = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};

function forgotPassword(){
	Ti.Platform.openURL("https://cagefitness.com/my-account/lost-password");
}

function cageAuthenticate(e){
	var login_data = {
		username: $.username.value,
		password: $.password.value,
	}
	Ti.API.info('HELO', $.username.value,  $.password.value);
	showIndicator(e);
    xhr.POST(Alloy.CFG.api_url +'/wp-json/jwt-auth/v1/token', login_data, onSuccessCallback, onErrorCallback,opts);
}

function onErrorCallbackSilent(e){
    Ti.API.info('ERROR: ',e);
    // Animation.shake($.login_panel);
}
function onErrorCallback(e){
    Ti.API.info('ERROR: ',e);
    $.activity_wrapper.hide();
    $.activity_indicator.hide();    
    Animation.shake($.login_panel);
    $.message.text='Login Error. Try again.';
    $.message.color='red';
}

function onSuccessCallback(e){

    Ti.App.Properties.setString('user_token', e.data.token);
    Ti.App.Properties.setString('user_email', e.data.user_email);
    Ti.API.info('AUTH DATA:', e);
    var token = Ti.App.Properties.getString('user_token');
    callOptions(token);
}

function callOptions(tkn){
    Ti.API.info('TOKEN: ', tkn);
    var data = {};
    var validate_url = Alloy.CFG.api_url + Alloy.CFG.validate_path;
    var config_url = Alloy.CFG.api_url + Alloy.CFG.config_path;
    var user_url = Alloy.CFG.api_url + Alloy.CFG.user_path;
    var my_workout_url = Alloy.CFG.api_url + Alloy.CFG.user_workout_path;
    xhr.setStaticOptions({
            requestHeaders: [
                {
                    key: 'Authorization',
                    value: 'Bearer '+tkn
                }
            ],
            debug: true    
        });
    xhr.POST(validate_url);
    xhr.GET(config_url, onSuccessOptionsCallback, onErrorCallbackSilent);
    xhr.GET(user_url, onSuccessUserCallback, onErrorCallbackSilent);
}


function onSuccessOptionsCallback(e){
    Ti.App.Properties.setString('config', e.data );
    var config = JSON.parse( Ti.App.Properties.getString('config') );
}

function onSuccessUserCallback(e){
   Ti.API.info('USER.SUCESS.CB: ', e.data);
   Ti.App.Properties.setString('user', e.data );
   Ti.App.fireEvent('cage/login/authenticated');
   closeLogin();
}

// ===============================

function showIndicator(e){
    $.activity_wrapper.show();
    $.activity_indicator.show();
    Ti.App.fireEvent('cage/login/authenticate');
}

function closeLogin(){
        Ti.API.info('CLOSELOGIN: ');
        $.activity_wrapper.hide();
        $.activity_indicator.hide();
        Ti.App.fireEvent('cage/class_builder/init');
        $.login.close();

}


// cageAuthenticate();	





