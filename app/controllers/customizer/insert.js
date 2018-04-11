// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;
var exercise_url = Alloy.CFG.api_url + Alloy.CFG.exercise_path;
var pages = 1;
var paging ={};


var customizerListItem = args.customizerListItem || {};

Ti.API.info('EXERCISE.SELECTION.ITEM:',customizerListItem);





$.popover_ob.contentView.height=Ti.UI.FILL;



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




function exerciseWindow(selection_ob) {
    var exercisesWin = Alloy.createController('customizer/list', {
    	validate:args.validate,
    	selection:selection_ob,
    	roundWin:$.roundWin,
    	popover:$.popover_ob,
    	}).getView();
    $.navWin.openWindow(exercisesWin);
}


function generateRound(e){
	Ti.API.info('GENERATE.ROUND.HERE');

}


function myLoader(e) {
 	Ti.API.warn('LOADER.CALLED: ',e);
	// loadExercises({page:pages < 5 ? pages++ : 5});
	args.selection.page = pages < 5 ? pages++ : 5;
	loadExercises(args.selection);

 }



function loadExercises(selection){
	Ti.API.info('GETTING EXERCISES:', selection);
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


	Ti.API.info("INSERT.SELECTIONS:",selection);
	var custom_query = _.defaults(filter_query, selection);

	Ti.API.info("INSERT.FINAL.SELECTION:",custom_query);


	var querystring = Object.keys(filter_query).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(filter_query[k])
	}).join('&');

	// https://cagefitness.com/wp-json/wp/v2/exercise?per_page=5&page=1&exercise_equipment=278
	xhr.GET(exercise_url+'?'+querystring, onSuccessExercises3Callback, onErrorExercises2Callback);
}

function onSuccessExercises3Callback(e){

	// hidePreloader();
	$.is.state($.is.SUCCESS);

	
	// if( e.headers != 'cache' ){
	// 	Ti.API.info('HEADERS.SHOW:',e.headers);
	// 	Ti.API.info('HEADERS.SHOW:',e.headers['X-WP-TotalPages']);
	// }

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

	}

	var parsed = JSON.parse(e.data);
	Ti.API.info('GET.EXERCISE.LIST.REST.API.COUNT.RESULTS: ',_.size(parsed));
	exercises=[];
	// Why JSON needed to be parsed?
    _.each(parsed, function(exercise){
    	// Ti.API.info('INSERT.TITLE.RENDERED: ',exercise.title.rendered);
    	// Ti.API.info('INSERT.TITLE.TITLE: ',exercise.title);
	    var ob = {
	    	template:'exerciseItem',
	    	properties: { 
	    		title: exercise.title.rendered,
	    	 	searchableText: exercise.title.rendered,
	    	 	accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_NONE,
	    	 	launch_data:exercise,

	    		// title: exercise.post_title,
	    		// searchableText:exercise.post_title,
	    		// launch_data:exercise,
	   			// exercise_index:index,
				// wo_exercise_number:round.wo_exercise_number,
				// wo_equipment:round.wo_equipment,
				// wo_round_type:round.wo_round_type,

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

	// Ti.API.info('EXERCISE.SELECTION.FINISHED',e);
	// Ti.API.info('EXERCISE.SELECTION.OBJECT.UNO',args.selection);
	Ti.API.info('FINISH.EXERCISE.SELECTION');
	$.popover_ob.hide();


}

function onErrorExercises2Callback(e){
	Ti.API.info('onExercise2Callback.popover',e.data);
	$.is.state($.is.ERROR);
}

function closePover(){
	Ti.API.info('EXERCISE.LIST.DONE');
	// args.roundWin.close();

}

$.pover.addEventListener("itemclick", function(e){

    var section = $.pover.sections[e.sectionIndex];
    var newer = section.getItemAt(e.itemIndex);

    // Ti.API.info('INSERT.TITLE.HERE.EXERCISE.DATA',newer.properties);
    Ti.API.warn('INSERT.TITLE.HERE.EXERCISE.DATA', args.selection);

    newer.properties.cage_selected=true;
    newer.properties.wo_round_type=args.selection.type;
    newer.properties.wo_equipment=args.selection.equipment;

    section.updateItemAt(e.itemIndex, newer);

    args.insertExercise(newer.properties, customizerListItem, args.validate_mode);

});

$.is.setOptions({msgDone:''});
$.is.init($.pover);
$.is.load();

// This was in place before adjusting infinite scroll.
// args.selection.page=1;
// loadExercises(args.selection);

// delete args.selection.rounds;



function cleanupList(){
	Ti.API.info('CLOSING.INSERT.POPOVER');
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

