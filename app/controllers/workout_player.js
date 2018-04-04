var args = $.args;
var winref = args.winref;
var log = require('log');
// var xhr = new XHR();
var workout_url = Alloy.CFG.api_url + Alloy.CFG.workout_test_path;
var workout_final_url = Alloy.CFG.api_url + Alloy.CFG.workout_final_path;
var user_workout_url = Alloy.CFG.api_url + Alloy.CFG.user_workout_path;

var videos_queue = [];
var assets_queue = [];
var owl_views = [];

var initial_dlinfo;
// ?author=617&per_page=1
var config;
var cage_cache_dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached');
var inited = 0;
var show_activity = _.once(justShow);
var scroll_ready=false;
var onView=false;

$.top_bar_required.winref = args.winref;

$.round_btn_bar.addEventListener('postlayout',function(e){
	Ti.API.info('POST.LAYOUT.TRIGGERED',e);
	// $.round_btn_bar.visible=true;
});

$.scrollable.addEventListener('postlayout',function(e){
	Ti.API.info('POST.LAYOUT.TRIGGERED',e);
	
	$.scrollable.show();
	onView=1;

});

var round_tool=[];

Alloy.Globals.downprogress = $.downprogress;


enablePlayerButtons(false);


function showActivity(){
	Ti.API.info('***************');
	Ti.API.info('***************');
	
	
	$.downprogress.setOpacity(1);
	$.downprogress.show();
	
}
function hideActivity(){
	Ti.API.info('This should work only once.');
	$.downprogress.hide();
}


// function onDownloadProgress(e){
// 	_.once(showActivity);
// }

// Ti.App.iOS.addEventListener('downloadprogress', onDownloadProgress);


function onDownloadComplete(e){

    var task_completed = _.findWhere(Alloy.Globals.WorkoutAssets,{task:e.taskIdentifier});
    if( task_completed && task_completed.filename ) {
    	var completed = _.size(_.where(Alloy.Globals.WorkoutAssets, {complete: true}));
	    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cached/'+task_completed.filename);
		if(file.exists()) {
	    	Ti.API.info('AFTER.ASKING:', task_completed.task, e.taskIdentifier);
			var inqueue = _.size(Alloy.Globals.WorkoutAssets);
			Ti.API.info('ASSET.DOWNLOAD.COMPLETE:', completed, inqueue, JSON.stringify(task_completed));
			Ti.API.info('CALCULATE:', completed, inqueue, completed/inqueue );
			// $.downprogress.value=Alloy.Globals.DownloadProgress;
			// xxxxx
		} else {

		}
	}

}



	$.workout_player_buttons.addEventListener('click',function(e){
		Ti.API.info('TOOL.BAR.EDIT:',e.source.labels[e.index]);
		if(e.index===0){
			scrollPrev(e);
		}
		else if(e.index===1){
			PlayPause(e);
		}
		else if(e.index===2){
			scrollNext(e);
		}
		// $.workout_player_buttons.labels[e.index].cb(e, $.workout_player_buttons.labels[e.index].mode, e.source.labels[e.index]);
	});


function handleRoundNavigator(e, mode, slideToOverview) {
    
    if(mode=='restart'){
    	Ti.API.info('ROUND.NAVIGATOR.RESTART', e);
    }
    else if (mode=='prev'){
    	Ti.API.info('ROUND.NAVIGATOR.PREV', e);
    }
    else if (mode=='next'){
    	Ti.API.info('ROUND.NAVIGATOR.NEXT', e);
    }
    else if(mode=='navigate'){
    	Ti.API.info('ROUND.NAVIGATE.TO',e, slideToOverview.slideIndex);
    	scrollToRound(e, slideToOverview.slideIndex);
    }



};


	
	
(function constructor() {

	init();

})();




