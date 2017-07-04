var log = require('log');
var exercises = [];
var page = 1;
var limit = 2;
var show_activity = _.once(justShow);

var prepared = [];
var sendToDownload=0;
var often=0;
var counter=0;

/**
 * The scoped constructor of the controller.
 **/
(function constructor() {
    log.on('change', showLogs);
})();
function justShow(){
	Ti.API.info('SHOULD.HAPPEN.ONLY.ONCE');
	$.downprogress.applyProperties({message:'Downloading Assets...', opacity:1});
}
function showLogs() {
    $.log.setText(log.history);
    $.scrollView.scrollToBottom();
}
function clearLogs() {
    log.history = '';
    showLogs();
}
function downloadAll(e) {
	Alloy.Globals.downprogress = $.downprogress;
    log.args('INIT:');
    loadMore();
}


function onSuccess(e) {
	var ex = JSON.parse(e.data);
	
	_.each(ex,function(item,index){
		exercises.push(item);
	});

	Ti.API.info('SIZE:',_.size(exercises));


    log.args('LOADING.EXERCISES:', page, _.size(ex));
    loadMore();
}


function onError(e) {
    Ti.API.info('ERROR', e);
}

function loadMore() {
	Ti.API.info('LOADING.MORE');
    if (page <= limit) {
        var wurl = 'https://cagefitness.com/wp-json/wp/v2/exercise?per_page=100&page=' + (page++);
        xhr.GET(wurl, onSuccess, onError);
    }
}


function helloWorld(e){
	Ti.API.info('DEBOUNCED.EVERY.2SECONDS');
}


function downloadAssets(){
	
	Ti.API.info('PREPARE.TO.DOWNLOAD:',_.size(exercises) );
	_.each(exercises,function(item,index){
		prepareExerciseAssets(item);
	});

	Ti.API.info('PREPARED.COUNT:',_.size(prepared));
	// _.each(prepared,function(item,index){
		addToDownloadSession(prepared[0]);
		addToDownloadSession(prepared[1]);
		addToDownloadSession(prepared[2]);
		addToDownloadSession(prepared[3]);
		addToDownloadSession(prepared[4]);
		addToDownloadSession(prepared[5]);
		addToDownloadSession(prepared[6]);
		addToDownloadSession(prepared[7]);
		addToDownloadSession(prepared[8]);
		addToDownloadSession(prepared[9]);
	// });

	// often = setDownloadInterval();

}


function setDownloadInterval(){
	var dlInterval = setInterval(function(){
			if(counter != undefined && prepared ){
				if(counter <= _.size(prepared)){
					Ti.API.info('EVERY.SECOND');
					addToDownloadSession(prepared[counter]);
					counter++;
				}
				else{
					stopAddingMoreDownloads()
				}			
			}
		},200);	
	return dlInterval;
}

function stopAddingMoreDownloads(){
	Ti.API.info('CANCELLING.REMAINING.DOWNLOADS');
	clearInterval(often);
}

function prepareExerciseAssets(exercise){
	if(!isInCache(exercise.acf.video.filename)){
		var vid = {url: exercise.acf.video.url, filename: exercise.acf.video.filename}
		prepared.push(vid);
	}
	if(!isInCache(exercise.acf.video_animated_thumbnail.filename)){
		var gif = {url: exercise.acf.video_animated_thumbnail.url, filename: exercise.acf.video_animated_thumbnail.filename}
		prepared.push(gif);
	}
}

function isInCache(file){

	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+file);
	return file.exists();
}

function addToDownloadSession(ob){
	// add to download task if video does not exist in cached app directoy
	var in_cache = isInCache(ob.filename);
	if( !in_cache ){
		var task = Alloy.Globals.SessionDownloader.downloadTask({url:ob.url, filename:ob.filename});
		var TaskObject = {
			task:task,
			url:ob.url,
			filename:ob.filename,
		}
		Alloy.Globals.WorkoutAssets.push(TaskObject);
	}
	Ti.API.info('CACHED? --> ', in_cache , ob.filename);
	if($.downprogress && !in_cache){
		
		show_activity();
	}
}
