var animation = require('alloy/animation');
var args = $.args;

var id = args.id || 'v565989';
var title = args.title || 'Video Title One';
var subtitle = args.subtitle || 'END';
var counter = args.counter || '00:00';
var item_index = args.item_index || null;

var localvid = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'cached/'+args.filename);
var video = localvid || args.video || null;
var next = args.next || null;







Ti.API.info('LOCALVID:', localvid);












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
                Ti.App.fireEvent('cage/video/progressbar/finished',{'index':item_index})
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
	$.preview_thumb.image = next.acf.video_animated_thumbnail.url;
}
else{
	$.up_next_title.visible=false;
}

exports.sayHello = function() {
    Ti.API.info('IM SAYING HELLO');
}




function createVideoPlayer() {


    if (video != null) {
        $.full_video = Titanium.Media.createVideoPlayer({
            url: video,
            opacity: 0,
            autoplay: false,
            backgroundColor: '#fff',
            height: "100%",
            mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
            repeatMode: Titanium.Media.VIDEO_REPEAT_MODE_ONE,
        });

        // checks duration
        $.full_video.addEventListener('durationavailable', function(e) {
            Ti.API.info('DURATION.AVAILABLE: ', e);
            checkDuration(e);
            $.full_video.play();
        });

        // on every playback state change
        $.full_video.addEventListener('playbackstate', function(e) {
            if (e.playbackState == 1) {
                var vDuration = $.full_video.getDuration();
                var vCurrentPBT = $.full_video.getCurrentPlaybackTime();
                var vLaunchPreviewTime = vDuration - 10000 || 10000;
                Ti.API.info('Timings: ', vDuration, vCurrentPBT, vLaunchPreviewTime);
            }
        });





    }

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
	    })


	    $.title.animate(title_anim);


	}

}



Ti.App.addEventListener('cage/workout/slide/entered', function(e) {

	 resetCounter();
	if( _.size($.full_video_wrapper.children) > 0 ){
		// $.full_video.removeEventListener('durationavailable');
		$.full_video.stop();
		$.full_video_wrapper.remove($.full_video);
		Ti.API.info('VIDEO.REMOVED');
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