function init(){

	if (! cage_cache_dir.exists()) {

		cage_cache_dir.createDirectory();
	}
	else{
		Ti.API.info('SKIPPING.CACHE.FOLDER.CREATION');
	}

	Ti.API.info('======== Cached Resources =======\n', cage_cache_dir, '\n', _.size(cage_cache_dir.getDirectoryListing()), '\n===============================');
	Ti.API.info('=================================');	

	config = JSON.parse( Ti.App.Properties.getString('config') || loadConfig() );
	Ti.API.info('LOADING.CONFIGURATION.WORKOUT:',config.acf.duration_break);
	// showIndicator();
	loadWorkout();

}




function showIndicator(e){
    // $.activity_wrapper.show();
    // $.activity_indicator.show();
}
function closeIndicator(){
        Ti.API.info('CLOSE.INDICATOR: ');
        // $.activity_wrapper.hide();
        // $.activity_indicator.hide();
}



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
	Alloy.Globals.WorkoutAssets =[];
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
			
			// is last in round
			var last = (i == _.size(iterator)-1) ? true : false;
			// Ti.API.info('CHECKING.LAST:', i, _.size(iterator), '==',( _.size(iterator)-1),  last );
			rob.last = last;
			// rob.last = 'HOLA';
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


			addFileToDownloadQueue2(rob.filename, rob.video);
			addFileToDownloadQueue2(rob.thumb_filename, rob.thumb);

			exercises.push(rob);


		}
		Ti.API.info('=====');



	}
	return exercises;

}




function addAssetsToSessionDownloadManager(){


	Ti.API.info('===================== CAN CONTINUE ====================');
	var can_continue = _.every(assets_queue,function(item,index){
		return isInCache(item.filename);
	});
	Ti.API.info('ALL.FILES.IN.CACHE? ',can_continue);
	if(can_continue){
		Ti.API.info('CAN.CONTINUE.TRIGGERED');

		Ti.App.fireEvent('/cage/workout/start');

	}
	else{
		$.downprogress.message="Adding Assets. Please wait...";
		$.downprogress.show();
	}
	Ti.API.info('=======================================================');


	

	_.each(assets_queue, function(item){

		_.defer(function(){
			Ti.API.info('ASKING.FOR.FILES...',item.filename);
		});

		if(!isInCache(item.filename)){
			_.defer(addToDownloadSession,item);
			Ti.API.info('DOWNLOAD.DEFERED:',item.filename);
		};

	});
}


