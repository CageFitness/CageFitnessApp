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



/**
 * The scoped constructor of the controller.
 **/
(function constructor() {
    Ti.API.info('INIT.EXERCISE');
    init_exercise();
})();



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
	$.fg.clearGrid();



	var filter_query = {}
		filter_query.per_page=50;
		filter_query.page=1;

	if(e.filter=='all'){
		if(e.search){
			filter_query.s=e.search;
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

	hidePreloader();	

	var parsed = JSON.parse(e.data);
	Ti.API.info('GET.EXERCISE.REST.API.COUNT.RESULTS: ',_.size(parsed));
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

}

function onErrorExercises2Callback(e){
	Ti.API.info(e.data);
}


function onErrorExercisesCallback(e){
	Ti.API.info(e.data);
}


function showGridItemInfo(e){
	Ti.API.info('ITEM.CLICKED.EXERCISE...', e.source.data);
	Ti.App.fireEvent('cage/launch/video', {'url':e.source.data.video, 'title':e.source.data.title});
};


//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function createSampleData(data){
    
    items = [];
    for (var x=0;x<data.length;x++){
    
        //CREATES A VIEW WITH OUR CUSTOM LAYOUT
        var view = Alloy.createController('item_gallery',{
            image:data[x].thumb,
            title:data[x].title,
            width:$.fg.getItemWidth(),
            height:$.fg.getItemHeight()
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

    $.fg.addGridItems(items);
    
};

function init_exercise(){
	loadExercises('all');

	$.fg.init({
	    columns:4,
	    space:20,
	    gridBackgroundColor:'#fff',
	    itemHeightDelta: -90,
	    itemBackgroundColor:'#eee',
	    itemBorderColor:'transparent',
	    itemBorderWidth:0,
	    itemBorderRadius:0,
	    onItemClick: showGridItemInfo
	});	

}





