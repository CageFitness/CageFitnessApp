// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;





Alloy.Globals.XHROptions = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};

var xhr = new XHR();


function onSuccessUserCallback(e){
    // big lenght
    Ti.API.info('USER:', e.data);
}



function onSuccessOptionsCallback(e){
    // Ti.API.info('SUCCESS:', e.data);
    Ti.App.Properties.setString('config', e.data );
    var config = JSON.parse( Ti.App.Properties.getString('config') );
    Ti.API.info( 'DURATION BREAK:', config.acf['round_configs'].length );
    Ti.API.info( 'OPTS ROUNDS:', config.acf['opt_rounds'] );
}

function onSuccessCallback(e){
    Ti.App.Properties.setString('user_token', e.data.token);
    Ti.App.Properties.setString('user_email', e.data.user_email);
    var token = Ti.App.Properties.getString('user_token');
    // Ti.API.info('Token:', token, xhr);
    callOptions(token);
}

function onErrorCallback(e){
    Ti.API.info(e);
}

// 
// xhr.clean();
// xhr.purge();

var data = {
    username:'pabloliz_member',
    password:'%SyNuWlj9o4p)nxZ(npsigYk'
}
var opts = {
    // shouldAuthenticate:false,
    parseJSON:true,
    debug:true,
};


function cageAuthenticate(){
    xhr.POST(Alloy.CFG.api_url +'/wp-json/jwt-auth/v1/token', data, onSuccessCallback, onErrorCallback,opts);
}

function callOptions(tkn){
    Ti.API.info('TOKEN: ', tkn);
    var data = {};
    var validate_url = Alloy.CFG.api_url + Alloy.CFG.validate_url;
    var config_url = Alloy.CFG.api_url + Alloy.CFG.config_path;

    xhr.setStaticOptions({
            requestHeaders: [
                {
                    key: 'Authorization',
                    value: 'Bearer '+tkn
                }
            ],
            debug: true    
        });
    xhr.POST(validate_url);
    xhr.GET(config_url, onSuccessOptionsCallback, onErrorCallback);
    // xhr.GET(user_url, onSuccessUserCallback, onErrorCallback, opts);


}

var flashDelay = 0;

Animation.fadeOut($.step_line,0);


function updateStepItem(parent,page){

    var item = parent.children[page];

    item.backgroundColor='#white';
    // Ti.API.info(item.children[0]);
    item.children[0].color="#000";

    Animation.shake(item,flashDelay);


}

function updateSteps(page){
    
    var par = $.step_track;

    for(istep in $.step_track.children){
        // Ti.API.info( JSON.stringify(par.children[istep]) );
        var item = par.children[istep];
        item.backgroundColor="#d9e153";
        item.children[0].color = "#fff";
    }

    if (page == 0 || page == 1) {
      Animation.fadeOut($.step_line,100);
    }

    if (page == 2) {
        updateStepItem(par,0);
    }
    if (page == 3) {
        updateStepItem(par,1);
    }
    if (page == 4) {
        updateStepItem(par,2);
    }
    if (page == 5) {
        updateStepItem(par,3);
    }
    if (page == 6) {
        updateStepItem(par,4);
    }
    if (page == 7) {
        updateStepItem(par,5);
    }
    if (page == 8) {
       updateStepItem(par,6);
    }

}

$.login_box.addEventListener('click',function(e){
    Ti.API.info('THIS WorkS?');
    Animation.fadeIn($.step_line,100);
})
$.scrollableView.addEventListener('scrollend',function(e){
    // Ti.API.info(JSON.stringify(e));
    updateSteps(e.currentPage)
});


// $.list1.addEventListener('itemclick', function(e){
//     var section = $.list1.sections[e.sectionIndex];
//     clickAndFollow(section,e);
// });

// $.listview_step3.addEventListener('itemclick', function(e){
//     // var section = $.listview_step3.sections[e.sectionIndex];
//     // clickAndFollow(section,e);
// });

$.listview_step4.addEventListener('itemclick', function(e){

    var section = $.listview_step4.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);

    // Ti.API.info(JSON.stringify(item));
    // section.updateItemAt(e.itemIndex, item);
    // getNext();

});

