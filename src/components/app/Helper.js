export default class Helper{
	static timeout(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}
	static async  sleep(fn, ...args) {
	    await timeout(3000);
	    return fn(...args);
	}
	static makeDelay(ms) {
	    var timer = 0;
	    return function(callback){
	        clearTimeout (timer);
	        timer = setTimeout(callback, ms);
	    };
	}
}