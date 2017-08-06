var args = $.args;
var user = JSON.parse( Ti.App.Properties.getString('user') ) || {};

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

function fetchData(){

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





// $.refresher.addEventListener('click',function(e){
// 	Ti.API.info('ENABLE.FEATURE',e, e.source);
// 		var mode = 'edit';
// 		_.each($.wlist.sections,function(section,index){
// 			var sec = $.wlist.sections[index];
// 			var els = sec.getItems();
// 			_.each(els,function(item){
// 				// Ti.API.info('==== ITEM:',item.properties.launch_data.ID);
				
// 				if(mode=='insert'){
// 					item.properties.canEdit=false;
// 					item.properties.canInsert=true;
// 				}
// 				else if(mode=='edit'){
// 					item.properties.canEdit=true;
// 					item.properties.canInsert=false;
// 				}
// 				else if(mode=='replace'){
// 					item.properties.canEdit=false;
// 					item.properties.canInsert=false;
// 				}
// 			});
// 			sec.replaceItemsAt(0,_.size(els),els);
// 		});

// 		$.wlist.canEdit=true;
// 		// $.wlist.setEditing(true);

// });







function onWorkoutRenameSuccess(e){
	Ti.API.info('WORKOUT.RENAME.SUCESS:',e);

}




function onWorkoutTrashSuccess(e){
	Ti.API.info('WORKOUT.TRASH.SUCESS:',e);

}



$.wlist.canEdit=true;
$.wlist.addEventListener('editaction',function(e){


	Ti.API.info('MY.WORKOUTS.RENAME.TRIGGERED',e);
	var item = e.section.getItemAt(e.itemIndex);

	if(e.identifier == 'rename_workout'){
		Ti.API.warn('UPDATE.WITH.ID:',item.properties.id);
		var prepared = { itle:'Testing DYNAMIC Renaming of Workout'};
		var data = JSON.stringify(prepared);
		var my_workout_url = Alloy.CFG.api_url + Alloy.CFG.user_workout_path + '/' + item.properties.id;

		xhr.POST(my_workout_url, data, onWorkoutRenameSuccess, onErrorCallbackSilent);
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

// $.wlist.addEventListener('editactions',function(e){
// 	Ti.API.info('MY.WORKOUTS.TRASH.TRIGGERED',e);
// 	var item = e.section.getItemAt(e.itemIndex);
// 	if(item){
// 		Ti.API.warn('DELETING.WITH.ID:',item.properties.id);
// 		var prepared = { id:item.properties.id};
// 		var data = JSON.stringify(prepared);
// 		xhr.POST('https://cagefitness.com/wp-json/app/v1/workout/trash', data, onWorkoutTrashSuccess, onErrorCallbackSilent);
// 	}
// });


function onSuccessMyWorkout(e){
	
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
				title:{text: item.title.rendered},
				customize:{text:'CUSTOMIZE'},
				begin:{text:'BEGIN'},

			};
		});
		$.wlist.sections[0].setItems(items);
		Ti.API.info('WKT.ITEMS:', my_wkt , items)

		// var section = $.wlist.sections[0];
		// var item = section.getItemAt(0);
		// Ti.API.info('LITEM',item);
		// item.title = my.title.rendered+ '-->'+my.date;
		// Ti.API.info('LITEM',item.title);

	}
}

function myRefresher(){
	init_profile();
}

function onErrorCallbackSilent(e){
    Ti.API.info('ERROR.PROFILE: ',e);
    // Animation.shake($.login_panel);
}