function ToggleMe(e){


    e.source.getParent().children[0].backgroundColor = "#ffffff";
    e.source.getParent().children[2].backgroundColor = "#ffffff";
    e.source.backgroundColor="#d9e153"

}

$.listview_step5.addEventListener('itemclick', function(e){
    var section = $.listview_step5.sections[e.sectionIndex];
    clickAndFollow(section,e);
});

$.listview_step6.addEventListener('itemclick', function(e){
    var section = $.listview_step6.sections[e.sectionIndex];
    clickAndFollow(section,e);
});

function clickAndFollow(section,e){
    var item = section.getItemAt(e.itemIndex);
    if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        item.properties.color = 'black';
    }
    else {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        item.properties.color = 'black';
    }
    section.updateItemAt(e.itemIndex, item);
    getNext();
}

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
myTimer = setTimeout(decrease, 1000);
var myCount = 30;

function stepClickHandler(e){
    
    Ti.API.info(e.source.args);

    var item, view
    for (item in $.step_track.children) {
        view = $.step_track.children[item];

    }

}

function nextStep(){


}

function playNextVideo() {
    Ti.API.info('play next video...');
    // $.videoPlayer1.play();
}

function stopCounter() {
    playNextVideo();
    clearTimeout(myTimer);

}

function decrease() {

    // if(myCount<1){
    //  stopCounter();
    //  Ti.API.info('Call Next');
    // }
    // else{
    //  Ti.API.info(myCount);
    //  $.prog.setValue(myCount--);
    //  $.step_8_title_right.text = '00:'+myCount--;
    // }
}

function getNext(){
    $.scrollableView.scrollToView($.scrollableView.currentPage + 1);
}
function stepClick(e) {
    // alert($.step3_5_btn.title);
    Ti.API.info('THISPAGE: ' + $.scrollableView.currentPage);
    getNext();

}


function doProgress(e) {
    // Ti.API.info('TESTING...');
    var win3 = Alloy.createController('progress').getView();
    win3.open({
        // transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
   });
    Alloy.Globals.progressWin = win3;

}



function doWorkout(e) {
    // Ti.API.info('TESTING...');
    var win2 = Alloy.createController('workout').getView();
    Alloy.Globals.win2 = win2;
    win2.open({
        transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
   });
}

function openRoundPopover() {
    var round_popover = Alloy.createController('round_popover').getView();
    round_popover.show({view:$.step3_btn});
    Ti.API.info('Round PopOver Openend');
};

function itemClickBuildWorkout(e){
    // Ti.API.info('TESTING...');
}

function handleClickWorkoutTheme (e) {
  Ti.API.info('working?');
}

function handleClickSelectEquipment (e) {
    Ti.API.info('SELECT EQUIPMENT...');
}


function handleClickBeginWorkout (e) {
     Ti.API.info('BEGIN WORKOUT...');
}


function handleClickBuildWorkout(e) {
     Ti.API.info('BUILD WORKOUT...');
}

function handleClickNumberOfExercises(e) {
    var section = $.pover.sections[e.sectionIndex];
    var item = section.getItemAt(e.itemIndex);
    item.selectorRight.backgroundColor = "#ffffff";
    item.selectorLeft.backgroundColor = "#ffffff";
    e.source.backgroundColor = "#d9e153";

    section.updateItemAt(e.itemIndex, item);
}

function handleClickPopOver(e) {
    Alloy.Globals.currentSelectButton = e.source;
    var round_popover = Alloy.createController('round_popover').getView();
    round_popover.show({animated:true,view:e.source});
}


function stepLineClick(){
    Ti.API.info('clicked...');
}

$.steps.open();

Alloy.Globals.parent = $.steps;
Alloy.Globals.scrollableView = $.scrollableView;
// Alloy.createController('dialog', args).getView().open();
// stepClickHandler();
$.scrollableView.scrollToView(0);


var items = [];

//CUSTOM FUNCTION TO DEFINE WHAT HAPPENS WHEN AN ITEM IN THE GRID IS CLICKED
var showGridItemInfo = function(e){
    alert('Title is: ' + e.source.data.title + '. Image is: ' + e.source.data.image);
};

