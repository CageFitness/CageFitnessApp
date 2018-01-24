
var args = $.args;

var a = Ti.UI.createAnimation({duration: 700, top:-200});
var b = Ti.UI.createAnimation({duration: 300, top:0});

// var config = JSON.parse( Ti.App.Properties.getString('config') );
// Ti.API.warn('ROUND.CONFIGS.PROGRAMS:',config);


var newtop = Ti.Platform.displayCaps.platformHeight + 20;
function doBox2(e) {
    $.box2.animate({
    	top:newtop,
    	duration:2000,
    	autoreverse: true
    });
}


function moveItem(item){
	Ti.API.info('ANIMATION.SUBJECT: ',item);
}

function programItemClick(e) {
	Ti.API.warn('PROGRAM.EVENT.BUTTON.CLICK: ',e.source.programId);
	// Ti.API.info('ITEM.CLICKED.EXERCISE...', e.source.data);
	LaunchProgram(e);
}


function LaunchProgram(e) {
	Ti.API.info('LAUNCHING.PROGRAM.WINDOW.WITH:', e);
   
    // var win = Alloy.createController('window').getView();
    // win.open({modal:true});

   var win = Alloy.createController('window',{type:'program', programId:e.source.programId}).getView();
    win.open({modal:true});

    Alloy.Globals.modalWindow = win;
}