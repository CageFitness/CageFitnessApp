var args = $.args;
var url = $.args.url || "https://cagefitness.com/wp-content/uploads/import/CFA-BodyWeight-3PointPushupsAlternating.mp4";
$.videoPlayer.media = url;
$.videoPlayer.addEventListener('change', onVideoPlaying);
function onVideoPlaying(e){
	Ti.API.info('PLAYER.INFO',e);
}
Ti.API.info('this.works')