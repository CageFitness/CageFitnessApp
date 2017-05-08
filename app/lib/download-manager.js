/**
 * Download Manager
 * Manage downloads of assets through a third party module
 * It also keeps track of the downloaded files in a queue.
 * Dependency: A native module for iOS & Android
 * @author Mads Møller
 * @version 1.0.0
 * Copyright Napp ApS
 * www.napp.dk
 */

// Dependencies
var Alloy = require("alloy"), _ = require('alloy/underscore')._;

function DownloadManager(settings) {
	var publicScope = {};
	var settings = settings || {};

	// get native module
	var DownloadModule = require('com.kcwdev.downloader');
	
	// basic config
	var DEBUG = settings.debug || false;
	DownloadModule.permittedNetworkTypes = settings.permittedNetworkTypes || DownloadModule.NETWORK_TYPE_ANY;
	DownloadModule.maximumSimultaneousDownloads = settings.maximumSimultaneousDownloads || 4;

	function logger(message, data) {
		if (DEBUG) {
			Ti.API.debug("[DownloadManager] " + message);
			data && Ti.API.debug( typeof data === 'object' ? JSON.stringify(data, null, '\t') : data);
		}
	}

	// creating a download queue for enabling success and error callbacks
	var downloadQueue = [];
	publicScope.addToDownloadQueue = function(obj) {
		logger("addToDownloadQueue", obj);
		
		// check if download is already added
		if(!_.findWhere(downloadQueue, { url: obj.url })){
			downloadQueue.push(obj);
			return true;
		} else {
			return false;
		}
	};

	publicScope.removeFromDownloadQueue = function(obj, success) {
		logger("removeFromDownloadQueue", obj);
		logger("removeFromDownloadQueue length BEFORE: " + downloadQueue.length );
		
		// Find the object in the queue in order to use callbacks
		var item = _.findWhere(downloadQueue, {
			url : obj.url
		});
		
		// remove the item from the download queue 
		downloadQueue = _.reject(downloadQueue, function(element){ 
			return element.url == obj.url; 
		});
		
		logger("removeFromDownloadQueue length AFTER: " + downloadQueue.length );
		
		if (success === true) {
			// make success callback
			_.isFunction(item.success) && item.success(obj);
		} else if (success === false) {
			// make error callback
			_.isFunction(item.error) && item.error(obj);
		}
	};
	
	/*
	 * Check if download can begin
	 */
	publicScope.canStartDownload = function(url){
		if(!_.findWhere(downloadQueue, { url: url })){
			logger("canStartDownload true", url);
			return true;
		} else {
			logger("canStartDownload false", url);
			return false;
		}
	};
	
	/*
	 * Return the download queue
	 */
	publicScope.getDownloadQueue = function() {
		logger("getDownloadQueue total: " + downloadQueue.length);
		return downloadQueue;
	};

	/*
	 * Return the module instance
	 */
	publicScope.getManager = function() {
		return DownloadModule;
	};

	publicScope.setMaximumSimultaneousDownloads = function(number) {
		DownloadModule.setMaximumSimultaneousDownloads(number);
	};

	publicScope.setPermittedNetworkTypes = function(constant) {
		DownloadModule.setPermittedNetworkTypes(constant);
	};

	publicScope.setDebugMode = function(bool) {
		DEBUG = bool;
	};

	publicScope.restartDownloader = function() {
		DownloadModule.restartDownloader();
	};

	publicScope.stopDownloader = function() {
		DownloadModule.stopDownloader();
	};
	
	
	/**
	 * Starts a download
	 * It will also add the object to a queue
	 */
	publicScope.addDownload = function(args) {
		logger("addDownload", args);
		var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, Ti.Utils.md5HexDigest(args.url));
		if (!f.exists()) {
			logger("addDownload", f.nativePath);

			// add to queue
			var added = publicScope.addToDownloadQueue(args);
			
			// if already added - return error
			if(!added){
				//_.isFunction(args.error) && args.error({message:"already downloaded"});
				logger("addDownload - already downloading");
				return;
			}

			// start download
			DownloadModule.addDownload({
				name : args.name,
				url : args.url,
				filePath : f.nativePath,
				priority : args.priority || DownloadModule.DOWNLOAD_PRIORITY_NORMAL
			});
			logger("addDownload - begin download");
		} else {
			// file already downloaded
			_.isFunction(args.success) && args.success({
				name : args.name,
				url : args.url,
				filePath : f.nativePath,
				message : "already downloaded"
			});
			logger("addDownload - already downloaded");
		}
	};

	publicScope.getDownloadInfo = function(url) {
		return DownloadModule.getDownloadInfo(url);
	};

	publicScope.getAllDownloadInfo = function() {
		return DownloadModule.getDownloadInfo();
	};

	publicScope.pauseAll = function() {
		DownloadModule.pauseAll();
	};
	publicScope.resumeAll = function() {
		DownloadModule.resumeAll();
	};

	publicScope.cancelItem = function(url) {
		DownloadModule.cancelItem(url);
	};

	publicScope.deleteItem = function(url) {
		var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, Ti.Utils.md5HexDigest(url));
		if (f.exists()) {
			f.deleteFile();
		}
		DownloadModule.deleteItem(url);
	};
	
	/**
	 * Events
	 */
	DownloadModule.addEventListener('completed', function(e) {
		logger("Event: completed", e);
		publicScope.removeFromDownloadQueue(e, true);
	});

	DownloadModule.addEventListener('failed', function(e) {
		logger("Event: failed", e);
		publicScope.removeFromDownloadQueue(e, false);
	});

	DownloadModule.addEventListener('progress', function(e) {
		var item = _.findWhere(downloadQueue, {
			url : e.url
		});
		if (item && _.isFunction(item.progress)) {
			item.progress(e);
		}
	});

	return publicScope;
}

module.exports = DownloadManager; 