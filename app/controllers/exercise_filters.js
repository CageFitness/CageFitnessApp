// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


var log = require("log");

/**
 * The scoped constructor of the controller.
 **/
(function constructor() {
    
})();

function tabbedBarSelectedIndex(e) {
	log.args('Ti.UI.iOS.TabbedBar changed to index: ', e.index);
}

