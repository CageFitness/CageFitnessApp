// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


var log = require("log");

/**
 * The scoped constructor of the controller.
 **/
(function constructor() {
    
})();

function tabEquipment(e) {
	var slug = e.source.labels[e.index].slug;
	var tax_url = Alloy.CFG.api_url + Alloy.CFG.exercise_equipment_path + slug;
	log.args('Filter Values: ', e.source.labels[e.index], tax_url);
}

function tabExerciseType(e) {
	var slug = e.source.labels[e.index].slug;
	var tax_url = Alloy.CFG.api_url + Alloy.CFG.exercise_type_path + slug;
	log.args('Filter Values: ', e.source.labels[e.index], tax_url);
}
