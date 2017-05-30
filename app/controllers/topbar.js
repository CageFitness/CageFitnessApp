// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var wName = args.windowName || '';
$.button_wrapper.addEventListener('click',function(e){
	Ti.App.fireEvent('cage/tobar/menu_button/close', {winref:wName});
});