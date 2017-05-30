// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// var args = arguments[0] || {}
var title = args.customTitle || 'Foo';
var image = args.customImage || 'default.png';

// Ti.API.info(title);
// Ti.API.info(image);
// Ti.API.info($.header_title);

$.header_title.text = title.toUpperCase();
$.header_background.backgroundImage = image;

