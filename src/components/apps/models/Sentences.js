import React from "react"
import axios from "axios"
import {makeDelay,terbilang,fixTttsText,timeout,sleep} from "../../../helper";
import {v4} from "uuid"
import app_config from "../../../app.config"
console.log(app_config)
const apiEndpoint = app_config.getApiEndpoint();
const ttsApiEndpoint = app_config.getPushEndpoint();
class Sentences{
	sentence = null
	content = null
	items = []
	sentences_sr = null
	constructor(sentences_sr, content){
		this.content = content;
		this.sentences_sr = sentences_sr;

		try{
			this.items = typeof sentences_sr=='string'?JSON.parse(sentences_sr):sentences_sr;
			if(items.length == 0){
				// console.log('Here')
				this.buildItems();
				return; 
			}
			this.init();
			// console.log('Here')
			// console.log(items)
			
		}catch(e){
			// console.log(e);
		}
	}
	init(){
		this.items = this.items.map((item,idx)=>{
		item.ref = React.createRef();
		item.ttf_ref = React.createRef();
		item.audio_ref = React.createRef();
		item.loading = false;
		item.loading_ttf = false;
		item.audio_source = "";
		if(this.sentence){
			item.audio_source = `${app_config.getApiEndpoint()}/public/tts-output/${this.sentence.pk}-${idx}.wav`	

		}
		return item;
	});
	}
	setItemsRefValue(what){
		what = what || 'all';
		this.items.map(item=>{
			if(what == 'all'){
				item.ref.current.value = item.text;
				item.ttf_ref.current.value = item.ttf;


			}
			if(what == 'text'){
				item.ref.current.value = item.text;
			}
			if(what == 'ttf'){
				item.ttf_ref.current.value = item.ttf;
			}
			
			
		});
	}
	loadItemRefAudioSource(index){
		index = index || -1;
		this.items.map((item,idx)=>{
			if(item.audio_source == ""){
				item.audio_source = `${app_config.getApiEndpoint()}/public/tts-output/${this.sentence.pk}-${idx}.wav`	
			}
			if(index > -1){
				// console.log('A')

				if(index == idx){
					try{
						// console.log(item.audio_source);

						item.audio_ref.current.load()
					}catch(e){

					}
				}
			}else{
				// console.log('B')
				try{
					// console.log(item.audio_source);
					item.audio_ref.current.load()
				}catch(e){

				}
			}
			
		});
	}
	setSentence(sentence){
		this.sentence = sentence;
	}
	getItems(){
		return this.items;
	}


	async convertTtfRemote(text){
		const res = await axios(`${apiEndpoint}/api/tts/convert?text=${encodeURI(text)}`);
		return res.data;
	}
	async updateItem(text, index, forceTtf){
		console.log(`updating sentences item ${index}`);
		if(this.items[index].ttf == "" || forceTtf){

			let sentences = this.sentence.editor.state.sentences; 
			let loading = sentences[index].loading;
			sentences[index].loading = true;
			this.sentence.editor.setState({sentences});
			console.log(`Try to set state loading the value is ${this.sentence.editor.state.sentences[index].loading}`)

			const ttfTextList = await this.convertTtfRemote(text);

			sentences[index].loading = false;
			this.sentence.editor.setState({sentences});
			console.log(`Try to set state loading the value is ${this.sentence.editor.state.sentences[index].loading}`)

	
			const ttfText = [];
			for(let i in ttfTextList){
				ttfText.push(ttfTextList[i].ttf)
			}
			this.items[index].ttf = ttfText.join(" ") 
		}
		this.items[index].text = text;

		console.log('A',this.getItems())
	}
	async updateItemTtf(ttf, index){
		console.log(`updating sentences item ${index}`);

		this.items[index].ttf = ttf

		console.log('A',this.getItems())
	}
	
