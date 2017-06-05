// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// var the_image = args.image || '';
// var the_title = args.title || '';

// $.thumb.image = the_image;
// $.thumb_title.text = the_title;
var user = JSON.parse( Ti.App.Properties.getString('user') ) || {};

Ti.API.info('USER:',user);



function handleListViewClick(e){
	Ti.API.info(e);
	// $.pimage.image = user.avatar_urls[0];
	setAvatar();
}

function fetchData(){

}

function init_profile(){
	user = JSON.parse( Ti.App.Properties.getString('user') ) || {};
	$.user_complete_name.text = user.name;
	$.user_username.text = user.slug;
	getMyWorkout();
	setAvatar();
	Ti.API.info('PROFILE IMAGE: ', user.avatar_urls['96'] );
}

// Ti.App.addEventListener('cage')
Ti.App.addEventListener('cage/login/authenticate',init_profile);

function setAvatar(){
	$.pimage.image = user.avatar_urls['96'];
}

function getMyWorkout(){
	// ?author=617&per_page=1
	
}