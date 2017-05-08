// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
var animation = require('alloy/animation');
var DownloadManager = require('download-manager');
Alloy.Globals.progressWin = $.progressWin;


var videos = [
    { thumb: "images/thumbs/v1.gif", type: "", duration:17, title: "3 ONE Points Jump Squats Alternating Sides", id: "v7", video: "videos/CF-App-3PointJumpSquatsAlternatingSides.mp4" },
    { thumb: "images/thumbs/v1.gif", type: "", duration:29, title: "3 TWO Points Squats Alternating Sides", id: "v8", video: "videos/CF-App-3PointSquatsAlternatingSides.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "", duration:16, title: "Sumo Squats", id: "v9", video: "videos/CF-App-SumoSquats.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "", duration:17, title: "Sprinter Lunges Alternating Sides", id: "v10", video: "videos/CF-App-SprinterLungesAlternatingSides.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "", duration:17, title: "Forward and Reverse Lunges Alternating Sides", id: "v11", video: "videos/CF-App-ForwardAndReverseLungesAlternatingSides.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "", duration:24, title: "Multi Plantar Lunges", id: "v12", video: "videos/CF-App-MultiPlantarLunges.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "Medicine Ball", duration:24, title: "Squat Clean With Press Alternating", id: "v1", video: "videos/CF-App-MedicineBall-SquatCleanWithPressAlternating.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "Medicine Ball", duration:12, title: "Muffin Busters", id: "v2", video: "videos/CF-App-MedicineBall-MuffinBusters.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "Medicine Ball", duration:15, title: "Four Point Wood Choppers", id: "v3", video: "videos/CF-App-MedicineBall-FourPointWoodChoppers.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "Medicine Ball", duration:12, title: "Sideway Knockouts Alternating", id: "v4", video: "videos/CF-App-MedicineBall-SidewayKnockoutsAlternating.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "Medicine Ball", duration:20, title: "Squat and Press with 90 Degree Hop", id: "v5", video: "videos/CF-App-MedicineBall-SquatAndPressWith90DegreeHop.mp4" },
    // { thumb: "images/thumbs/v1.gif", type: "Medicine Ball", duration:17, title: "Alternating Lunges with Posterior Reach", id: "v6", video: "videos/CF-App-MedicineBall-AlternatingLungeWithPosteriorReach.mp4" },
];


var previewInterval;
var videoDuration,step;
Alloy.Globals.current_video = 0;


Ti.App.addEventListener('cagefitness_app_preview_finished', function(e){
	Ti.API.info('PREVIEW.FINISHED.CALLED:'+Alloy.Globals.current_video,e.video);
	removePreviousVideoAssets();
	loadNextVideo(Alloy.Globals.current_video);
	
	Alloy.Globals.current_video++;

});


function closeWindow(e) {
	//IMPORTANT: DESTROY ALL COUNTERS BEFORE LEAVING.
	// Alloy.Globals.current_video=0;
	// introIntervalCounter=0;
	// removePreviousVideoAssets();
    $.progressWin.close({});
}

function shouldWork(e){
    Ti.API.info('WORKING');
}

function checkDuration(e){
	videoDuration = e.duration/1000;
	Ti.API.info('GETTING.VIDEO.DURATION: '+videoDuration);
	$.full_video_wrapper.add($.full_video);
	animation.fadeIn($.full_video,500);
}

function killAllCounters(){
	//kill all counters here
}

function removePreviousVideoAssets(){
	$.prevs.remove($.prev);
	// $.full_video.stop();
	$.full_video_wrapper.remove($.full_video);
}


function addPreview(val){
	var vid = val;
	Ti.API.info('LOADING.VIDEO.NUMBER: '+vid);
	$.prev = Alloy.createController('preview', {
		opacity:0,
		data_title: 'Up Next...',
		data_description: videos[vid].title,
		data_duration:10,
		data_video:videos[vid].video,
		data_thumb:videos[vid].thumb,
		}).getView();
	$.prevs.add($.prev);
	animation.fadeIn($.prev,500,function(){
		Ti.API.info('PREVIEW.ADDED.AND.FADED');
	});
}

function loadNextVideo(val){
	
	var vid = val;
	// !(vid in videos)
	//  
	if( vid in videos ) {

		// creates video player
		$.full_video = Titanium.Media.createVideoPlayer({
			url:videos[vid].video,
			opacity:0,
			autoplay:false,
			backgroundColor: '#fff',
			height:"100%",
			mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
		});

		// checks duration
		$.full_video.addEventListener('durationavailable',function(e){
			checkDuration(e);
		});

		// on every playback state change
		$.full_video.addEventListener('playbackstate',function(e){
			if(e.playbackState == 1){

				var vDuration = $.full_video.getDuration();
				var vCurrentPBT = $.full_video.getCurrentPlaybackTime();
				var vLaunchPreviewTime = vDuration - 10000 || 10000;
				Ti.API.info('Timings: ', vDuration, vCurrentPBT, vLaunchPreviewTime);

				$.current_video_title.setText(videos[vid].title);
				//Show Preview when only 10 seconds left...
				setTimeout(function(){
					addPreview(vid);
				},vLaunchPreviewTime)
			}
		});

		
		$.full_video.play();
	}
	
}

function pulseCounter(){
	Ti.API.info('REDUCE MAIN COUNTER BY ONE...'+introIntervalCounter);
	$.number_counter.setText(introIntervalCounter);
	// a.removeEventListener('start',pulseCounter);
	if(introIntervalCounter <=0){
		introIntervalCounter=10;
	}
	else{
		introIntervalCounter--;	
	}
}

//Shrink Animations
var cT = Ti.UI.create2DMatrix();
cT = cT.scale(1.1);
var cTDown = Ti.UI.create2DMatrix();
cTDown = cTDown.scale(1);
var a = Ti.UI.createAnimation({duration: 300, opacity: 1, transform: cT});
var b = Ti.UI.createAnimation({duration: 700, opacity: 0.9, transform: cTDown});

animation.chainAnimate($.intro,[ a,b, a,b, a,b, a,b, a,b, a,b, a,b, a,b, a,b, a,b ], function(){
	animation.fadeAndRemove($.intro, 500, $.preview_container,function(){
		Ti.API.info('ENDED');

		loadNextVideo(Alloy.Globals.current_video);

	});
});

var introIntervalCounter=10;
a.addEventListener('start',pulseCounter);







