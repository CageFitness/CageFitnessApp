// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;
var exercise_url = Alloy.CFG.api_url + Alloy.CFG.exercise_path;
var pages = 1;
var paging ={};
var exercise_selection=[];
var round_index = args.round_index;
var next_page;
// Available functions from customizer
var optType = args.optType;
var optEquipment = args.optEquipment;
var createRoundFromSelection = args.createRoundFromSelection;

var defaults ={ 
	per_page:52,
	sortby:'title',
	order:'asc',
};







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

		Ti.API.info("LIST.SELECTIONS:",args.selection);
		var custom_query = _.defaults(filter_query, args.selection);

		Ti.API.info("LIST.FINAL.SELECTION:",custom_query);

	var querystring = Object.keys(custom_query).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(custom_query[k])
	}).join('&');

	// https://cagefitness.com/wp-json/wp/v2/exercise?per_page=5&page=1&exercise_equipment=278
	xhr.GET(exercise_url+'?'+querystring, onSuccessExercises3Callback, onErrorExercises2Callback);
}





/*
 * parse_link_header()
 *
 * Parse the Github Link HTTP header used for pageination
 * http://developer.github.com/v3/#pagination
 */
function parse_link_header(header) {
  if (header.length == 0) {
    throw new Error("input must not be of zero length");
  }

  // Split parts by comma
  var parts = header.split(',');
  var links = {};
  // Parse each part into a named link
  _.each(parts, function(p) {
    var section = p.split(';');
    if (section.length != 2) {
      throw new Error("section could not be split on ';'");
    }
    var url = section[0].replace(/<(.*)>/, '$1').trim();
    var name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  });

  return links;
}



function onSuccessExercises3Callback(e){

	// hidePreloader();
	$.is.state($.is.SUCCESS);

	
	if( e.headers != 'cache' ){
		Ti.API.info('HEADERS.SHOW:',e.headers);
		// Ti.API.info('HEADERS.SHOW:',e.headers['X-WP-TotalPages']);

		var parsed_links = parse_link_header(e.headers['Link']);

		Ti.API.warn('PARSED.LINKS:', parsed_links);

		if('next' in parsed_links){
			Ti.API.warn('NEXT:',parsed_links['next'])
		}
		else{
			$.is.detach();
		}

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
	
	// Ti.API.info('EXERCISE.SELECTION.OBJECT',args.selection);
	Ti.API.info('EXERCISE.SELECTION.OBJECT');


	// args.orderWindow(args.selection);
	// args.generateRound(args.selection);
	args.validate(exercise_selection, args.round_index);

	// Ti.API.info('createRoundFromSelection.FROM.LIST.JS',args.selection);
	createRoundFromSelection(args.selection,args.round_index);
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






args.selection.customizer = [];

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

  //   var round = {
  //   	add:args.selection.add,
		// wo_equipment:args.selection.wo_equipment,
		// wo_round_type:args.selection.wo_round_type,
	 //    customizer: []
  //   };

  	// Ti.API.info('ARGS.SELECTION.AT.LIST.BEFORE.GRABBING.TTID:',args.selection);
  	Ti.API.warn('ARGS.SELECTION.AT.LIST.BEFORE.GRABBING.TTID:');

  	var type = Object( optType(args.selection.exercise_type));
  	var equipment = Object( optEquipment(args.selection.exercise_equipment));

  	args.selection.wo_round_type = type;
  	args.selection.wo_equipment = equipment;

    args.selection.customizer.push(item.info.data);
    
    // var size = _.size(args.selection.customizer);
    // Ti.API.info('CURRENT.SELECTION.AT.LIST.JS:',args.selection);
    // Ti.API.info('CURRENT.SELECTION.AT.LIST.JS:',size +'/'+ args.selection.num_exercises);

    

    // Ti.API.info('LIST.VALIDATED.STATICALLY');
    // args.selection.equipment='bands';
    args.validate(args.selection);
    // listWindow(args.selection);

});


$.is.setOptions({msgDone:''});
$.is.init($.pover);
$.is.load();

// This was in place before adjusting infite scroll
// loadExercises({page:1});






function cleanupList(){
	Ti.API.info('CLOSING.LIST.POPOVER');
	$.exercisesWin.removeEventListener('close', cleanupList);

		if ($.pover.sections) {
			$.pover.deleteSectionAt(0, {animated:false});
		}
		$.exercisesWin.removeAllChildren();




	$.is.cleanup();
	$.destroy();
	$.off();
	$.exercisesWin = null;

}
$.exercisesWin.addEventListener('close', cleanupList);



