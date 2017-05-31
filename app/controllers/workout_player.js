var args = $.args;


var cage_cache_dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached');
if (! cage_cache_dir.exists()) {
    cage_cache_dir.createDirectory();
}

Ti.API.info('===================\nCached Resources:\n ', cage_cache_dir, '\n' , cage_cache_dir.getDirectoryListing() );


	// NappDownloadManager.addEventListener('progress', handleDownloadManager);
	// NappDownloadManager.addEventListener('overallprogress', handleDownloadManager);
	// NappDownloadManager.addEventListener('paused', handleDownloadManager);
	// NappDownloadManager.addEventListener('failed', handleDownloadManager);
	NappDownloadManager.addEventListener('completed', handleDownloadManager);
	// NappDownloadManager.addEventListener('cancelled', handleDownloadManager);	
	// NappDownloadManager.addEventListener('started', handleDownloadManager);

	NappDownloadManager.permittedNetworkTypes = NappDownloadManager.NETWORK_TYPE_ANY;
	NappDownloadManager.maximumSimultaneousDownloads = 3;
	// NappDownloadManager.stopDownloader();
	// NappDownloadManager.getAllDownloadInfo();

	var permitted_network_types = NappDownloadManager.getPermittedNetworkTypes();	
	Ti.API.info('PNT: ',permitted_network_types);
	Ti.API.info('=============');
	
	




var log = require('log');

var xhr = new XHR();
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;

var videos_queue = [];
// var percent_all = 0;
var initial_dlinfo;































(function constructor() {

	loadWorkout();	
    
})();

Ti.App.addEventListener('cage/video/progressbar/finished',function(e){
	Ti.API.info('CALLING NEXT FROM VIDEO COUNTER: ',e.index);
	scrollNextFromVideo(e);
})


function scrollNextFromVideo(e) {
	Ti.API.info('THISPAGE: ' + e.index);
	$.scrollable.scrollToView(e.index + 1);
}

NappDownloadManager.addEventListener('progress', function(e) {

	var ob ={};
	// var text = e.downloadedBytes+'/'+e.totalBytes+' '+Math.round(progress)+'% '+e.bps+' bps';
	ob.progress 		= e.downloadedBytes*100.0/e.totalBytes;
	ob.percent 			= e.downloadedBytes+'/'+e.totalBytes;
	ob.percent_pretty 	= Math.round(ob.progress)+'%';
	ob.bps 				= e.bps;
	ob.bps_pretty 		= e.bps+' bps';

	updateManagerProgress(ob);

});




function updateManagerProgress(o){
	
	Ti.App.fireEvent('cage/downloadmanager/progress', {
		'progress': o.progress,
		'percent': o.percent,
		'percent_pretty': o.percent_pretty,
		'bps': o.bps,
		'bps_pretty': o.bps_pretty,
		'overall': calculateProgress()
	});
}



function addFileToDownloadQueue(filename, file_url){
	if (filename && file_url) {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cached/'+ filename);
		var ob = {};
		ob.filename = filename;
		ob.url = file_url;
		ob.native_path = file.nativePath;
		videos_queue.push(ob);
	}
}


function addAllVideosToDownloadManager(){



	_.each(videos_queue || [], function(item){

		// If file is not already in cache folder add it to download manager queue.
		var result = _.findWhere(NappDownloadManager.getAllDownloadInfo(), {url: item.url});
		var is_match = Boolean(result);
		Ti.API.info(item.url, ' --> ',  is_match ? 'FOUND':'NOT_FOUND');
		
		if(!is_match){
			// Ti.API.info('ADDED TO DOWNLOAD MANAGER:: ', is_match);
			addVideoToDownloadManager(item);
		}

	});

	initial_dlinfo = NappDownloadManager.getAllDownloadInfo();

	Ti.API.info('__________________________')
	Ti.API.info('DLINFO:',  _.size(NappDownloadManager.getAllDownloadInfo()), 'VIDEOS.QUEUE', _.size(videos_queue) );
	Ti.API.info('__________________________')
}


function handleDownloadManager(e){
	// Ti.API.info('DL.EVENT:', e);
	// calculateProgress();
}


function calculateProgress(){

	var dlinfo = NappDownloadManager.getAllDownloadInfo();
	// var total = _.size(initial_dlinfo);
	// var remaining = _.size(dlinfo);
	// var downloaded = _.size(initial_dlinfo)  + ( -Math.abs(remaining) );
	var remaining = _.size(dlinfo)+1;

	var o = {
		'total': _.size(initial_dlinfo),
		'remaining': remaining,
		'downloaded': _.size(initial_dlinfo)  + ( -Math.abs(remaining) )
	}
	
	// Ti.API.info('INITIAL.DLINFO.SIZE:', total , 'DLINFO.SIZE:', remaining, 'CURRENT.STATE:', downloaded  );
	return o;
}


function addVideoToDownloadManager(obj){
	// Ti.API.info('ADDED:',obj);
	NappDownloadManager.addDownload({
		name: obj.filename,
		url: obj.url,
		filePath: obj.native_path,
		priority: NappDownloadManager.DOWNLOAD_PRIORITY_NORMAL
	});	
}


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

		// EXERCISE ITERATOR
		for (i in iterator ){
			var ob = {};

			ob.type = "video";
			ob.title = iterator[i].post_title;
			ob.id = "v"+iterator[i].id;

			ob.video = iterator[i].acf.video.url;
			ob.filename = iterator[i].acf.video.filename;

			ob.thumb = iterator[i].acf.video_animated_thumbnail.url;
			ob.thumb_filename = iterator[i].acf.video_animated_thumbnail.filename;

			ob.next = {};

			if(i < _.size(iterator)-1){
				ob.next = iterator[Number(i)+1];
			}
			// Ti.API.info( 'ITERATOR LEN: ' + _.size(iterator), (i < _.size(iterator)-1) );

			addFileToDownloadQueue(ob.filename, ob.video);
			addFileToDownloadQueue(ob.thumb_filename, ob.thumb);

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
        	slide_data.filename = data[x].filename;
        	slide_data.next = data[x].next;
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

	// resetOverallProgress();
	proccessWorkout(data);
	
	addAllVideosToDownloadManager(videos_queue);

	createSampleData(exercises);

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