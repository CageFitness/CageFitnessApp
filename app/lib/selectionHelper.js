/**
 * @method getViewByClass
 * This will take a class and an optional parent and find children with that class
 * Untested but would pretty likely work
 * @param {String} _class Class name
 * @param {Object} _parent Optional Parent View to iterate through
 * @param {Number} _depth Optional depth of recursiveness
 * @return {Array} Array of views with the class
 * 
 * @TODO Implement _depth and recursive calls
 */ 


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