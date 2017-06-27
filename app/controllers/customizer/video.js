var args = $.args;
var url = $.args.url || "https://cagefitness.com/wp-content/uploads/import/CFA-BodyWeight-3PointPushupsAlternating.mp4";
var video_data = $.args.video_data || {};

$.videoPlayer.media = video_data.url;
$.title.text = video_data.title;


Ti.API.info('VIDEO.DATA:',video_data);


$.videoPlayer.addEventListener('durationavailable', onDurationAvailable);
function onDurationAvailable(e) {
	    videoDuration = e.duration / 1000;
	    Ti.API.info('GETTING.VIDEO.DURATION: ' + videoDuration);
	    
    	setTimeout(function(){
    		// $.videoPlayer.show();
		    Animation.fadeIn($.videoPlayer, 500, function(){
		    	$.videoPlayer.play();
		    });
    	},500);
}



