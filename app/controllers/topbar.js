// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var wName = args.windowName || '';
var window_type = args.window_type || 'return';



if (window_type=='modal') {

	$.menuButton.backgroundImage = 'images/icons/close.png';
	$.button_wrapper_login.hide();

}

$.button_wrapper.addEventListener('click',onCloseButtonClick);

$.button_wrapper_login.addEventListener('click',function(e){
	Ti.App.fireEvent('cage/launch/login');
});

if(args.winref){
	args.winref.addEventListener('close', $.cleanup);
}


function onCloseButtonClick(e){
	clearInterval(Alloy.Globals.Timer);
	Ti.App.fireEvent('cage/topbar/menu_button/close', {'window_type':args.window_type});
}


$.cleanup = function cleanup() {
	Ti.API.info('TOPBAR.WINDOW.PERFORMING.CLEANUP:');
	// clearInterval(Alloy.Globals.Timer);
	Ti.App.removeEventListener('cage/topbar/menu_button/close', onCloseButtonClick);

	$.button_wrapper.removeEventListener('click',onCloseButtonClick);
	$.button_wrapper = null;
	$.destroy();
	$.off();
};
