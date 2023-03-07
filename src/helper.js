
export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}

export function terbilang(x)
	{
		var ambil =new Array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
		if (parseFloat(x) < 12)
		{
			x=Math.floor(x);
			return " "+ambil[x];
		}
		else if (parseFloat(x) < 20)
		{
			return terbilang(parseFloat(x) - 10)+" belas";
		}
		else if (parseFloat(x) < 100)
		{
			return terbilang(parseFloat(x) / 10)+" puluh"+terbilang(parseFloat(x)%10);
		}
		else if (parseFloat(x) < 200)
		{
			return " seratus"+terbilang(parseFloat(x)-100);
		}
		else if (parseFloat(x) < 1000)
		{
			return terbilang(parseFloat(x) / 100)+" ratus"+terbilang(parseFloat(x)%100);
		}
		else if (parseFloat(x) < 2000)
		{
			return " seribu"+terbilang(parseFloat(x) - 1000);
		}
		else if (parseFloat(x) < 1000000)
		{
			return terbilang(parseFloat(x) / 1000)+" ribu"+terbilang(parseFloat(x)%1000);
		}
		else if (parseFloat(x) < 1000000000)
		{
			return terbilang(parseFloat(x) / 1000000)+" juta"+terbilang(parseFloat(x) % 1000000);	
		}
		else if (parseFloat(x) < 1000000000000)
		{
			return terbilang(parseFloat(x) / 1000000000)+" milyar"+terbilang(parseFloat(x) % 1000000000);	
		}
	}
export function fixTttsText(text){
	text = text.replace(/,/g,' ')
	text = text.replace(/\W/g,' ')
	text = text.replace(/\d+/g, terbilang)
	text = text.replace(/\W+/g, ' ')
	return text;
}
export function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
}