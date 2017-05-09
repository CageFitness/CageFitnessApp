// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var animation = require('alloy/animation');



var videos = [
    { thumb: "images/v5.png", type: "Medicine Ball", duration:24, title: "Squat Clean With Press Alternating", id: "v1", video: "videos/CF-App-MedicineBall-SquatCleanWithPressAlternating.mp4" },
    { thumb: "images/v2.png", type: "Medicine Ball", duration:12, title: "Muffin Busters", id: "v2", video: "videos/CF-App-MedicineBall-MuffinBusters.mp4" },
    { thumb: "images/v3.png", type: "Medicine Ball", duration:15, title: "Four Point Wood Choppers", id: "v3", video: "videos/CF-App-MedicineBall-FourPointWoodChoppers.mp4" },
    { thumb: "images/v4.png", type: "Medicine Ball", duration:12, title: "Sideway Knockouts Alternating", id: "v4", video: "videos/CF-App-MedicineBall-SidewayKnockoutsAlternating.mp4" },
    { thumb: "images/v2.png", type: "Medicine Ball", duration:20, title: "Squat and Press with 90 Degree Hop", id: "v5", video: "videos/CF-App-MedicineBall-SquatAndPressWith90DegreeHop.mp4" },
    { thumb: "images/v3.png", type: "Medicine Ball", duration:17, title: "Alternating Lunges with Posterior Reach", id: "v6", video: "videos/CF-App-MedicineBall-AlternatingLungeWithPosteriorReach.mp4" },
    { thumb: "images/v4.png", type: "", duration:17, title: "3 Points Jump Squats Alternating Sides", id: "v7", video: "videos/CF-App-3PointJumpSquatsAlternatingSides.mp4" },
    { thumb: "images/v1.png", type: "", duration:29, title: "3 Points Alternating Sides", id: "v8", video: "videos/CF-App-3PointSquatsAlternatingSides.mp4" },
    { thumb: "images/v2.png", type: "", duration:16, title: "Sumo Squats", id: "v9", video: "videos/CF-App-SumoSquats.mp4" },
    { thumb: "images/v3.png", type: "", duration:17, title: "Sprinter Lunges Alternating Sides", id: "v10", video: "videos/CF-App-SprinterLungesAlternatingSides.mp4" },
    { thumb: "images/v4.png", type: "", duration:17, title: "Forward and Reverse Lunges Alternating Sides", id: "v11", video: "videos/CF-App-ForwardAndReverseLungesAlternatingSides.mp4" },
    { thumb: "images/v1.png", type: "", duration:24, title: "Multi Plantar Lunges", id: "v12", video: "videos/CF-App-MultiPlantarLunges.mp4" },
    { thumb: "images/v1.png", type: "", duration:24, title: "Multi Plantar Lunges", id: "v12", video: "videos/CF-App-MultiPlantarLunges.mp4" },
    { thumb: "images/v1.png", type: "", duration:24, title: "Multi Plantar Lunges", id: "v12", video: "videos/CF-App-MultiPlantarLunges.mp4" },
    { thumb: "images/v1.png", type: "", duration:24, title: "Multi Plantar Lunges", id: "v12", video: "videos/CF-App-MultiPlantarLunges.mp4" },
    { thumb: "images/v1.png", type: "", duration:24, title: "Multi Plantar Lunges", id: "v12", video: "videos/CF-App-MultiPlantarLunges.mp4" },
];

function timestamp(count) {
    function pad(n) {
        return n < 10 ? "0" + n : n; }
    d = count;
    dash = "-";
    colon = ":";
    return "00" + colon + pad(count);
}

Ti.API.info(timestamp());

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var myTimer = 0;
var myCount = 10;
var player;
var videoCount = 0;
var nextVideoCount = 1;
var int;
// var pval = 55;
animation.fadeOut($.preview, 500);


function displayPreview() {
    animation.fadeIn($.preview, 500);
}

function closeWindow() {
    stopCounter();
    $.workoutWin.close({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT });
}


function playNext() {



    Ti.API.info('play next video...');
    if (videoCount == 12) {
        videoCount = 0;
    } 
    else {
        videoCount++;
    }
    nextVideoCount = videoCount+1;




    player = Titanium.Media.createVideoPlayer({
        top: 145,
        autoplay: false,
        backgroundColor: '#fff',
        height: 450,
        width: 800,
        mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
        // scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
    });
    var newVideo = videos[videoCount].video;
    $.step_8_title.text = videos[videoCount].title;
    $.step_8_Desc2.text = videos[nextVideoCount].type + ' ' + videos[nextVideoCount].title;
    $.videoThumb.height = 120;
    $.videoThumb.width = 180;
    $.videoThumb.image = videos[nextVideoCount].thumb;
    $.ccount.text = videos[videoCount].duration
    $.prog.setValue(videos[videoCount].duration)

    player.url = newVideo;

    $.workoutWin.add(player);
    animation.fadeOut(player, 10);
    animation.fadeIn(player, 1000, function(){
        player.play();
        displayPreview();
    });
    player.addEventListener('complete', function(e) {
        // Ti.API.info(JSON.stringify(e))
        Ti.API.info('CF.EVENT.VIDEO.PLAYED');

        animation.fadeAndRemove(player, 1000,$.workoutWin, function() {
            playNext();
        })
    });

   

}


function stopCounter() {
    myCount = 10;
    clearInterval(int);
    playNext();
    clearTimeout(myTimer);
    starter();
    // Ti.App.fireEvent('appReload', { app_status: 'RELOAD' });
}

function decrease() {
    myTimer = setTimeout(decrease, 1000);

    if (myCount == 10) {
       
    }

    if (myCount < 1) {
        stopCounter();
    } else {

        // Ti.API.info('UNO');
        $.prog.setValue(myCount--);
        $.step_8_title_right.text = '00:' + myCount;
        $.step_8_title_right.text = timestamp(myCount);
        $.counter_number.text = myCount;
        // $.prog.setText(myCount--);
    }
}




function doWorkout() {
    startCounter();
    workout_title = "Workout Title";
    workout_time = 10;
    workout_preview_time = 5;
}


var cT = Ti.UI.create2DMatrix();
cT = cT.scale(2);

var cTDown = Ti.UI.create2DMatrix();
cTDown = cTDown.scale(1);

var a = Ti.UI.createAnimation({
    font: { fontSize: 80 },
    duration: 300,
    opacity: 1,
    transform: cT
});

var b = Ti.UI.createAnimation({
    font: { fontSize: 30 },
    duration: 700,
    opacity: 0.8,
    transform: cTDown
});


function starter(){
  int =  setInterval(function(e) {
        $.counter_number.animate(a);
    }, 1000);    
}



setTimeout(function() {

starter();

}, 1000)

a.addEventListener('complete', function(e) {
    $.counter_number.animate(b);
});

$.prog.showText = true;
$.prog.setValue(0);

setTimeout(function() {
    decrease();
}, 2000);
