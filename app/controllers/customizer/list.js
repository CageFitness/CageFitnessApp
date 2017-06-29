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
 	// var ln = myCollection.models.length;

 	// myCollection.fetch({

 	// 	// whatever your sync adapter needs to fetch the next page
 	// 	data: { offset: ln },

 	// 	// don't reset the collection, but add to it
 	// 	add: true,

 	// 	success: function (col) {
 		
 	// 		// call done() when we received last page - else success()
 	// 		(col.models.length === ln) ? e.done() : e.success();

 	// 	},

 	// 	// call error() when fetch fails
 	// 	error: function(col) {
 	// 		// pass optional error message to display
 	// 		e.error(L('isError', 'Tap to try again...'));
 	// 	}
 	// });
 }



function loadExercises(selection){
	Ti.API.info('GETTING EXERCISES:', selection);
	var filter_query = {}
		filter_query.per_page=52;
		if(!selection.page){
			filter_query.page=1;
		}
		else{
			filter_query.page = selection.page;
		}
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

    args.selection.equipment='bands';
    args.validate(args.selection);
    // listWindow(args.selection);



});


loadExercises({page:1});


