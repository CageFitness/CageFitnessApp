// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var id = args.id || 'v565989';
var title = args.title || '';
var subtitle = args.subtitle || '';

var round = args.round || [];
var item_index = args.item_index || 0;
var file_index = args.file_index || 0;
var round_number = args.round_number || '';

var exercise_number = args.exercise_number || '';
var exercise_equipment = args.exercise_equipment || '';
var exercise_type = args.exercise_type || '';
var duration = args.duration || 30;
// $.overview.backgroundColor = Utils.getRandomColor();

// Ti.API.info('CONFIG.OVERVIEW.DURATION.FIRST', args.first_slide);


// gets first slide duration or normal oversion duration from configuration
var overview_duration = (args.first_slide ? args.config.acf.duration_first : args.config.acf.duration_break );
var counter = overview_duration;

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
	

var items = [];






Ti.App.addEventListener('cage/workout/video/play_pause',onPlayPause);





function onPlayPause(e){
	if(e.item===item_index){
		Ti.API.info('PLAY.PAUSE.ON.OVERVIEW: ',e, item_index);
	}
}



















// var preview_timer = overview_duration;
var preview_timer = overview_duration;

var increment = -(1/preview_timer);

function resetCounter(){
	clearInterval(Alloy.Globals.Timer);
	$.progressbar.progress = 1;
	$.progressbar.text = Math.round($.progressbar.progress * preview_timer);	
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

function stopCounter(){
	// stops and reset the counter;

}



function startCounter() {

    Alloy.Globals.Timer = setInterval(function() {

        $.progressbar.progress += increment;

        if ($.progressbar.text == 1) {
            //this clear Interval needs to be removed when closing the progress window.
            clearInterval(Alloy.Globals.Timer);
            Ti.API.info('STOP.VIDEO!!!!');
            Animation.fadeOut($.progressbar, 500, function() {
                // $.gifImage.stop();
                // Ti.App.fireEvent('cagefitness_app_preview_finished', { 'video': args.data_title });
                
                Ti.App.fireEvent('cage/video/progressbar/finished',{'index':item_index});

            });
        }
        var pr = Math.abs(Math.round($.progressbar.progress * preview_timer));
        Ti.API.info('TIMER.GOING:',pr);
       	if(pr >= 0){
       		$.progressbar.text = pr;
       		$.counter_big.text = fancyTimeFormat(pr);
       	}

    }, 1000);

}




















function getIndex(n){
	r = Number(n)+1; 
	return r;
}

function getExerciseDuration(round_size){
	var cfg = args.config;
	var duration_ob = _.findWhere( cfg.acf.round_configs, {'config_round_num':round_size} );
	return duration_ob;
}

function describeRound2(){
	_.each(round,function(item,index){

		var duration;
		if(_.size(round)-1 === index){
			// Ti.API.info('this is last', index, exercise_number, getExerciseDuration(exercise_number));
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

Ti.API.info('FIRST.SLIDE: ',args.first_slide);
if(args.first_slide){
	startCounter();
}




