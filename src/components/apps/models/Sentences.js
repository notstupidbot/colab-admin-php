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

	constructor(sentences_sr, content){
		this.content = content;
		try{
			const items = JSON.parse(sentences_sr);
			if(items.length == 0){
				// console.log('Here')
				this.buildItems();
				return; 
			}
			// console.log('Here')
			// console.log(items)
			this.items = items.map(item=>{
				item.ref = React.createRef();
				item.ttf_ref = React.createRef();
				item.audio_ref = React.createRef();
				item.loading = false;
				item.loading_ttf = false;
				item.audio_source = "";
				return item;
			});
		}catch(e){
			// console.log(e);
		}
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
			// if(what == 'audio_source'){
			// 	item.audio_source = item.ttf;
			// }
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
		let content = this.content;
		if(newContent){
			content = newContent
		}
		console.log(content)

		const textList = content.split('.');

		let tmpSentences = [];
		const dotSentences = content.split('.');

		for(let i in dotSentences){
			const commaSentence = dotSentences[i].split(',');

			if(commaSentence.length > 1){
				const lastIndex = commaSentence.length - 1;
				for(let j in commaSentence){
					const text = commaSentence[j].replace(/^\s+/,'');
					const type = j == lastIndex ? 'dot':'comma';
					if(text.length)
						tmpSentences.push({text:fixTttsText(text), type,ttf:'',loading:false,loading_ttf:false,audio_source:"", ref: React.createRef(null),audio_ref: React.createRef(null), ttf_ref: React.createRef(null)})
				}
			}else{
				const text = commaSentence[0].replace(/^\s+/,'');
				if(text.length)
				tmpSentences.push({text:fixTttsText(text), type:'dot',ttf:'',loading:false,loading_ttf:false,audio_source:"", ref: React.createRef(null),audio_ref: React.createRef(null), ttf_ref: React.createRef(null)})

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
		const sentences = new Sentences(row.sentences, row.text);
		const sentence = new Sentence(row.text, sentences);

		sentence.setSentences(sentences);
		// sentences.setSentence(sentence);

		sentence.setPk(row.id);
		sentence.setContent(row.text);
		sentence.setContentTtf(row.ttf_text);
		sentence.setTitle(row.name);
		sentences.setSentence(sentence);
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
		const name = this.title;
		const text = this.content;
		const ttf_text = this.contentTtf;
		const output_file = this.outputFile;
		const sentences = this.sentences.getItems().map(item=>{
			return {text : item.text, ttf : item.ttf , type : item.type}
		});

		return {id, name, text, sentences, ttf_text, output_file};
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
		if(!finalTtf){
			finalTtf = this.getContentTtf(true);
		}
		const uuid = localStorage.socketUuid;
		let url = `${ttsApiEndpoint}/job?uuid=${uuid}&job_name=tts`;

		chunkMode = chunkMode || false;
		index = index || 0;

		if(chunkMode){
			url += `&chunkMode=true&index=${index}`	
		}
			
		const params = new URLSearchParams({  });
		params.append('project_id', this.pk);
		params.append('text',finalTtf);

	

		return axios.post(url, params);
	}
}




export {Sentences, Sentence};