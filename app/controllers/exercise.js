// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var exercises =[];

var xhr = new XHR();
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;

function loadExercises(){
	xhr.GET(workout_url, onSuccessWorkoutCallback, onErrorWorkoutCallback, Alloy.Globals.XHROptions);
}


function proccessWorkout(n){

	var round_iterator = n;

	for (round in round_iterator){
		// Generates round intro slide here...
		var iterator = round_iterator[round].customizer;

		for (i in iterator ){
			var ob = {};
			ob.thumb = iterator[i].acf.video_animated_thumbnail.url;
			ob.type = "";
			ob.title = iterator[i].post_title;
			ob.id = "v"+iterator[i].id;
			ob.video = iterator[i].acf.video.url;
			exercises.push(ob);
		}


	}

}

function onSuccessWorkoutCallback(e){

    Ti.API.info('VIDEO:', e.data.acf.round_selector[0].customizer[0].acf.video.url);
    Ti.API.info('GIF:', e.data.acf.round_selector[0].customizer[0].acf.video_animated_thumbnail.url);
    Ti.API.info('THUMB:', e.data.acf.round_selector[0].customizer[0].acf.video_featured.url);

	exercises = [];

	var data = e.data.acf.round_selector;
	proccessWorkout(data);




	createSampleData(exercises);
}

function onErrorWorkoutCallback(e){
	Ti.API.info(e.data);
}





loadExercises();




var items = [];

//CUSTOM FUNCTION TO DEFINE WHAT HAPPENS WHEN AN ITEM IN THE GRID IS CLICKED
var showGridItemInfo = function(e){
    alert(e.source.data);
};

//INITIALIZE TIFLEXIGRID
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



