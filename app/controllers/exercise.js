// Arguments passed into this controller can be accessed via the `$.args` object directly or:

// $ GET /wp/v2/posts?per_page=5&page=2
// $ GET /wp/v2/posts?filter[posts_per_page]=5&filter[paged]=2

var args = $.args;
var exercises =[];
var items = [];
// var xhr = new XHR();
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;
var exercise_url = Alloy.CFG.api_url + Alloy.CFG.exercise_path;

var exercise_query;
var inited=false;
var pagesss=1;
// $.fg = Alloy.createWidget('com.prodz.tiflexigrid');
// $.fg_wrapper.add($.fg);
/**
 * The scoped constructor of the controller.
 **/
(function constructor() {
    Ti.API.info('INIT.EXERCISE');
    // init('menu_exercises');
})();





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










function showPreloader(){
	Animation.fadeIn($.activity_wrapper);
	$.activity_indicator.show();	
}


function hidePreloader(){
	Animation.fadeOut($.activity_wrapper);
	$.activity_indicator.hide();
}

function loadExercises(e){
	Ti.API.info('GETTING FILTER INFORMATION:', e);
	showPreloader();
	
	var filter_query = {}
		filter_query.per_page=52;
		filter_query.sortby='title';
		filter_query.order='asc';
		if(e.page >1){
			// filter_query.page=++pagesss;
			Ti.API.warn('EXERCISE.QUERY.PAGINATION.CALL', Alloy.Globals.ExerciseFilter );
			filter_query.page=Alloy.Globals.ExerciseFilter.page++;
		}
		else{
			Ti.API.warn('EXERCISE.QUERY.CLEAN.CALL');
			items = [];
			filter_query.page=1;
			$.fg.clearGrid();
			filter_query.page=Alloy.Globals.ExerciseFilter.page++;
		}


	if(e.filter=='all'){
		if(e.search){
			filter_query.search=e.search;
		}
	}
	else if(e.filter=='exercise_equipment'){
		filter_query.exercise_equipment=e.ttid;
	}
	else if(e.filter=='exercise_type'){
		filter_query.exercise_type=e.ttid;
	}


	
	

	var querystring = Object.keys(filter_query).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(filter_query[k])
	}).join('&');

	// https://cagefitness.com/wp-json/wp/v2/exercise?per_page=5&page=1&exercise_equipment=278
	xhr.GET(exercise_url+'?'+querystring, onSuccessExercises2Callback, onErrorExercises2Callback);
}
Ti.App.addEventListener('cage/exercise/filter',loadExercises);


function onSuccessExercises2Callback(e){

	
	Ti.API.info('HEADERINFO:',e.headers, e.status, e.result);
	var parsed = JSON.parse(e.data);
	Ti.API.info('GET.EXERCISE.REST.API.COUNT.RESULTS: ',_.size(parsed));
	// Ti.API.info('GET.EXERCISE.REST.API.HEADERS: ',e.headers);




		// PAGINATION
		var parsed_links = parse_link_header(e.headers['Link']);

		// Ti.API.warn('PARSED.LINKS:', parsed_links);
		Ti.API.info('LOAD.MORE.SHOULD.BE.REMOVED.HERE', $.fg.lmore.visible);

		if('next' in parsed_links){
				Ti.API.warn('NEXT:',parsed_links['next']);
				$.fg.lmore.visible=true;
		}
		else{
				$.fg.lmore.visible=false;
		}







	exercises=[];
	// Why JSON needed to be parsed?
    _.each(parsed, function(item){
    	// Ti.API.info('TITLE: ',item.title.rendered);
			var ob = {};
			ob.thumb = item.acf.video_featured.url;
			ob.gif = item.acf.video_animated_thumbnail.url;
			ob.type = "";
			ob.title = item.title.rendered;
			ob.id = "v"+item.id;
			ob.video = item.acf.video.url;
			exercises.push(ob);

    })
    createSampleData(exercises);
    hidePreloader();

}

function onErrorExercises2Callback(e){
	Ti.API.info(e.data);
}


function onErrorExercisesCallback(e){
	Ti.API.info(e.data);
}


function showGridItemInfo(e){
	if(e.source.data.type=='action'){
		Ti.API.info('LOAD.MORE.TRIGGERED',e);
		// iqdev
		loadExercises({page:1});
	}
	else{
		Ti.API.info('ITEM.CLICKED.EXERCISE...', e.source.data);
		Ti.App.fireEvent('cage/launch/video', {'url':e.source.data.video, 'title':e.source.data.title});
	}
};


//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function createSampleData(data){
    
    // items = [];
    var fgW = $.fg.getItemWidth();
    var fgH = fgW*0.5625;
    for (var x=0;x<data.length;x++){
    
        //CREATES A VIEW WITH OUR CUSTOM LAYOUT
        var view = Alloy.createController('item_gallery',{
            image:data[x].thumb,
            title:data[x].title,
            width:fgW,
            height:fgH,
        }).getView();
        
        //THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
        var values = {
            title: data[x].title,
            image: data[x].thumb,
            video: data[x].video
        };
        
        //NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA
        items.push({
            view: view,
            data: values
        });
    };



    //ADD ALL THE ITEMS TO THE GRID
    Ti.API.info('BEFORE.FG');
    $.fg.addGridItems(items);
    Ti.API.info('AFTER.FG');
    
};

function init(e){
	
	if(e.menu_id=='menu_exercises'){
		Ti.API.info('INIT.EXERCISES: ', e);
		if(!inited){
			$.fg.init({
			    columns:4,
			    space:20,
			    gridBackgroundColor:'#fff',
			    itemHeightDelta: -90,
			    itemBackgroundColor:'#eee',
			    itemBorderColor:'transparent',
			    itemBorderWidth:0,
			    itemBorderRadius:0,
			    onItemClick: showGridItemInfo,
			    // onLoadMore: loadExercises({page:pagesss})
			});
			inited=true;
			loadExercises({filter:'all'});
		}

		
	}
}
Ti.App.addEventListener('cage/drawer/item_click', init);

function onLoadMore(e){
	Ti.API.info('EXERCISE.LOAD.MORE',e);
}
Ti.App.addEventListener('exercise/grid/load', loadExercises);





