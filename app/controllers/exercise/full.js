var args = $.args;
var url = $.args.url || "https://cagefitness.com/wp-content/uploads/import/CFA-BodyWeight-3PointPushupsAlternating.mp4";
var video_data = $.args.video_data || {};
Ti.API.info('VIDEO.DATA.FROM.FULL:',video_data);

// $.videoPlayer.url = video_data.url;
$.title.text = video_data.title;






function onDurationAvailable(e) {
	    videoDuration = e.duration / 1000;
	    Ti.API.info('GETTING.VIDEO.DURATION: ' + videoDuration);
    	setTimeout(function(){
		    Animation.fadeIn($.full_video, 500, function(){
		    	$.full_video.play();
		    });
    	},500);
}





var createVideoPlayer = function() {


    if (video_data.url != null) {
       Ti.API.info('VIDEO.TO.BE.CREATED:',video_data.url);
        $.full_video = Titanium.Media.createVideoPlayer({
            url: video_data.url,
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


  	}

}

createVideoPlayer();
$.full_video_wrapper.add($.full_video);




	    	