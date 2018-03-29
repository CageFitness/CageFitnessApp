var animation = require('alloy/animation');
var args = $.args;
var scrollable = args.scrollableref;

var id = args.id || 'v565989';
var title = args.title || 'Video Title';
var subtitle = args.subtitle || 'END';
var counter = args.counter || '00:00'+' |-| '+args.duration+' > '+args.last+' > ';
var item_index = args.item_index || null;
var localvid = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+args.filename);
var video = localvid || args.video || null;
var next = args.next || null;



var fancyTimeFormat = function(time){   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


// Ti.API.info('IS.LAST.VIDEO.CHECK', args.last ? args.duration.config_round_duration_last : args.duration.config_round_duration)
// Ti.API.info('\n===================================');
// Ti.API.info('IS.LAST.VIDEO.CHECK.DURATION:', args.duration.config_round_duration);
// Ti.API.info('IS.LAST.VIDEO.CHECK.DURATION.LAST:', args.duration.config_round_duration_last);
// Ti.API.info('IS.LAST.VIDEO.CHECK.IS.LAST', args.last);
// Ti.API.info('IS.LAST.VIDEO.CHECK.IS.USE.THIS:', args.last ? args.duration.config_round_duration_last : args.duration.config_round_duration);
// Ti.API.info('===================================');

var timer_duration = args.last ? args.duration.config_round_duration_last : args.duration.config_round_duration;



// Ti.API.info('LOCALVID:', localvid);






var stopped_at;




var preview_timer = timer_duration;
// var Alloy.Globals.Timer;
var increment = -(1/preview_timer);

var resetCounter = function(){
	clearInterval(Alloy.Globals.Timer);
	$.progressbar.progress = 1;
	$.progressbar.text = Math.round($.progressbar.progress * preview_timer);	
}



var pauseCounter = function(){
	stopped_at = Alloy.Globals.Timer;
	Ti.API.info('STOPPING.AT: ',stopped_at );
	clearInterval(Alloy.Globals.Timer);
}


var resumeCounter = function(){
	Alloy.Globals.Timer = stopped_at;
	startCounter();
}


var stopCounter = function(){
	// stops and reset the counter;

}

// Ti.App.addEventListener('resume', resumeCounter);
Ti.App.addEventListener('resume', function(){
	onPlayPause({item:scrollable.currentPage, action:'resume'});
});
// Ti.App.addEventListener('resume', resumeCounter);
Ti.App.addEventListener('pause', function(){
	onPlayPause({item:scrollable.currentPage, action:'pause'});
});



var startCounter = function() {
	if(scrollable.currentPage === item_index){
	    Alloy.Globals.Timer = setInterval(function() {

	        $.progressbar.progress += increment;

	        if ($.progressbar.text == 1) {
	            //this clear Interval needs to be removed when closing the progress window.
	            clearInterval(Alloy.Globals.Timer);
	            Ti.API.info('STOP.VIDEO!!!!');
	            animation.fadeOut($.progressbar, 500, function() {
	                // $.gifImage.stop();
	                // Ti.App.fireEvent('cagefitness_app_preview_finished', { 'video': args.data_title });
	                Alloy.Globals.playBuzz();
	                Ti.App.fireEvent('cage/video/progressbar/finished',{'index':item_index});

	            });
	        }
	        var pr = Math.abs(Math.round($.progressbar.progress * preview_timer));
	        Ti.API.info('TIMER.GOING:',pr);
	       	if(pr >= 0){
	       		$.progressbar.setText(pr);
	       		$.counter.setText(fancyTimeFormat(pr));
	       		// Animation.popIn($.progressbar);
	       	}

	    }, 1000);
	}
}



function getVideoTitle(){
	return args.round_number+ '.' +args.file_index + ' ' +title;
}






$.vid.backgroundColor = Utils.getRandomColor();

// Ti.API.warn('ITEM.VIDEO.CHAPTERS:', args.data);

Ti.API.warn('THIS.VIDEO.DATA: ', args.round_number, args.file_index);

$.title.text = getVideoTitle();
$.subtitle.text = subtitle;
$.counter.text = fancyTimeFormat(timer_duration);
// $.video_player_thumb.image = args.thumb;

// args.index.hello($);

if (next.ID){
	$.coming_up_next.text = next.post_title;
	// $.preview_thumb.image = next.acf.video_animated_thumbnail.url;


	
// THIS NEEDS TO BE ADDED WHILE ENTERING THE SLIDE
var localgif = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+next.acf.video_animated_thumbnail.filename);	
var gifurl = localgif || next.acf.video_animated_thumbnail.url;
	// $.gifImage.image(gifurl);
	// Ti.API.info('NEXT.GIF.ASSIGNED:', next.acf.video_animated_thumbnail.filename);
}
else{
	$.up_next_title.visible=true;
	$.coming_up_next.text = 'Next Round';
}

exports.sayHello = function() {
    Ti.API.info('IM SAYING HELLO');
}


var createGif = function(){

    if(next.ID){
		var localgif = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+next.acf.video_animated_thumbnail.filename);	
		var gifurl = localgif || next.acf.video_animated_thumbnail.url;
		Ti.API.info('CREATING.NEXT.GIF.WITH:', item_index, gifurl);
		var gif = Ti.UI.createImageView({
			top:0,
			left:0,
			height: Ti.UI.FILL,
			// backgroundColor:'pink',
			// borderWidth:1,
			// borderColor:"#d9e153",  			
			layout: "horizontal",
				gif: gifurl,
			});
		$.preview_holder.add( gif );    	
    }	
}



