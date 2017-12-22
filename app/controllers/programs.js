
var args = $.args;

var a = Ti.UI.createAnimation({duration: 700, top:-200});
var b = Ti.UI.createAnimation({duration: 300, top:0});

function moveItem(item){
	Ti.API.info('ANIMATION.SUBJECT: ',item);
}

function programItemClick(e) {
	Ti.API.info('PROGRAM.EVENT.BUTTON.CLICK: ',e);
	// Ti.API.info('ITEM.CLICKED.EXERCISE...', e.source.data);
	LaunchProgram(e);
}


function LaunchProgram(e) {
	Ti.API.info('LAUNCHING.PROGRAM.WINDOW.WITH:', e);
   
    // var win = Alloy.createController('window').getView();
    // win.open({modal:true});

   var win = Alloy.createController('window',{type:'program'}).getView();
    win.open({modal:true});

    Alloy.Globals.modalWindow = win;
}