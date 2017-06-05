


// =========================================





Alloy.Globals.XHROptions = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};

var xhr = new XHR();







// 
// xhr.clean();
// xhr.purge();

var data = {
    // username:'pabloliz_member',
    // password:'%SyNuWlj9o4p)nxZ(npsigYk'
    username:'testmember',
    password:'testmember'    
}
var opts = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};


function cageAuthenticate(){
    xhr.POST(Alloy.CFG.api_url +'/wp-json/jwt-auth/v1/token', data, onSuccessCallback, onErrorCallback,opts);
}


function onSuccessUserCallback(e){
    Ti.API.info('USER: ', e.data);
}
function onErrorCallback(e){
    Ti.API.info('ERROR: ',e);
}

function callOptions(tkn){
    Ti.API.info('TOKEN: ', tkn);
    var data = {};
    var validate_url = Alloy.CFG.api_url + Alloy.CFG.validate_path;
    var config_url = Alloy.CFG.api_url + Alloy.CFG.config_path;
    var user_url = Alloy.CFG.api_url + Alloy.CFG.user_path;

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
    xhr.GET(config_url, onSuccessOptionsCallback, onErrorCallback);
    xhr.GET(user_url, onSuccessUserCallback, onErrorCallback);


}

function onSuccessOptionsCallback(e){
    Ti.App.Properties.setString('config', e.data );
    var config = JSON.parse( Ti.App.Properties.getString('config') );
}


function onSuccessCallback(e){

    Ti.App.Properties.setString('user_token', e.data.token);
    Ti.App.Properties.setString('user_email', e.data.user_email);
    Ti.API.info('AUTH DATA:', e);
    var token = Ti.App.Properties.getString('user_token');
    callOptions(token);
}



// =========================================
