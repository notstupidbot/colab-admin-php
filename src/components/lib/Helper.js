export default class Helper{
	static titleCase(str){
		let newStr = str.replace(/\W+/g,' ').replace(/_/g,' ');
		newStr = newStr.split(' ')
	   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
	   .join(' ');
		return newStr;
	}
	static slugify(str){
		let newStr = str.replace(/\W+/g,' ').replace(/_/g,' ');
		newStr = newStr.split(' ')
	   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
	   .join('-');
		return newStr;
	}
	static underscore(str){
		let newStr = str.replace(/\W+/g,' ').replace(/_/g,' ');
		newStr = newStr.split(' ')
	   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
	   .join('_');
		return newStr;
	}

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
	static delay = Helper.makeDelay(250)
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
	static fixTttsText(text){
		text = text.replace(/,/g,' ')
		text = text.replace(/\W/g,' ')
		text = text.replace(/\d+/g, Helper.terbilang)
		text = text.replace(/\W+/g, ' ')
		return text;
	}
}