var animation = require('alloy/animation');
var args = $.args;

var id = args.id || 'v565989';
var title = args.title || 'Video Title One';
var subtitle = args.subtitle || 'END';
var counter = args.counter || '00:00'+' | '+args.duration;
var item_index = args.item_index || null;

var localvid = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+args.filename);
var video = localvid || args.video || null;
var next = args.next || null;







// Ti.API.info('LOCALVID:', localvid);











var preview_timer = 10;
var xInt;
var increment = -0.1;

function resetCounter(){
	clearInterval(xInt);
	$.progressbar.progress = 1;
	$.progressbar.text = Math.round($.progressbar.progress * 10);	
}



function startCounter() {

    xInt = setInterval(function() {
        $.progressbar.progress += increment;
        if ($.progressbar.text == 1) {
            //this clear Interval needs to be removed when closing the progress window.
            clearInterval(xInt);
            Ti.API.info('STOP');
            animation.fadeOut($.progressbar, 500, function() {
                // $.gifImage.stop();
                // Ti.App.fireEvent('cagefitness_app_preview_finished', { 'video': args.data_title });
                
                Ti.App.fireEvent('cage/video/progressbar/finished',{'index':item_index});

            });
        }
        $.progressbar.text = Math.round($.progressbar.progress * 10);
    }, 1000);

}










$.vid.backgroundColor = Utils.getRandomColor();
$.title.text = title;
$.subtitle.text = subtitle;
$.counter.text = counter;
// $.video_player_thumb.image = args.thumb;

// args.index.hello($);

if (next.ID){
	$.coming_up_next.text = next.post_title;
	// $.preview_thumb.image = next.acf.video_animated_thumbnail.url;

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


function createGif(){
    if(next.ID){
		var localgif = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+next.acf.video_animated_thumbnail.filename);	
		var gifurl = localgif || next.acf.video_animated_thumbnail.url;
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



Ti.App.addEventListener('cage/workout/video/play_pause',function(e){
	if (e.item == item_index) {
		Ti.API.info('You need to Pause this: ', e.item);
		if($.full_video.playing){
			$.full_video.stop();
			clearInterval(xInt);
		}
		else{
			$.full_video.play();
		}
	}
})

function createVideoPlayer() {


    if (video != null) {
        $.full_video = Titanium.Media.createVideoPlayer({
            media: video,
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

        });

        // checks duration
        $.full_video.addEventListener('durationavailable', onDurationAvailable);
        $.full_video.addEventListener('playbackstate', onPlayBackState);

	   }

}

function onPlayBackState(e){
    if (e.playbackState == 1) {
        var vDuration = $.full_video.getDuration();
        var vCurrentPBT = $.full_video.getCurrentPlaybackTime();
        var vLaunchPreviewTime = vDuration - 10000 || 10000;
        Ti.API.info('Timings: ', vDuration, vCurrentPBT, vLaunchPreviewTime);
    }	
}

function stopAllVideoAssets(e){
            Ti.API.info('DURATION.AVAILABLE: ', e);
            checkDuration(e);
            $.full_video.play();
}

function onDurationAvailable(e){
            Ti.API.info('DURATION.AVAILABLE: ', e);
            checkDuration(e);
            $.full_video.play();
}

function checkDuration(e) {
    videoDuration = e.duration / 1000;
    Ti.API.info('GETTING.VIDEO.DURATION: ' + videoDuration);
    $.full_video_wrapper.add($.full_video);
    animation.fadeIn($.full_video, 500);
}

function animateVideoSlide(key) {
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
	        Ti.API.info('INTRO.ANIMATION.ENDED');
	        createVideoPlayer();
	        resetCounter();
	        startCounter();
	        createGif();
	    })


	    $.title.animate(title_anim);


	}

}


function pauseALlVideoAssets(){

}


Ti.App.addEventListener('cage/workout/slide/entered', function(e) {

	 resetCounter();
	if( _.size($.full_video_wrapper.children) > 0 ){
		// durationavailable
		// playbackstate
		$.full_video.removeEventListener('durationavailable', onDurationAvailable);
		$.full_video.removeEventListener('playbackstate', onPlayBackState);
		$.full_video.stop();
		$.full_video_wrapper.remove($.full_video);
		$.full_video = null;
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
});

// LITHIUMLAB
Ti.App.addEventListener('cage/class_builder/dragstart', function(e) {
    Ti.API.info('cage/class_builder/dragstart' + e);
});
