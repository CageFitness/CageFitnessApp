var args = $.args;
var user = JSON.parse( Ti.App.Properties.getString('user') ) || {};
var to_rename = {};
Ti.API.info('USER:',user.name, user.slug);




function handleListViewClick(e){
	Ti.API.info(e);
	var item = e.section.getItemAt(e.itemIndex);

	var newID = item.properties.id;
	if(newID > 0){
		Ti.App.Properties.setString('my_workout',newID);
	}

	if(e.bindId == 'customize'){
		Ti.API.info('LAUNCH.CUSTOMIZER.WITH',newID);
		Ti.App.fireEvent('cage/launch/customizer',{menu_id:'menu_customizer'});
	}
	else{
		Ti.API.warn('LAUNCH.WORKOUT.PLAYER.WITH: ',newID);
		var wkt = Ti.App.Properties.getString('my_workout');
		Ti.App.fireEvent('cage/launch/window',{key:'menu_workouts', 'workout_id':wkt});		
	}

}


function init_profile(){

	user = JSON.parse( Ti.App.Properties.getString('user') ) || {};
	$.user_complete_name.text = user.name;
	$.user_username.text = user.slug;
	setAvatar();
	Ti.API.info('PROFILE IMAGE: ', user.avatar_urls['96'] );
	getMyWorkouts(user);
}


Ti.App.addEventListener('cage/profile/reload',init_profile);

Ti.App.addEventListener('cage/login/authenticated',init_profile);

function setAvatar(){
	$.pimage.image = user.avatar_urls['96'];
}

function getMyWorkouts(usr){
	// ?author=617&per_page=1
	var data = {
		'author':usr.id,
		'per_page':1,
	}
   var my_workout_url = Alloy.CFG.api_url + Alloy.CFG.user_workout_path;
   Ti.API.info('MY.WORKOUT.CALLED: ',usr.id, my_workout_url+'?author='+usr.id+ '&per_page=20');
   xhr.GET(my_workout_url+'?author='+usr.id+ '&per_page=20', onSuccessMyWorkout, onErrorCallbackSilent, Alloy.Globals.XHROptions);
   // xhr.GET(my_workout_url+'?author='+usr.id+ '&per_page=1', onSuccessMyWorkout, onErrorCallbackSilent);
}









function onWorkoutRenameSuccess(e){
	Ti.API.info('WORKOUT.RENAME.SUCESS:',e);

}




function onWorkoutTrashSuccess(e){
	Ti.API.info('WORKOUT.TRASH.SUCESS:',e);

}

function renameWorkout(){
		// var prepared = { id:item.properties.id, title:'Testing DYNAMIC Renaming of Workout'};
		var data = JSON.stringify(to_rename);
		var my_workout_url = Alloy.CFG.api_url + Alloy.CFG.user_workout_path + '/' + to_rename.id;
		Ti.API.warn('UPDATE.WITH.ID:',to_rename.id, to_rename.title);
		$.refresh.beginRefreshing();
		xhr.POST('https://cagefitness.com/wp-json/app/v1/workout/rename', data, onWorkoutRenameSuccess, onErrorCallbackSilent);
}

$.wlist.canEdit=true;
$.wlist.addEventListener('editaction',function(e){


	Ti.API.info('MY.WORKOUTS.RENAME.TRIGGERED',e);
	var item = e.section.getItemAt(e.itemIndex);

	if(e.identifier == 'rename_workout'){
		

	    Ti.API.info('BEFORE.POPOVER.WORKOUT.RENAME');
	    to_rename = { id:item.properties.id, title:'Default Workout'};
	    var new_workout_name_popover = Alloy.createController('builder/create', {follow:renameWorkout, data:to_rename, row:e.itemIndex} ).getView();
	    Ti.API.info('AFTER.POPOVER.WORKOUT.RENAME');
	    new_workout_name_popover.show({animated:true,view:e.source});




	}
	else if(e.identifier == 'trash_workout'){
		Ti.API.warn('DELETING.WITH.ID:',item.properties.id, e.section);
		var prepared = { id:item.properties.id};
		var data = JSON.stringify(prepared);
		
		if(e.section){
			e.section.deleteItemsAt(e.itemIndex,1,true);
		}

		xhr.POST('https://cagefitness.com/wp-json/app/v1/workout/trash', data, onWorkoutTrashSuccess, onErrorCallbackSilent);

	}



});




function onSuccessMyWorkout(e){
	$.refresh.endRefreshing();
	if(_.size(e.data) > 0){


		var my = e.data;
		var my_wkt = e.data[0].id;
		Ti.App.Properties.setString('my_workout', my_wkt);

		Ti.API.info('===================================');
		Ti.API.info('===================================');
		Ti.API.info(my_wkt, e.data[0].post_title);
		Ti.API.info('===================================');
		Ti.API.info('===================================');
		Ti.API.info('MY.WORKOUT.DATA.VALID: ',e.data[0].id);



		var items = _.map(my, function(item) {
			// var decoded = 'COOL &amp; THE GANG &Aacute; &lt; a acute &#8211;';
			// var decoded = tihtml.stringByEncodingHTMLEntitiesUnicode('COOL &amp; THE GANG &Aacute; &lt; a acute');

			return {
				template:'ProfileListItem',
				properties: {
					height:60,
					// backgroundColor:'red',
					title: item.title.rendered,
					id: item.id,
					slug:item.slug,
					modified:item.modified,
					accessoryType:Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
					canEdit:true,
					editActions:[
						{
							color:'red',
							identifier:'trash_workout',
							style: Titanium.UI.iOS.ROW_ACTION_STYLE_DESTRUCTIVE,
							title: 'Trash',
						},
						{
							color:'black',
							identifier:'rename_workout',
							style: Titanium.UI.iOS.ROW_ACTION_STYLE_DESTRUCTIVE,
							title: 'Rename',
						}						
					]
				},
				title:{text: TUtil.decodeHtmlEntity(item.title.rendered)},
				customize:{text:'CUSTOMIZE'},
				begin:{text:'BEGIN'},

			};
		});
		$.wlist.sections[0].setItems(items);


	}
}

function fetchData(e){
	Ti.API.info('PULL.TO.REFRESH.CALLED:',e);
	init_profile();
}

function onErrorCallbackSilent(e){
    Ti.API.info('ERROR.PROFILE: ',e);
    // Animation.shake($.login_panel);
}
