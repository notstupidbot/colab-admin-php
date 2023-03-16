import axios from "axios"
import Helper from "../../../lib/Helper"
import AppConfig from "../../../lib/AppConfig"
const delay = Helper.makeDelay(500)
export default function SentenceItemTaskQueueToolbar({content, items, setItems, pk, sentenceItems, setSentenceItems}){
	const buildItems = ()=>{

		const textList = content.split('.');

		let tmpSentences = [];
		const dotSentences = content.split('.');
		let source_index = 0;
		for(let i in dotSentences){
			const commaSentence = dotSentences[i].split(',');

			if(commaSentence.length > 1){
				const lastIndex = commaSentence.length - 1;
				for(let j in commaSentence){
					const text = commaSentence[j].replace(/^\s+/,'');
					const type = j == lastIndex ? 'dot':'comma';
					if(text.length){
						tmpSentences.push({
							text : Helper.fixTttsText(text), 
							type,
							ttf:''
						})
						source_index += 1;
					}
					
				}
			}else{
				const text = commaSentence[0].replace(/^\s+/,'');
				if(text.length){

					tmpSentences.push({
						text : Helper.fixTttsText(text), 
						type : 'dot',
						ttf : '',
					})
					source_index += 1;
				}
			}
		}
		setItems(tmpSentences);
	}
	const onExtractContent = evt => {
		console.log(content)
		buildItems();
	}

	const onConvertTask = async(evt) => {
		// onConvertTask(evt)
		const newSentenceItems = [];
		for(let index in sentenceItems){
			const sentenceItem = sentenceItems[index];
			const inputRefCurrent = document.querySelector(`.sentence-item-text-${index}`)
			const ttfRefCurrent = document.querySelector(`.sentence-item-ttf-${index}`)
			const text = inputRefCurrent.value;
	
			const res = await axios(`${AppConfig.getInstance().getTtsEndpoint()}/api/convert?text=${encodeURI(text)}`);
			const ttf = res.data
			ttfRefCurrent.value = ttf;

			// sentenceItem.ttf = ttf;
			// newSentenceItems.push(sentenceItem)
		}
		// setSentenceItems(newSentenceItems);
	}

	const onSynthesizeTask = evt => {
		console.log('queue Synthesize event handler clicked')
	}

	const btnCls = "py-1 px-1 mx-2 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"

	return(<div className="absolute z-10 right-1">
		<div className="inline-flex shadow-sm">
			<button title="Extract Lines" type="button" onClick={ evt => onExtractContent(evt) } 
					className={btnCls}>
				<i className="bi bi-list-check"></i>
			</button>
			<button title="Translate All" type="button" onClick={ evt => onConvertTask(evt) } className={btnCls}>
				<i className="bi bi-translate"></i>
			</button>
			<button title="Synthesize All" type="button" onClick={ evt => onSynthesizeTask(evt) } className={btnCls}>
				<i className="bi bi-soundwave"></i>
			</button>
		</div>
	</div>)
}