	buildItems(newContent){
		console.log('HERE')
		const audio_source_base = `${app_config.getApiEndpoint()}/public/tts-output/${this.sentence.pk}-`;

		let content = this.content;
		if(newContent){
			content = newContent
		}
		console.log(content)

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
					const audio_source = `${audio_source_base}${source_index}.wav`;
					if(text.length){
						tmpSentences.push({text:fixTttsText(text), type,ttf:'',loading:false,loading_ttf:false,audio_source, ref: React.createRef(null),audio_ref: React.createRef(null), ttf_ref: React.createRef(null)})
						source_index += 1;
					}
					
				}
			}else{
				const text = commaSentence[0].replace(/^\s+/,'');
				if(text.length){
					const audio_source = `${audio_source_base}${source_index}.wav`;

					tmpSentences.push({text:fixTttsText(text), type:'dot',ttf:'',loading:false,loading_ttf:false,audio_source , ref: React.createRef(null),audio_ref: React.createRef(null), ttf_ref: React.createRef(null)})
					source_index += 1;
				}
			}
		}
		console.log(tmpSentences)
		this.items = tmpSentences;
		return this;
	}

}

class Sentence {
	pk = null
	title = null
	output_file = null
	sentences = null
	content = null
	contentTtf = null
	editor = null

	constructor(content, sentences_sr){
		this.content = content;
		this.sentences = new Sentences(sentences_sr);
		this.sentences.setSentence(this);
	}
	
	static fromRow(row){
		const sentences = new Sentences(row.sentences, row.content);
		const sentence = new Sentence(row.content, sentences);

		sentence.setSentences(sentences);
		// sentences.setSentence(sentence);

		sentence.setPk(row.id);
		sentence.setContent(row.content);
		sentence.setContentTtf(row.content_ttf);
		sentence.setTitle(row.title);
		sentences.setSentence(sentence);
		sentences.init();

		return sentence;
	}

	setEditor(editor){
		this.editor = editor;
	}

	setTitle(title){
		this.title = title;
	}
	setContent(content){
		this.content = content;
	}

	setContentTtf(contentTtf){
		this.contentTtf = contentTtf;
	}

	setSentences(sentences){
		this.sentences = sentences;
	}

	setOutputFile(outputFile){
		this.outputFile = outputFile;
	}

	toRow(){
		const id = this.pk;
		const title = this.title;
		const content = this.content;
		const content_ttf = this.contentTtf;
		const output_file = this.outputFile;
		const sentences = this.sentences.getItems().map(item=>{
			return {text : item.text, ttf : item.ttf , type : item.type}
		});

		return {id, title, content, sentences, content_ttf, output_file};
	}

	setPk(pk){
		this.pk = pk;
	}

	getSentences(){
		return this.sentences;
	}

	getTitle(){
		return this.title;
	}

	getContent(){
		return this.content;
	}

	getContentTtf(latest){
		if(!latest)
			return this.contentTtf.replace(/\s+/g,' ').replace(/^\s+/g,'').replace(/\s.$/g,'.');
		// console.log('B',this.getSentences().getItems())

		const contentTtf = this.getSentences().getItems().map(item =>  {
			const type = item.type == 'comma' ? ',' : "."
			item.ttf = item.ttf.replace(/\s+/g,' ').replace(/^\s+/,'')
			return item.ttf ? `${item.ttf}${type}` : ''

		});
		console.log(contentTtf)
		this.contentTtf = contentTtf.join("\n");
		return this.contentTtf;
	}

	async updateRow(dontRun){
		const data = new FormData();
		const {id,name,text,sentences,ttf_text} = this.toRow();

		// console.log(sentences)

		data.append('name', name);
		data.append('text', text);
		data.append('sentences', JSON.stringify(sentences));
		data.append('ttf_text', ttf_text);

		if(dontRun){
			console.log("A");
			this.getSentences().setItemsRefValue('ttf');
			return FormData;
		}else{
			console.log("B")
			const res = axios({
				method: "post",
				url: `${apiEndpoint}/api/tts/sentence?id=${id}`,
				data: data,
				headers: { "Content-Type": "multipart/form-data" },
			});

			return res;
		}
		
	} 
	runTtsJob(finalTtf, chunkMode, index){
		const subscriber_id = localStorage.messagingSubscriberId;

		if(!finalTtf){
			finalTtf = this.getContentTtf(true);
		}
		
		let url = `${apiEndpoint}/tts/job?subscriber_id=${subscriber_id}&job_name=tts`;

		chunkMode = chunkMode || false;
		index = index || 0;

		if(chunkMode){
			url += `&chunkMode=true&index=${index}`	
		}
			
		const params = new URLSearchParams({ });
		params.append('sentence_id', this.pk);
		params.append('text',finalTtf);
		
		return axios.post(url, params);
	}
}




export {Sentences, Sentence};