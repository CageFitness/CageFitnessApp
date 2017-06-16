// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var wName = args.windowName || '';
var window_type = args.window_type || 'return';

if (window_type=='modal') {
	$.button_wrapper_login.hide();
}

$.button_wrapper.addEventListener('click',function(e){
	Ti.App.fireEvent('cage/topbar/menu_button/close', {'window_type':args.window_type});
});
$.button_wrapper_login.addEventListener('click',function(e){
	Ti.App.fireEvent('cage/launch/login');
});
if (window_type=='modal'){
	$.menuButton.backgroundImage = 'images/icons/close.png';
}

