var Alloy=require('alloy');

exports.getRandomColor = function(){
	return 'rgba(' + _.random(0,255) + ',' + _.random(0,255) + ',' + _.random(0,255) + ', 1.0)';	
}

exports.getViewByClass = function(_class, _parent, _depth) {
    _parent = _parent || $.main;
    var classArray = [];
    _.each(_parent.children, function(child){
        if (child.className === _class) {
            classArray.push(child);
        }
    });
    
    return classArray;
};


exports.getIndex = function(n){
	r = Number(n)+1; 
	return r;
}




exports.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.fancyTimeFormat = function(time)
{   
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




// OS
if(Ti.Platform.osname === 'iPhone' || Ti.Platform.osname === 'iPad') {
  var ios = true;
}
 
/**
 * Save file function
 *
 * @file: Binary file (Blob)
 * @filename: Name of file (String)
 * @directory: Directory to Save the file (String)
 *
 */
exports.saveFile = function(_args) {
   
  // Test if External Storage (Android only)
  if(Ti.Filesystem.isExternalStoragePresent()){
    var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,  _args.directory+'/'+_args.filename);
  }
 
  // No SD or iOS
  else {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, _args.directory+'/'+_args.filename);
  }
   
  // Save file
  file.write(_args.file);
   
  // Debug: Test if file exist now
  if(file.exists) {
    Ti.API.info('[saveFile] Saved: YES! (' + file.nativePath + ')');
  } else {
    Ti.API.info('[saveFile] Saved: NO!');
  }
 
  // Return full path of file
  if(ios) {
    var iosPath = Ti.Filesystem.applicationDataDirectory + _args.filename;
    iosPath = iosPath.replace('file://','app://');
     
    return iosPath;
  } 
  else {
    return file.nativePath;
  }
};