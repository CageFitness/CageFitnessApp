// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;
var exercise_url = Alloy.CFG.api_url + Alloy.CFG.exercise_path;
var pages = 1;
var paging ={};
$.is.init($.pover);
$.is.load();


 function myLoader(e) {
 	// Ti.API.info('LOADING.MORE.PAGING...', paging.total_pages);
 	Ti.API.info('LOADER: ',e);
	loadExercises({page:pages < 5 ? pages++ : 5});

 }



function loadExercises(selection){
	Ti.API.info('GETTING EXERCISES. SHOULD USE _.defaults() HERE!!:', selection);

	var filter_query = {}
		filter_query.per_page=52;
		filter_query.sortby='title';
		filter_query.order='asc';
		if(!selection.page){
			filter_query.page=1;
		}
		else{
			filter_query.page = selection.page;
		}

		Ti.API.info("SELECTIONS:",args.selection);
		var custom_query = _.defaults(filter_query, args.selection);

		Ti.API.info("FINAL.SELECTION:",custom_query);

	var querystring = Object.keys(custom_query).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(custom_query[k])
	}).join('&');

	// https://cagefitness.com/wp-json/wp/v2/exercise?per_page=5&page=1&exercise_equipment=278
	xhr.GET(exercise_url+'?'+querystring, onSuccessExercises3Callback, onErrorExercises2Callback);
}

function onSuccessExercises3Callback(e){

	// hidePreloader();
	$.is.state($.is.SUCCESS);

	
	if( e.headers != 'cache' ){
		Ti.API.info('HEADERS.SHOW:',e.headers);
		Ti.API.info('HEADERS.SHOW:',e.headers['X-WP-TotalPages']);

		// paging.total_items = e.headers['X-WP-Total'];
		// paging.total_pages = e.headers['X-WP-TotalPages'];		
	}

	var parsed = JSON.parse(e.data);
	Ti.API.info('GET.EXERCISE.LIST.REST.API.COUNT.RESULTS: ',_.size(parsed));
	exercises=[];
	// Why JSON needed to be parsed?
    _.each(parsed, function(exercise){
    	// Ti.API.info('TITLE: ',exercise.title.rendered);
	    var ob = {
	    	template:'exerciseItem',
	    	properties: { 
	    		title: exercise.title.rendered,
	    	 	searchableText: exercise.title.rendered,
	    	 	accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,

	    	 	// lithiumlab

	    	 },
	    	 pic:{image: exercise.acf.video_featured.url},
	    	 info:{text: exercise.title.rendered, data:exercise},
	    };
	    exercises.push(ob);		

    })
    var mode = 'append';
	if(mode=='append'){
		var exerciseSection = $.pover.sections[0];
		Ti.API.info('EXERCISE.LISTING.SECTION.BEFORE: ',exerciseSection);

		$.pover.sections[0].appendItems(exercises,{animated:true, animationStyle:Titanium.UI.iOS.RowAnimationStyle.BOTTOM});
		$.is.mark();

		Ti.API.info('EXERCISE.LISTING.SECTION.AFTER: ',exerciseSection);
		// Ti.API.info('EXERCISE.LISTION.SECTION: ',exerciseSection.getItems());
	}
	else if(mode=='replace'){
		var exerciseSection = Ti.UI.createListSection();
		exerciseSection.setItems(exercises);		
		$.pover.replaceSectionAt(0,exerciseSection,{animated:true, animationStyle:Titanium.UI.iOS.RowAnimationStyle.BOTTOM})	
	}

	
	// $.pover.appendSection(exerciseSection);
	

}

function finishExerciseListSelection(e){

	Ti.API.info('EXERCISE.SELECTION.FINISHED',e);
	Ti.API.info('EXERCISE.SELECTION.OBJECT',args.selection);
	args.popover.hide();
}

function onErrorExercises2Callback(e){
	Ti.API.info(e.data);
	$.is.state($.is.ERROR);
}

function closePover(){
	Ti.API.info('EXERCISE.LIST.DONE');
	// args.roundWin.close();

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

    Ti.API.info('LIST.VALIDATED.STATICALLY');
    args.selection.equipment='bands';
    args.validate(args.selection);
    // listWindow(args.selection);



});


loadExercises({page:1});


