// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
// var xhr = new XHR();

// var the_image = args.image || '';
// var the_title = args.title || '';

// $.thumb.image = the_image;
// $.thumb_title.text = the_title;
var user = JSON.parse( Ti.App.Properties.getString('user') ) || {};

Ti.API.info('USER:',user.name, user.slug);


function handleListViewClick(e){
	Ti.API.info(e);
	// $.pimage.image = user.avatar_urls[0];
	// setAvatar();
	var wkt = Ti.App.Properties.getString('my_workout');
	Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts', 'workout_id':wkt});
}

function fetchData(){

}

function init_profile(){
	user = JSON.parse( Ti.App.Properties.getString('user') ) || {};
	$.user_complete_name.text = user.name;
	$.user_username.text = user.slug;
	// getMyWorkout(user);
	setAvatar();
	Ti.API.info('PROFILE IMAGE: ', user.avatar_urls['96'] );
	getMyWorkout(user);
}

Ti.App.addEventListener('cage/login/authenticated',init_profile);

function setAvatar(){
	$.pimage.image = user.avatar_urls['96'];
}

function getMyWorkout(usr){
	// ?author=617&per_page=1
	

	var data = {
		'author':usr.id,
		'per_page':1,
	}
   var my_workout_url = Alloy.CFG.api_url + Alloy.CFG.user_workout_path;
   Ti.API.info('MY.WORKOUT.CALLED: ',usr.id, my_workout_url+'?author='+usr.id+ '&per_page=1');
   xhr.GET(my_workout_url+'?author='+usr.id+ '&per_page=1', onSuccessMyWorkout, onErrorCallbackSilent, Alloy.Globals.XHROptions);
}

function onSuccessMyWorkout(e){
	
	if(_.size(e.data) > 0){



		var elementData = [
			{"name":"Hydrogen", url:"uno.com" },
			{"name":"Helium" },
			{"name":"Lithium" },
			{"name":"Beryllium" },
			{"name":"Boron"	},
			{"name":"Carbon" },
			{"name":"Nitrogen"}
		];




		var my = e.data;
		var my_wkt = e.data[0].id;
		Ti.App.Properties.setString('my_workout', my_wkt);

		Ti.API.info('===================================');
		Ti.API.info('===================================');
		Ti.API.info(my_wkt);
		Ti.API.info('===================================');
		Ti.API.info('===================================');
		Ti.API.info('MY.WORKOUT.DATA.VALID: ',e.data[0].id);



		var items = _.map(my, function(element) {
			return {
				properties: {
					title: element.title.rendered
				}
			};
		});
		$.wlist.sections[0].setItem(items);
		Ti.API.info('WKT.ITEMS:', my_wkt , items)

		// var section = $.wlist.sections[0];
		// var item = section.getItemAt(0);
		// Ti.API.info('LITEM',item);
		// item.title = my.title.rendered+ '-->'+my.date;
		// Ti.API.info('LITEM',item.title);

	}
}

function onErrorCallbackSilent(e){
    Ti.API.info('ERROR.PROFILE: ',e);
    // Animation.shake($.login_panel);
}


