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
	var ttid = e.source.labels[e.index].ttid;
	log.args('Filter Equipment: ', e.source.labels[e.index]);

	Alloy.Globals.ExerciseFilter = {'filter':'exercise_equipment','ttid':ttid, 'page':1};

	
	Ti.App.fireEvent('cage/exercise/filter',Alloy.Globals.ExerciseFilter);
}

function tabExerciseType(e) {

	var slug = e.source.labels[e.index].slug;
	var ttid = e.source.labels[e.index].ttid;
	log.args('Filter Types: ', e.source.labels[e.index]);

	Alloy.Globals.ExerciseFilter = {'filter':'exercise_type','ttid':ttid, 'page':1};

	Ti.App.fireEvent('cage/exercise/filter',Alloy.Globals.ExerciseFilter);
}

// function tabAll(e) {

// 	var slug = e.source.labels[e.index].slug;
// 	var ttid = e.source.labels[e.index].ttid;
// 	log.args('Filter All: ', e.source.labels[e.index]);

// 	Alloy.Globals.ExerciseFilter = {'filter':'all','ttid':ttid};

// 	Ti.App.fireEvent('cage/exercise/filter',{'filter':'all','ttid':ttid});
// }

function performSearch(e){
	Ti.API.info('SEARCH.TRIGGERED', e);

	$.filter_equipment.hide();
	$.filter_type.hide();

	Alloy.Globals.ExerciseFilter = {'filter':'all', 'search':e.value, 'page':1};
	Ti.App.fireEvent('cage/exercise/filter',Alloy.Globals.ExerciseFilter);
}

function tabTaxonomy(e) {
	Ti.API.info('TAXONOMY: ',e);

	$.filter_equipment.hide();
	$.filter_type.hide();


	if(e.index === 0){
		Alloy.Globals.ExerciseFilter = {'filter':'all', 'page':1};
		Ti.App.fireEvent('cage/exercise/filter',Alloy.Globals.ExerciseFilter);
	}
	if(e.index === 1){
		$.filter_equipment.show();
		Animation.shake($.filter_equipment);
	}
	if(e.index === 2){
		$.filter_type.show();	
		Animation.shake($.filter_type);	
	}
}


