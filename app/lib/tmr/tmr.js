

function tmr(t){
	return (this instanceof tmr) ? this.reset(t) : new tmr(t);
};

// get elapsed time since start
tmr.prototype.time = function(){
	return this.elapsed + (this.started) ? (Date.now() - this.started) : 0;
};

// get absolute time difference from t
tmr.prototype.get = function(){
	return Math.abs(this.t-((this.t>0)?Math.min(this.time(),this.t):this.time()));
};

// start the clock
tmr.prototype.start = function(){
	this.started = Date.now();
	return this;
};

// stop the clock
tmr.prototype.stop = function(){
	this.elapsed = Date.now() - this.started;
	this.started = null;
	return this;
};

// set clock to zero
tmr.prototype.reset = function(t){
	this.t = t || this.t || 0;
	this.elapsed = 0;
	this.started = null;
	return this;
};

// change elapsed time
tmr.prototype.change = function(v){
	this.elapsed += parseInt(v,10) || 0;
	return this;
};

// set elapsed time
tmr.prototype.set = function(v){
	this.elapsed = parseInt(v,10) || 0;
	this.started = Date.now();
	return this;
};

// check if the clock has ran out
tmr.prototype.check = function(v){
	return (!this.t && !v || (v||this.t) > this.time());
};

// print the time in a nice format
tmr.prototype.format = function(f,up){
	var t = (up) ? this.time() : this.get();
	return f.replace(/(d+|h+|m+|s+|z+)/g, function(v){
		switch (v[0]+Math.min(v.length,3)) {
			case "d1":
				return Math.floor(t/86400000).toString();
			case "d2":
				return ("0"+Math.floor(t/86400000).toString()).substr(-2);
			break;
			case "d3":
				return ("00"+Math.floor(t/86400000).toString()).substr(-3);
			break;
			case "h1":
				return Math.floor(t%86400000/3600000).toString();
			break;
			case "h2":
				return ("0"+Math.floor(t%86400000/3600000).toString()).substr(-2);
			break;
			case "h3":
				return Math.floor(t/3600000).toString();
			break;
			case "m1":
				return Math.floor(t%3600000/60000).toString();
			break;
			case "m2":
				return ("0"+Math.floor(t%3600000/60000).toString()).substr(-2);
			break;
			case "m3":
				return Math.floor(t/60000).toString();
			break;
			case "s1":
				return Math.floor(t%60000/1000).toString();
			break;
			case "s2":
				return ("0"+Math.floor(t%60000/1000).toString()).substr(-2);
			break;
			case "s3":
				return Math.floor(t/1000).toString();
			case "z1":
			case "z2":
			case "z3":
				return ("000"+(t%1000).toString()).substr(-3).substr(0,Math.min(v.length,3));
				//return ("0000"+((t%1000).toString()).substr(-4)).substr(0,v.length);
			break;
		}
	});
};

module.exports = tmr;
