// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;
var exercise_url = Alloy.CFG.api_url + Alloy.CFG.exercise_path;


function loadExercises(selection){
	Ti.API.info('GETTING EXERCISES:', selection);

	var filter_query = {}
		filter_query.per_page=52;
		filter_query.page=1;
		// if(e.filter=='all'){
		// 	if(e.search){
		// 		filter_query.s=e.search;
		// 	}
		// }
		// else if(e.filter=='exercise_equipment'){
		// 	filter_query.exercise_equipment=e.ttid;
		// }
		// else if(e.filter=='exercise_type'){
		// 	filter_query.exercise_type=e.ttid;
		// }

	var querystring = Object.keys(filter_query).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(filter_query[k])
	}).join('&');

	// https://cagefitness.com/wp-json/wp/v2/exercise?per_page=5&page=1&exercise_equipment=278
	xhr.GET(exercise_url+'?'+querystring, onSuccessExercises2Callback, onErrorExercises2Callback);
}


function createExerciseList(exercises, roundIndex){
	Ti.API.info('EXERCISES.IN.ROUND: ', _.size(exercises.customizer));
	var roundData = [];

	_.each(exercises,function(exercise){
		// Ti.API.info('EXERCISE.DATA:', exercise.ID, exercise.post_title);
	    var ob = {
	    	properties: { title: exercise.post_title, searchableText:exercise.post_title, canMove:true, canInsert:false, canEdit:true,},
	    }
	    roundData.push(ob);
	})

	var round_title = 'Round '+roundIndex;
	var roundSection = Ti.UI.createListSection();
	roundSection.setItems(roundData);
	$.pover.appendSection(roundSection);
}



$.pover.addEventListener("itemclick", function(e){
    var section = $.pover.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);

    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        item.properties.color = 'blue';
    }
    else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        item.properties.color = 'black';
    }
    section.updateItemAt(e.itemIndex, item);
    item.properties.cage_selected=true;

    args.selection.equipment='bands';
    args.validate(args.selection);
    listWindow(args.selection);



});