function addAssetsToDownloadManager(){
	_.each(videos_queue || [], function(item){
		// If file is not already in cache folder add it to download manager queue.
		var result = _.findWhere(NappDownloadManager.getAllDownloadInfo(), {url: item.url});
		var is_match = Boolean(result);
		// Ti.API.info(item.url, ' --> ',  is_match ? 'FOUND':'NOT_FOUND');
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




function addFileToDownloadQueue2(filename, file_url){
	if (filename && file_url) {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cached/'+ filename);
		var ob = {};
		ob.filename = filename;
		ob.url = file_url;
		ob.native_path = file.nativePath;
		assets_queue.push(ob);
	}
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

function justShow(){
	Ti.API.info('SHOULD.HAPPEN.ONLY.ONCE');
	$.downprogress.applyProperties({message:'Downloading Assets...', opacity:1});
}

function isInCache(file){
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+file);
	return file.exists();
}


function getIndex(n){
	r = Number(n)+1; 
	return r;
}

function navigateRounds(e){
	Ti.API.info('ROUND.NAVIGATOR.ROUND.NUMBER:',e);
}


function getExerciseDuration(round_size){
	var cfg = config;
	var duration_ob = _.findWhere( cfg.acf.round_configs, {'config_round_num':round_size} );
	return duration_ob;
}


function prepareVideoOwl(data){
	// owl_views = [];
    for (var x=0;x<data.length;x++){
    	// if first Owl slide
        var sob = {
            title:data[x].title,
            type:data[x].type,
            video:data[x].video,
            thumb:data[x].thumb,
            item_index:x,
            index:$,
            // round_number:data[x].round_number,
        }
        sob.first_slide = (x===0) ? true : false;

        if(data[x].type=='overview'){
        	sob.round = data[x].round;
        	sob.round_number = data[x].round_number;
        	sob.title = "Round "+data[x].round_number+":";
			sob.exercise_number = data[x].exercise_number;
			sob.exercise_equipment = data[x].exercise_equipment;
			sob.exercise_type = data[x].exercise_type;        	
        	sob.file_index = data[x].file_index;
        	sob.config = config;

        	// Ti.API.info('ADDING.OVERVIEW:');
        	sob.winref=args.winref;
        	sob.scrollableref=$.scrollable;
        	var overview_view = {type:'workout/overview',data:sob, winref:args.winref};
        	owl_views.push(overview_view);
        	// addWorkoutElement('workout/overview',sob);
			// Adds Slide Information to Round Navigator

			// _TOOL
			round_tool.push({slideIndex:x, title:sob.round_number, cb:handleRoundNavigator, mode:'navigate'});        	
        }
        else{



        	sob.round_number = data[x].round_number;
        	


        	sob.last = data[x].last;
        	sob.filename = data[x].filename;
        	sob.next = data[x].next;
        	sob.file_index = data[x].file_index;
        	sob.exercise_number = data[x].exercise_number;
		    sob.duration = getExerciseDuration(sob.exercise_number);
		    sob.winref=args.winref;
		    sob.scrollableref=$.scrollable;
		    var video_view = {type:'workout/video',data:sob, winref:args.winref};
		    owl_views.push(video_view);
        	// addWorkoutElement('workout/video',sob);
        }
        
    };

    var finish_view  = {type:'workout/finish',data:{title:'Well Done!', type:'static', winref:args.winref, scrollableref:$.scrollable}};
    // Ti.API.info('ADDING.FINISH:');
    owl_views.push(finish_view);
    Ti.API.info('RETURNING.OWL.VIEWS');
    return owl_views;
    // addWorkoutElement('workout/finish',{title:'Well Done!', type:'static'});
};

$.customizer_btn_bar.addEventListener('click',function(e){
	Ti.API.info('LAUNCHING CUSTOMIZER:',e.source.labels[e.index]);
	// clearInterval(Alloy.Globals.Timer);
	winref.close({animated:true});
	Ti.App.fireEvent('cage/launch/customizer',{menu_id:'menu_customizer'});
});


function enablePlayerButtons(bol){
	_.each($.workout_player_buttons.getLabels(),function(label,index){
		label.enabled=bol;
	});
}



function populateRoundNavigator(button_bar_labels){

    var toolW = _.size(button_bar_labels) * 38;
	$.round_btn_bar.labels = button_bar_labels;
	$.round_btn_bar.applyProperties({width:toolW, visible:true});

	$.round_btn_bar.addEventListener('click',function(e){
		Ti.API.info('TOOL.BAR.EDIT:',e.source.labels[e.index]);
		clearInterval(Alloy.Globals.Timer);
		$.round_btn_bar.labels[e.index].cb(e, $.round_btn_bar.labels[e.index].mode, e.source.labels[e.index]);
	});



}

function onSuccessWorkoutCallback(e){
	Ti.API.info(e.data.headers);
    // Ti.API.info('VIDEO:', e.data.acf.round_selector[0].customizer[0].acf.video.url);
    // Ti.API.info('GIF:', e.data.acf.round_selector[0].customizer[0].acf.video_animated_thumbnail.url);
    // Ti.API.info('THUMB:', e.data.acf.round_selector[0].customizer[0].acf.video_featured.url);
    // closeIndicator();
	exercises = [];
	assets_queue = [];
	// var parsed = JSON.parse(e);
	// Ti.API.info(e);
	var data = e.data.acf.round_selector;
	var program_allowed = e.data.acf.program_allowed;



	

	// proccessWorkout(data);
	// prepareVideoOwl(exercises);
	// addOwlElements(owl_views);
	var can_customize = program_allowed ? false : true;
	$.customizer_btn_bar.visible = can_customize;
	Ti.API.warn('BEFORE.GETTING.PROCESSED.PROGRAM.ALLOWED: ',can_customize);
	


	Ti.API.info('GETTING.PROCESSED');
	var processed = proccessWorkout(data);
	Ti.API.info('GETTING.OWLED');
	var owled = prepareVideoOwl(processed);

	populateRoundNavigator(round_tool);

	// Ti.API.info('ATTEMPT.BEFORE.OWL');
	Ti.API.info('ADDING.OWLED.TO.DOWNLOADS');
	var owledElements = addOwlElements(owled);
	Ti.API.info( 'ADDING.OWLED.ELEMENTS', _.size(owledElements) );

	// Cache Size Update
	$.scrollable.cacheSize = _.size(owledElements);

	var setted_views = $.scrollable.setViews(owledElements);
	Ti.API.info('SETTED.VIEWS.IN.OWL', _.size(setted_views) );
	// Ti.API.info('ATTEMPT.AFTER.OWL');
    


	// addAssetsToDownloadManager(videos_queue);

	// addAssetsToSessionDownloadManager(assets_queue);
	
	Ti.API.info('DELAYING.DOWNLOAD.MANAGER.START');
	_.delay(addAssetsToSessionDownloadManager,1000,'assets_queue');

	// NappDownloadManager.restartDownloader();
	// NappDownloadManager.resumeAll();

}




function onErrorWorkoutCallback(e){
	Ti.API.info(e.data);
}

function loadConfig(){
	Ti.API.info('COnfig should be ready.');
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadWorkout(){
	var wid = Ti.App.Properties.getString('my_workout');
	var updatedCall = Alloy.Globals.updateWorkout ? '?rn='+getRandomInt(0,1000000) : '';

	// var wurl = workout_final_url+wid+updatedCall;
	var wurl = workout_final_url+wid;
	Ti.API.info('ATTEMPT.LOAD.WORKOUT_PLAYER.UPDATE?', updatedCall, wurl);
	// Alloy.Globals.XHROptions.ttl=300;
	xhr.GET(wurl, onSuccessWorkoutCallback, onErrorWorkoutCallback, Alloy.Globals.XHROptions);
	Alloy.Globals.updateWorkout=0;
}

function startOverviewClock(){
	Ti.API.info('STARTING.CLOCK');
}



function addOwlElements(items){
	var owl_pages = [];
	_.each(items,function(item,index){

		// var page = Alloy.createController(item.type,item.data);
		// owl_pages.push(page.getView());
		
		// performance update
		owl_pages.push( Alloy.createController(item.type,item.data).getView() );

	});
	
	return owl_pages;
}

function addWorkoutElement(type, data){
	var item = Alloy.createController(type,data);
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

function scrollToRound(e, overview) {
	Ti.API.info('SCROLL.TO.ROUND: ' + $.scrollable.currentPage);
	var roundSlide = overview;
	$.scrollable.scrollToView(roundSlide);
	// $.scrollable.setCurrentPage(roundSlide);
}	



function scrollToLast() {
	Ti.API.info('TOTAL.CHILDREN: ' ,_.size($.scrollable.views) )
    $.scrollable.setCurrentPage(_.size($.scrollable.views)-1); // Index or view
}
function scrollToView() {
    $.scrollable.setCurrentPage(0); // Index or view
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




$.cleanup = function cleanup() {
	Ti.API.info('WORKOUT.PLAYER.PERFORMING.CLEANUP:');
	// clearInterval(Alloy.Globals.Timer);
	$.destroy();
	$.off();
};
args.winref.addEventListener('close', $.cleanup);





