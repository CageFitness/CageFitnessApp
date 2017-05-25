# tmr

`tmr` is a very simple countdown clock. all values are in _ms_.

## new tmr([init])

create a new timer with an optonal initial value for countdown. if now initial value is passed or the initial value is zero, the clock will alway count up.

## tmr.time()

get the elapsed time.

## tmr.get()

get the offset from the initial value or, if no initial value is set, the elapsed time.

## tmr.start()

start or restart the clock.

## tmr.stop()

stop the clock.

## tmr.reset([init])

reset the clock, optionally set a new initial value.

## tmr.change(offset)

change the elapsed time by offset.

## tmr.set(elapsed)

set the elapsed time.

## tmr.check([val])

check if the elapsed time is lower than the initial value or `val`

## tmr.format(fmt, up)

get a formatted string of the clock offset or elapsed time. setting `up` true, will always give the elapsed time.

### formatting

* `d` full days `0-999`
* `dd` full days with padding `00-999`
* `ddd` full days with padding `000-999`
* `h` full hours of the day `0-23`
* `hh` full hours of the day with padding `00-23`
* `hhh` full hours total `0-999`
* `m` full minutes of the hour `0-59`
* `mm` full minutes of the hour with padding `00-59`
* `mmm` full minutes total `0-999`
* `s` full seconds of the minute `0-59`
* `ss` full seconds of the minute with padding `00-59`
* `sss` full seconds total `0-999`
* `z` tenths of a second `0-9`
* `zz` hundredths of a second `00-99`
* `zzz` milliseconds `000-999`

## example

``` javascript

var tmr = require("tmr");

var timer = new timer(60); // 60 seconds countdown

timer.start();

setInterval(function(){

	if (!timer.check()) throw new Error("detonation");
	
	if (blue_cable_cut) timer.set(5000);
	if (red_cable_cut) timer.stop();

	console.log("%s till detonation", timer.format("d:hh:mm:ss.zzz"));
	console.log("counting down since %s seconds", timer.format("sss", true));

},1000);

```
