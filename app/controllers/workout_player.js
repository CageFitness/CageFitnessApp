var args = $.args;
var log = require('log');
// var xhr = new XHR();
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;
var workout_final_url = Alloy.CFG.api_url + Alloy.CFG.workout_final_path;
var user_workout_url = Alloy.CFG.api_url + Alloy.CFG.user_workout_path;
var videos_queue = [];
var initial_dlinfo;
// ?author=617&per_page=1
var config;


var cage_cache_dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached');
if (! cage_cache_dir.exists()) {
    cage_cache_dir.createDirectory();
}



Ti.API.info('======== Cached Resources =======\n', cage_cache_dir, '\n', cage_cache_dir.getDirectoryListing(), '\n===============================');
Ti.API.info('=================================');
	
	
(function constructor() {

	
	NappDownloadManager.addEventListener('progress', ReportProgress);
	NappDownloadManager.addEventListener('completed', ReportProgress);

	NappDownloadManager.stopDownloader();
	NappDownloadManager.cleanUp();


	config = JSON.parse( Ti.App.Properties.getString('config') || loadConfig() );
	Ti.API.info('LOADING.CONFIGURATION.WORKOUT:',config);
	// showIndicator();
	loadWorkout();
})();

function showIndicator(e){
    // $.activity_wrapper.show();
    // $.activity_indicator.show();
}
function closeIndicator(){
        Ti.API.info('CLOSE.INDICATOR: ');
        // $.activity_wrapper.hide();
        // $.activity_indicator.hide();
}



$.dlmanlabel.addEventListener('click',function(e){
	Ti.API.info('====== DOWNLOAD.MANAGER ======');
	var old_cache = cage_cache_dir;
	var current_cache = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached');
	Ti.API.info('==============================');
	Ti.API.info(old_cache);
	Ti.API.info(current_cache);
	Ti.API.info('==============================');
	NappDownloadManager.stopDownloader();
	NappDownloadManager.resumeAll();
	NappDownloadManager.restartDownloader();
	Ti.API.info(NappDownloadManager.getAllDownloadInfo());
	Ti.API.info('==============================');
})


// ===========================================




// ===========================================

function onVideoProgressBarFinished(e){
	Ti.API.info('CALLING NEXT FROM VIDEO COUNTER: ',e.index);
	scrollNextFromVideo(e);
}
Ti.App.addEventListener('cage/video/progressbar/finished',onVideoProgressBarFinished)


Ti.App.addEventListener('cage/topbar/menu_button/close', function(e){
	Ti.App.removeEventListener('cage/video/progressbar/finished',onVideoProgressBarFinished)
});


function scrollNextFromVideo(e) {
	Ti.API.info('THISPAGE: ' + e.index);
	$.scrollable.scrollToView(e.index + 1);
}

function ReportProgress(e) {
	var p = calculateProgress();
	$.dlmanlabel.text = [p.total,p.remaining,p.downloaded].join(' | ');
	$.activity_wrapper.show();
	$.activity_indicator.show();
	Ti.API.info('EVENT_TYPE: ',e.type);
	var ob ={};
	// var text = e.downloadedBytes+'/'+e.totalBytes+' '+Math.round(progress)+'% '+e.bps+' bps';
	ob.progress 		= e.downloadedBytes*100.0/e.totalBytes;
	ob.percent 			= e.downloadedBytes+'/'+e.totalBytes;
	ob.percent_pretty 	= Math.round(ob.progress)+'%';
	ob.bps 				= e.bps;
	ob.bps_pretty 		= e.bps+' bps';

	updateManagerProgress(ob);


};




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