var onPlayPause = function(e){
	if (e.item == item_index) {
		Ti.API.info('You need to Pause this: ', e.item, $.full_video_wrapper.children);


		if(_.size($.full_video_wrapper.children)){
			if($.full_video_wrapper.children[0].getPlaying()){
				$.full_video_wrapper.children[0].pause();
				pauseCounter();
			}
			else{
				$.full_video_wrapper.children[0].play();
				resumeCounter();
			}
		}
	}
}
Ti.App.addEventListener('cage/workout/video/play_pause',onPlayPause);

var createVideoPlayer = function() {


    if (video != null) {
    	Ti.API.info('VIDEO.TO.BE.CREATED:',video);
        $.full_video = Titanium.Media.createVideoPlayer({
            url: video,
            opacity: 0,
            autoplay: false,
            backgroundColor: '#fff',
			backgroundDisabledColor: '#fff',
			backgroundFocusedColor: '#fff',
			backgroundSelectedColor: '#fff',
            height: "100%",
            mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
            repeatMode: Titanium.Media.VIDEO_REPEAT_MODE_ONE,
            width:Ti.UI.FILL,
            // sourceType:Ti.Media.VIDEO_SOURCE_TYPE_FILE,
            showsControls:false,

        });

        // checks duration
        $.full_video.addEventListener('durationavailable', onDurationAvailable);
        // $.full_video.addEventListener('playbackstate', onPlayBackState);

	   }

}

var onPlayBackState = function(e){
    if (e.playbackState == 1) {
        var vDuration = $.full_video.getDuration();
        var vCurrentPBT = $.full_video.getCurrentPlaybackTime();
        var vLaunchPreviewTime = vDuration - 10000 || 10000;
        Ti.API.info('WKT Timings: ', vDuration, vCurrentPBT, vLaunchPreviewTime);
    }	
}

var stopAllVideoAssets = function(e){
            // Ti.API.info('DURATION.AVAILABLE: ', e);
            // checkDuration(e);
            // $.full_video.play();
            Ti.API.info('stopAllVideoAssets on video.js');
}

var onDurationAvailable = function(e){
            // Ti.API.info('DURATION.AVAILABLE: ', e.duration);
             $.full_video.removeEventListener('durationavailable', onDurationAvailable);
            checkDuration(e);
            
}

var checkDuration = function(e) {
	
	    videoDuration = e.duration / 1000;
	    Ti.API.info('GETTING.VIDEO.DURATION: ' + videoDuration);
	    $.full_video_wrapper.add($.full_video);
	    animation.fadeIn($.full_video, 500, function(){
	    	if (_.size($.full_video_wrapper.children) > 0) {
	    		$.full_video_wrapper.children[0].play();
	    	}
	    });
	
}

var animateVideoSlide = function(key) {
	var _key = key;
	if(key == item_index){
	    var title_anim = Ti.UI.createAnimation({
	        duration: 400,
	        opacity: 1,
	        top: 4,
	        // autoreverse: false,
	        // repeat: 1
	    });

	    title_anim.addEventListener('complete', function(e) {
	        Ti.API.info('VIDEO.INTRO.ANIMATION.ENDED');
	        Ti.API.info('VIDEO.CREATING.PLAYER');
	        createVideoPlayer();
	        Ti.API.info('VIDEO.RESET.COUNTER');
	        resetCounter();
	        Ti.API.info('VIDEO.CREATING.PLAYER');
	        startCounter();
	        Ti.API.info('VIDEO.CREATE.GIF');
	        createGif();
	    })


	    $.title.animate(title_anim);


	}

}


var pauseALlVideoAssets = function(){

}

var onOwlSlideEntered = function(e) {

	resetCounter();
	if( _.size($.full_video_wrapper.children) > 0 ){
		var item = $.full_video_wrapper.children[0];
		item.removeEventListener('durationavailable', onDurationAvailable);
		// item.removeEventListener('playbackstate', onPlayBackState);

		item.stop();
		$.full_video_wrapper.remove(item);
		item = null;
		Ti.API.info('VIDEO.REMOVED');
	}
	if( _.size($.preview_holder.children) > 0 ){
		// $.gifImage.stop();
		$.preview_holder.remove($.preview_holder.children[0]);
		$.preview_holder.children[0] = null;
		Ti.API.info('GIF.REMOVED');
	}


    if (e.item === item_index) {
        Ti.API.info('PREVIEW.FINISHED.CALLED:' + e.item, item_index);
        animateVideoSlide(e.item);

    }
}

Ti.App.addEventListener('cage/workout/slide/entered', onOwlSlideEntered);
Ti.App.addEventListener('cage/topbar/menu_button/close', function(e){
	
	if(_.size($.full_video_wrapper.children)){
    	$.full_video_wrapper.children[0].removeEventListener('durationavailable', onDurationAvailable);
    	// $.full_video_wrapper.children[0].removeEventListener('playbackstate', onPlayBackState);	
	}

	Ti.App.removeEventListener('cage/workout/slide/entered', onOwlSlideEntered);
});


$.cleanup = function cleanup() {
	Ti.API.info('VIDEO.PLAYER.PERFORMING.CLEANUP:');
	$.destroy();
	$.off();
	// someController = null;
};
args.winref.addEventListener('close', $.cleanup);









