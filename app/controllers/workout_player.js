var args = $.args;

var log = require('log');

var xhr = new XHR();
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;

(function constructor() {

	loadWorkout();	
    
})();




function proccessWorkout(n){

	var round_iterator = n;

	for (round in round_iterator){
		// Generates round intro slide here...
		var iterator = round_iterator[round].customizer;
		var exercise_number = round_iterator[round].wo_exercise_number;
		var exercise_equipment = round_iterator[round].wo_equipment;
		var exercise_type = round_iterator[round].wo_round_type;


		var ob = {};
		ob.type="overview";
		ob.title="Round "+round+":";
		ob.id = "o";
		ob.exercise_number = exercise_number;
		ob.exercise_equipment = exercise_equipment;
		ob.exercise_type = exercise_type;
		ob.round = iterator;


		// Ti.API.info('ROUND:',round);
		exercises.push(ob);


		for (i in iterator ){
			var ob = {};
			ob.thumb = iterator[i].acf.video_animated_thumbnail.url;
			ob.type = "video";
			ob.title = iterator[i].post_title;
			ob.id = "v"+iterator[i].id;
			ob.video = iterator[i].acf.video.url;
			exercises.push(ob);
		}


	}

}

function getIndex(n){
	return Number(n)+1;
}

function createSampleData(data){
    

    for (var x=0;x<data.length;x++){
        var slide_data = {
            title:data[x].title,
            type:data[x].type,
            video:data[x].video,
            thumb:data[x].thumb,
            item_index:x,
            index:$,
        }
        if(data[x].type=='overview'){
        	slide_data.round = data[x].round;

			slide_data.exercise_number = data[x].exercise_number;
			slide_data.exercise_equipment = data[x].exercise_equipment;
			slide_data.exercise_type = data[x].exercise_type;        	
        	
        	addWorkoutElement('workout/overview',slide_data);	
        }
        else{
        	addWorkoutElement('workout/video',slide_data);	
        }
        
    };
    addWorkoutElement('workout/overview',{title:'The End', type:'overview'});

    

    
};



function onSuccessWorkoutCallback(e){

    // Ti.API.info('VIDEO:', e.data.acf.round_selector[0].customizer[0].acf.video.url);
    // Ti.API.info('GIF:', e.data.acf.round_selector[0].customizer[0].acf.video_animated_thumbnail.url);
    // Ti.API.info('THUMB:', e.data.acf.round_selector[0].customizer[0].acf.video_featured.url);

	exercises = [];

	var data = e.data.acf.round_selector;
	proccessWorkout(data);

	createSampleData(exercises);
	// addVideoSlide();
}




function onErrorWorkoutCallback(e){
	Ti.API.info(e.data);
}




function loadWorkout(){
	xhr.GET(workout_url, onSuccessWorkoutCallback, onErrorWorkoutCallback, Alloy.Globals.XHROptions);
}

function addOverviewSlide(data){
	var overview = Alloy.createController('workout/overview', data);
	$.scrollable.addView(overview.getView());	
}

function addVideoSlide(data){
	var slide = Alloy.createController('workout/video', data);
	$.scrollable.addView(slide.getView());	
}

function addWorkoutElement(type, data){
	var item = Alloy.createController(type,data);
	// item.bark();
	$.scrollable.addView(item.getView());
}


function scrollNext() {
	Ti.API.info('THISPAGE: ' + $.scrollable.currentPage);
	$.scrollable.scrollToView($.scrollable.currentPage + 1);
}

function scrollPrev() {
	Ti.API.info('THISPAGE: ' + $.scrollable.currentPage);
	$.scrollable.scrollToView($.scrollable.currentPage - 1);
}

function scrollToView() {
    $.scrollable.scrollToView(1); // Index or view
}

function addNewView() {
    var newView = Ti.UI.createView({
        backgroundColor: Utils.getRandomColor() // Generate rgba-color
    });
        
    $.scrollable.addView(newView);
    log.args('Ti.UI.ScrollableView added new view at index ' + ($.scrollable.views.length - 1));

    validateButtons();
}

function removeLastView() {
    $.scrollable.removeView($.scrollable.views[$.scrollable.views.length - 1]);
    log.args('Ti.UI.ScrollableView deleted last view');
    
    validateButtons();
}

function scrollableViewDidScroll(e) {
    log.args('Ti.UI.ScrollableView did scroll to index ' + e.currentPage);
    var curr = $.scrollable.views[e.currentPage]
    Ti.App.fireEvent('cage/workout/slide/entered', { 'item': e.currentPage });
    // startSlide(curr);
    // cancelAllTimers();
    // removeVideoFromLastSlide();
    // startTimerAt(e.currentPage);
}

function validateButtons() {
    $.remove.setEnabled($.scrollable.views.length > 0);
    $.scrollTo.setEnabled($.scrollable.views.length >= 2);
}


function startSlide(item){
	Ti.API.info('CURRENT: ',item);
	// item.getView().bark();
}

exports.hello = function(){
	Ti.API.info('Hello!');
	ob.sayHello();
}