function calculateProgress(){

	var dlinfo = NappDownloadManager.getAllDownloadInfo();
	var o = {}; 
	if (_.size(dlinfo) > 0) {
		var remaining = _.size(dlinfo)-1;
		var o = {
			'total': _.size(initial_dlinfo),
			'remaining': remaining,
			'downloaded': _.size(initial_dlinfo)  + ( -Math.abs(remaining) )
		}	
	}

	return o;
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


function addAssetsToDownloadManager(){



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



function addVideoToDownloadManager(obj){
	// Ti.API.info('ADDED:',obj);
	NappDownloadManager.addDownload({
		name: obj.filename,
		url: obj.url,
		filePath: obj.native_path,
		// priority: NappDownloadManager.DOWNLOAD_PRIORITY_NORMAL
		priority: NappDownloadManager.DOWNLOAD_PRIORITY_HIGH
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


		var cob = {};
		cob.round_number = getIndex(round);
		cob.type="overview"; 
		cob.title="Round "+round+":";
		cob.id = "o";
		cob.exercise_number = exercise_number;
		cob.exercise_equipment = exercise_equipment;
		cob.exercise_type = exercise_type;
		cob.round = iterator;


		// Ti.API.info('ROUND:',round);
		exercises.push(cob);

		// EXERCISE ITERATOR
		for (i in iterator ){
			var rob = {};
			rob.round_number = cob.round_number;
			rob.exercise_number = cob.exercise_number;
			rob.file_index = getIndex(i);
			rob.type = "video";
			rob.title = iterator[i].post_title;
			rob.id = "v"+iterator[i].id;

			rob.video = iterator[i].acf.video.url;
			rob.filename = iterator[i].acf.video.filename;

			rob.thumb = iterator[i].acf.video_animated_thumbnail.url;
			rob.thumb_filename = iterator[i].acf.video_animated_thumbnail.filename;

			rob.next = {};

			if(i < _.size(iterator)-1){
				rob.next = iterator[Number(i)+1];
			}
			// Ti.API.info( 'ITERATOR LEN: ' + _.size(iterator), (i < _.size(iterator)-1) );

			addFileToDownloadQueue(rob.filename, rob.video);
			addFileToDownloadQueue(rob.thumb_filename, rob.thumb);

			exercises.push(rob);


		}


	}

}

function getIndex(n){
	r = Number(n)+1; 
	return r;
}

function prepareVideoOwl(data){
    

    for (var x=0;x<data.length;x++){
        var sob = {
            title:data[x].title,
            type:data[x].type,
            video:data[x].video,
            thumb:data[x].thumb,
            item_index:x,
            index:$,
        }
        if(data[x].type=='overview'){
        	sob.round = data[x].round;
        	sob.round_number = data[x].round_number;
        	sob.title = "Round "+data[x].round_number+":";
			sob.exercise_number = data[x].exercise_number;
			sob.exercise_equipment = data[x].exercise_equipment;
			sob.exercise_type = data[x].exercise_type;        	
        	sob.file_index = data[x].file_index;
        	addWorkoutElement('workout/overview',sob);	
        }
        else{
        	sob.filename = data[x].filename;
        	sob.next = data[x].next;
        	sob.file_index = data[x].file_index;
        	sob.exercise_number = data[x].exercise_number;

		    
		    var item_duration = _.findWhere( config.acf['round_configs'] , {'config_round_num':sob.exercise_number} );
		    // Ti.API.info( 'ROUND CONFIGURATION LEN:', config.acf['round_configs'].length );
		    // Ti.API.info( 'ROUNDS:', config.acf['opt_rounds'] );

		    // Ti.API.info('RCONFIG: ', sob.exercise_number, item_duration);

		    sob.duration = item_duration['config_round_duration'];
		    // Ti.API.info('RCONFIG: ', sob.exercise_number);


        	addWorkoutElement('workout/video',sob);	
        }
        
    };
    addWorkoutElement('workout/finish',{title:'Well Done!', type:'static'});

    

    
};



function onSuccessWorkoutCallback(e){

    // Ti.API.info('VIDEO:', e.data.acf.round_selector[0].customizer[0].acf.video.url);
    // Ti.API.info('GIF:', e.data.acf.round_selector[0].customizer[0].acf.video_animated_thumbnail.url);
    // Ti.API.info('THUMB:', e.data.acf.round_selector[0].customizer[0].acf.video_featured.url);
    // closeIndicator();
	exercises = [];

	var data = e.data.acf.round_selector;

	// resetOverallProgress();
	proccessWorkout(data);
	
	addAssetsToDownloadManager(videos_queue);
	NappDownloadManager.restartDownloader();
	NappDownloadManager.resumeAll();
	prepareVideoOwl(exercises);

}




function onErrorWorkoutCallback(e){
	Ti.API.info(e.data);
}

function loadConfig(){
	Ti.API.info('COnfig should be ready.');
}



function loadWorkout(){
	var wid = Ti.App.Properties.getString('my_workout');
	var wurl = workout_final_url+wid;
	Ti.API.info('ATTEMPT.LOAD.WORKOUT_PLAYER', wurl);
	xhr.GET(wurl, onSuccessWorkoutCallback, onErrorWorkoutCallback, Alloy.Globals.XHROptions);
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

function PlayPause(){
	Ti.App.fireEvent('cage/workout/video/play_pause', { 'item': $.scrollable.currentPage });
}

function scrollNext() {
	Ti.API.info('THISPAGE: ' + $.scrollable.currentPage);
	$.scrollable.scrollToView($.scrollable.currentPage + 1);
}

function scrollPrev() {
	Ti.API.info('THISPAGE: ' + $.scrollable.currentPage);
	$.scrollable.scrollToView($.scrollable.currentPage - 1);
}

function scrollToLast() {
	Ti.API.info('TOTAL.CHILDREN: ' ,_.size($.scrollable.views) )
    $.scrollable.scrollToView(_.size($.scrollable.views)-1); // Index or view
}
function scrollToView() {
    $.scrollable.scrollToView(0); // Index or view
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
    $.scrollTo.setEnabled($.scrollable.views.length >= 1);
}


function startSlide(item){
	Ti.API.info('CURRENT: ',item);
	// item.getView().bark();
}

exports.hello = function(){
	Ti.API.info('Hello!');
	ob.sayHello();
}