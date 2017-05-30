var animation = require('alloy/animation');
var args = $.args;

var id = args.id || 'v565989';
var title = args.title || 'Video Title One';
var subtitle = args.subtitle || 'Video Subtitle Test';
var counter = args.counter || '00:00';
var item_index = args.item_index || null;
var video = args.video || null;

$.vid.backgroundColor = Utils.getRandomColor();
$.title.text = title;
$.subtitle.text = subtitle;
$.counter.text = counter;
// $.video_player_thumb.image = args.thumb;

// args.index.hello($);

exports.sayHello = function() {
    Ti.API.info('IM SAYING HELLO');
}


function createVideoPlayer() {
    if (video != null) {
        $.full_video = Titanium.Media.createVideoPlayer({
            url: args.video,
            opacity: 0,
            autoplay: false,
            backgroundColor: '#fff',
            height: "100%",
            mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
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
	        duration: 200,
	        opacity: 0,
	        left: 20,
	        autoreverse: true,
	        repeat: 1
	    });

	    title_anim.addEventListener('complete', function(e) {
	        Ti.API.info('INTRO.ANIMATION.ENDED');
	        createVideoPlayer();
	    })


	    $.title.animate(title_anim);

		
	}

}



Ti.App.addEventListener('cage/workout/slide/entered', function(e) {
    if (e.item === item_index) {
        Ti.API.info('PREVIEW.FINISHED.CALLED:' + e.item, item_index);
        animateVideoSlide(e.item);
    }
});