//INITIALIZE TIFLEXIGRID
$.fg.init({
    columns:3,
    space:5,
    gridBackgroundColor:'#fff',
    itemHeightDelta: 0,
    itemBackgroundColor:'#eee',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0,
    onItemClick: showGridItemInfo
});




//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function createSampleData(){
    
    items = [];
    
    //SOME DATA FOR A GALLERY LAYOUT SAMPLE
    var sample_data = [
        {title:'sample 1', image:'http://www.lorempixel.com/700/600/'},
        {title:'sample 2', image:'http://www.lorempixel.com/900/1200/'},
        {title:'sample 3', image:'http://www.lorempixel.com/400/300/'},
        {title:'sample 4', image:'http://www.lorempixel.com/600/600/'},
        {title:'sample 5', image:'http://www.lorempixel.com/400/310/'},
        {title:'sample 6', image:'http://www.lorempixel.com/410/300/'},
        {title:'sample 7', image:'http://www.lorempixel.com/500/300/'},
        {title:'sample 8', image:'http://www.lorempixel.com/300/300/'},
        {title:'sample 9', image:'http://www.lorempixel.com/450/320/'},
        {title:'sample 10', image:'http://www.lorempixel.com/523/424/'},
        {title:'sample 11', image:'http://www.lorempixel.com/610/320/'},
        {title:'sample 12', image:'http://www.lorempixel.com/450/450/'},
        {title:'sample 13', image:'http://www.lorempixel.com/620/420/'},
        {title:'sample 14', image:'http://www.lorempixel.com/710/410/'},
        {title:'sample 15', image:'http://www.lorempixel.com/500/500/'}
    ];
    
    for (var x=0;x<sample_data.length;x++){
    
        //CREATES A VIEW WITH OUR CUSTOM LAYOUT
        var view = Alloy.createController('item_gallery',{
            image:sample_data[x].image,
            width:$.fg.getItemWidth(),
            height:$.fg.getItemHeight()
        }).getView();
        
        //THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
        var values = {
            title: sample_data[x].title,
            image: sample_data[x].image
        };
        
        //NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA
        items.push({
            view: view,
            data: values
        });
    };
    
    //ADD ALL THE ITEMS TO THE GRID
    $.fg.addGridItems(items);
    
};
createSampleData();


// var items = [
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
// {data: {title : "1"}},
//     ];

// var grid = Alloy.createWidget('com.prodz.tiflexigrid');
// grid.init({
//     width:$.button_matrix.getWidth(),
//     // itemHeightDelta:100,
//     data:items,
//     columns:5,
//     space:5,
//     itemBorderColor:'#f90f90',
//     itemBorderWidth:1,
//     itemBackgroundColor:"#666666",
//     itemBorderRadius:6,
// });
// grid.setOnItemClick(function(e){
//     Ti.API.info('DATA',e);
// });
// $.step2.add( grid.getView() );





// var items = [
//         {
//             mass : {text : "1.00794"}, 
//             name : {text : "Hydrogen"},
//             number : { text : "1"},
//             symbol : { color : "#090", text : "H"}
//         },
//         {
//             mass : {text : "4.002602"}, 
//             name : {text : "Helium"},
//             number : { text : "2"},
//             symbol : { color : "#090", text : "He"}
//         },
//         {
//             mass : {text : "6.941"}, 
//             name : {text : "Lithium"},
//             number : { text : "3"},
//             symbol : { color : "#090", text : "Li"}
//         },
//         {
//             mass : {text : "1.00794"}, 
//             name : {text : "Hydrogen"},
//             number : { text : "1"},
//             symbol : { color : "#090", text : "H"}
//         },
//         {
//             mass : {text : "4.002602"}, 
//             name : {text : "Helium"},
//             number : { text : "2"},
//             symbol : { color : "#090", text : "He"}
//         },
//         {
//             mass : {text : "6.941"}, 
//             name : {text : "Lithium"},
//             number : { text : "3"},
//             symbol : { color : "#090", text : "Li"}
//         }        
//     ];
// $.elementsList.sections[0].setItems(items);


