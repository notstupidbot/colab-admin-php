export default function SentenceItemTaskQueueToolbar(){

	const onExtractContent = evt => {
		const content = this.stInputTextRef.current.value;
		console.log(content)

		const sentences = this.model.getSentences().buildItems(content).getItems();
		console.log(sentences);
		this.setState({sentences},o=>{
			this.model.getSentences().setItemsRefValue()

			setTimeout(()=>{
					this.loadGrowWrap()
			},1000)
			
		})
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