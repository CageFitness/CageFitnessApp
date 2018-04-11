
var args = $.args;
var scrollable = args.scrollableref;

function fancyTimeFormat(time){   
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




var id = args.id || 'v565989';
var title = args.title || '';
var subtitle = args.subtitle || '';

var round = args.round || [];
var item_index = args.item_index || 0;
var file_index = args.file_index || 0;
var round_number = args.round_number || '';

var exercise_number = args.exercise_number || 5;
var exercise_equipment = args.exercise_equipment || 'body-weight';
var exercise_type = args.exercise_type || 'combo';
var duration = args.duration || 30;
// $.overview.backgroundColor = getRandomColor();
var items = [];
var PLAYING=0;
// Ti.API.info('CONFIG.OVERVIEW.DURATION.FIRST', args.first_slide);
// var _WKT = args.workout_window;
// var _WKT = args.winref;

// gets first slide duration or normal oversion duration from configuration
var overview_duration = (args.first_slide ? args.config.acf.duration_first : args.config.acf.duration_break );
var counter = overview_duration;



var stopped_at;
var toggle=0;
// TIMER RELATED
var preview_timer = overview_duration;
var increment = -(1/preview_timer);


$.overview.backgroundColor = '#fff';
	$.title.text = title;
	$.title_type.text = exercise_type.label;
	if(args.type!='static'){
		$.subtitle.text = 'Equipment: ' + exercise_equipment.label;
		$.counter_big.text = fancyTimeFormat(counter);
	}
	else{
		$.counter_big.text = '';
	}
	

var initialize = _.after(2,triggerFirstSlide);

if(args.first_slide){
	Ti.App.addEventListener('/cage/workout/start',initialize);
}


function triggerFirstSlide(){
	Ti.API.info('OVERVIEW.FIRST.SLIDE: ',args.first_slide);
	Ti.API.info('************************************************************************************');
	Ti.API.warn('OVERVIEW.FIRST.SLIDE.WORKOUT.WINDOW.AWARE');
	Ti.API.info('************************************************************************************');

	if(args.first_slide ){

		startCounter();
		Ti.App.removeEventListener('/cage/workout/start',initialize);
		


	}
}




function onPlayPause(e){
	if(e.item===item_index){
		Ti.API.info('PLAY.PAUSE.ON.OVERVIEW: ',e, item_index);
		// USE THE TOGGLE HERE
		if(e.action=='pause'){
			pauseCounter();
		}
		else if (e.action=='resume'){
			resumeCounter();
		}
		

	}
}



function onOwlSlideEntered(e) {

	// resetCounter();
    if (e.item === item_index) {
        Ti.API.info('PREVIEW.FINISHED.CALLED:' + e.item, item_index);
        animateOverviewSlide(e.item);

    }
}




function animateOverviewSlide(key) {
	if(key == item_index){
		resetCounter();
		$.counter_big.applyProperties({text:fancyTimeFormat(counter)});
	    Animation.popIn($.counter_big,function(e){
	        Ti.API.info('OVERVIEW.INTRO.ANIMATION.ENDED');
	        
	        startCounter();	    	
	    });
	}
}






var _PROGRESS = 1;
var _PROGRESS_TEXT;

function resetCounter(){
	clearInterval(Alloy.Globals.Timer);
	_PROGRESS = 1;
	_PROGRESS_TEXT = Math.round(_PROGRESS * preview_timer);	
}




function pauseCounter(){
	stopped_at = Alloy.Globals.Timer;
	Ti.API.info('STOPPING.AT: ',stopped_at );
	clearInterval(Alloy.Globals.Timer);
}


function resumeCounter(){
	Alloy.Globals.Timer = stopped_at;
	startCounter();
}


// Ti.App.addEventListener('resume', onPlayPause);
// Ti.App.addEventListener('pause', function(e){
// 		pauseCounter();
// });

// Ti.App.addEventListener('resume', function(e){
//  		resumeCounter();
// });


Ti.App.addEventListener('pause', function(){
	onPlayPause({item:scrollable.currentPage, action:'pause'});
});


Ti.App.addEventListener('resume', function(){
	onPlayPause({item:scrollable.currentPage, action:'resume'});
});



function stopCounter(){
	// stops and reset the counter;

}

// var REPLACEMENT1=0;
// var REPLACEMENT2=0;

function startCounter() {
	if(scrollable.currentPage === item_index){
	    Alloy.Globals.Timer = setInterval(function() {
	        _PROGRESS += increment;
	        if (_PROGRESS_TEXT == 1) {
	            clearInterval(Alloy.Globals.Timer);
	            Ti.API.info('STOP.OVERVIEW!!!!');

	            	Alloy.Globals.playBuzz();
	                Ti.App.fireEvent('cage/video/progressbar/finished',{'index':item_index});
	            
	        }
	        var pr = Math.abs(Math.round(_PROGRESS * preview_timer));
	        Ti.API.info('TIMER.GOING.OVERVIEW:',pr);
	       	if(pr >= 0){
	       		_PROGRESS_TEXT = pr;
	  			$.counter_big.applyProperties({text:fancyTimeFormat(pr)}); 
	       		Animation.popIn($.counter_big);
	       	}
	    }, 1000);
	}

}





function getIndex(n){
	r = Number(n)+1; 
	return r;
}

function getExerciseDuration(round_size){
	// Ti.API.info('======= >>>> ENSURE.CONFIG:', 'MINS:', args.config.acf.duration_break, 'ROUND.SIZE:', round_size );
	var duration_ob = _.findWhere( args.config.acf.round_configs, {'config_round_num':round_size} );
	return duration_ob||35;
}

function describeRound2(){
	_.each(round,function(item,index){

		var duration;
		if(_.size(round)-1 === index){
			// Ti.API.info('this is last', index, exercise_number, getExerciseDuration(exercise_number));
			Ti.API.info('LAST.EXERCISE.DURATION.FIX:',exercise_number);
			duration = getExerciseDuration(exercise_number).config_round_duration_last;
		}
		else{
			duration = getExerciseDuration(exercise_number).config_round_duration;
		}

		var ob = {
			// rpic:{image:item.acf.video_featured.url},
			properties:{height:30},
			name:{text:item.post_title},
			rxIndex:{color:'#090', text:round_number+"."+getIndex(index)},
			duration:{text:fancyTimeFormat(duration)}
		}

		items.push(ob);
	});
	

}

function describeRound(){
	for (each in round){
		var o = round[each];

	// duration_config
	var last = '';
	if(each === (round.length - 1)){
       last = 'last';
    }

		var ob = {
			properties:{height:30},
	        // mass : {text : o.ID}, 
	        name : {text : o.post_title + 'test'},
	        // number : { text : round_number},
	        rxIndex : { color : "#090", text : round_number+"."+getIndex(each)},
	        // slide_data : {text: getIndex(each) +' | '+duration}
	    }

	    items.push(ob);
	}
}

describeRound2();
$.elementsList.sections[0].setItems(items);


Ti.App.addEventListener('cage/workout/video/play_pause',onPlayPause);
Ti.App.addEventListener('cage/workout/slide/entered', onOwlSlideEntered);
Ti.App.addEventListener('cage/workout/start', triggerFirstSlide);


$.cleanup = function cleanup() {
	// Ti.API.info('OVERVIEW.CLEANUP:');

	args.winref.removeEventListener('close', $.cleanup);

	Ti.App.removeEventListener('cage/workout/video/play_pause',onPlayPause);
	Ti.App.removeEventListener('cage/workout/slide/entered', onOwlSlideEntered);
	Ti.App.removeEventListener('cage/workout/start', triggerFirstSlide);

	$.elementsList.removeAllChildren();
	$.elementsList = null;	

	$.destroy();
	$.off();
	args.winref = null;
	scrollable = null;
};
args.winref.addEventListener('close', $.cleanup);

initialize();

