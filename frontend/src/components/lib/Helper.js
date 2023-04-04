/**
 * Helper
 * class contains static helper methods
 * */
class Helper{
	/**
	 * convert string to title case
	 * @return {string} */
	static titleCase(str){
		let newStr = str.replace(/\W+/g,' ').replace(/_/g,' ');
		newStr = newStr.split(' ')
	   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
	   .join(' ');
		return newStr;
	}
	/**
	 * convert string to slug case
	 * @return {string} */
	static slugify(str){
		let newStr = str.replace(/\W+/g,' ').replace(/_/g,' ');
		newStr = newStr.split(' ')
	   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
	   .join('-');
		return newStr;
	}
	/**
	 * convert string to underscore case
	 * @return {string} */
	static underscore(str){
		let newStr = str.replace(/\W+/g,' ').replace(/_/g,' ');
		newStr = newStr.split(' ')
	   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
	   .join('_');
		return newStr;
	}
	/**
	 * convert string to slugify but also include utf8 case
	 * @return {string} */
	static slugify_u8(str,limitWordCount) {
		if(typeof str=='undefined')
			return;
		str = str.replace(/^\s+|\s+$/g, ''); // trim
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
		var to   = "aaaaeeeeiiiioooouuuunc------";
		for (var i=0, l=from.length ; i<l ; i++) {
		  str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		}

		str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		  .replace(/\s+/g, '-') // collapse whitespace and replace by -
		  .replace(/-+/g, '-'); // collapse dashes
		
		if(typeof limitWordCount != 'undefined'){
		  const words = str.split('-');
		  let slugs = [];
		  if(limitWordCount > words.length){
		    limitWordCount = words.length;
		  }
		  for(let i = 0 ; i < limitWordCount;i++){
		    slugs.push(words[i]);
		  }
		  return slugs.join('-')
		}
		return str;
	}
	/**
	 * Equivalent to sleep in ms
	 * @param {int} ms millisecond
	 * @return {Promise} 
	 * @example
	 * async function test(){
	 * 	await Helper.timeout(1000)  // waiting for a second
	 * } 
	 */ 
	static timeout(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}
	/**
	 * Equivalent to sleep in 1 second with arguments
	 * @param {function} fn callback
	 * @param {number} ms millisecond
	 * @param {...kwargs} arguments
	 * @example
	 * async function test(){
	 * 	await Helper.sleep(()=>{},1000, 'a','b','c')  // waiting for a second
	 * } 
	 */ 
	static async sleep(fn,ms, ...args) {
	    await timeout(ms);
	    return fn(...args);
	}
	/**
	 * Create delay function in ms
	 * @param {number} ms millisecond 
	 * @return {function} a function with delay
	 * */
	static makeDelay(ms) {
	    var timer = 0;
	    return function(callback){
	        clearTimeout (timer);
	        timer = setTimeout(callback, ms);
	        return timer
	    };

	}
	/**
	 * predefined delay function with 1 second timeout
	 * @return {function} 
	 */
	static delay = Helper.makeDelay(1000)
	/**
	 * change number into text in indonesian lang
	 * @return {string} 
	 */
	static terbilang(x)
	{
		var ambil =new Array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
		if (parseFloat(x) < 12)
		{
			x=Math.floor(x);
			return " "+ambil[x];
		}
		else if (parseFloat(x) < 20)
		{
			return Helper.terbilang(parseFloat(x) - 10)+" belas";
		}
		else if (parseFloat(x) < 100)
		{
			return Helper.terbilang(parseFloat(x) / 10)+" puluh"+Helper.terbilang(parseFloat(x)%10);
		}
		else if (parseFloat(x) < 200)
		{
			return " seratus"+Helper.terbilang(parseFloat(x)-100);
		}
		else if (parseFloat(x) < 1000)
		{
			return Helper.terbilang(parseFloat(x) / 100)+" ratus"+Helper.terbilang(parseFloat(x)%100);
		}
		else if (parseFloat(x) < 2000)
		{
			return " seribu"+Helper.terbilang(parseFloat(x) - 1000);
		}
		else if (parseFloat(x) < 1000000)
		{
			return Helper.terbilang(parseFloat(x) / 1000)+" ribu"+Helper.terbilang(parseFloat(x)%1000);
		}
		else if (parseFloat(x) < 1000000000)
		{
			return Helper.terbilang(parseFloat(x) / 1000000)+" juta"+Helper.terbilang(parseFloat(x) % 1000000);	
		}
		else if (parseFloat(x) < 1000000000000)
		{
			return Helper.terbilang(parseFloat(x) / 1000000000)+" milyar"+Helper.terbilang(parseFloat(x) % 1000000000);	
		}
	}
	/**
	 * convert input tts text to valid tts server g2 input text
	 * @return {string} 
	 */
	static fixTttsText(text){
		text = text.replace(/,/g,' ')
		text = text.replace(/\W/g,' ')
		text = text.replace(/\d+/g, Helper.terbilang)
		text = text.replace(/\W+/g, ' ')
		return text;
	}
}

export default Helper