var args = arguments[0]||{};

var the_image = args.image || '';
var the_title = args.title || '';
var item_width = args.width || '95%';
var item_height = args.height || '95%';


$.thumb.image = the_image;
$.thumb_title.text = the_title;
$.thumb.width = item_width;
$.thumb.height = item_height;