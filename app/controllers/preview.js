// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
var animation = require('alloy/animation');

function fakeProgress() {
    var val = 0;
    var pInterval = setInterval(function() {
        $.circularProgress.setValue(++val);
        if (val >= 100) {
            clearInterval(pInterval);
        }
    }, 30);
}

// function startCounter(e) {}

$.preview_title.text = args.data_title;
$.preview_description.text = args.data_description;
// $.preview_thumb.image = args.data_video;
$.gifImage.image = args.data_thumb;

var xInt;
var increment = -0.1;

$.progressbar.progress = 1;
$.progressbar.text = Math.round($.progressbar.progress * 10);

function startCounter() {

    xInt = setInterval(function() {
        $.progressbar.progress += increment;
        if ($.progressbar.text == 1) {
            //this clear Interval needs to be removed when closing the progress window.
            clearInterval(xInt);
            Ti.API.info('STOP');
            animation.fadeOut($.progressbar, 500, function() {
                // $.gifImage.stop();
                Ti.App.fireEvent('cagefitness_app_preview_finished', { 'video': args.data_title });
            });
        }
        $.progressbar.text = Math.round($.progressbar.progress * 10);
    }, 1000);

}


startCounter();