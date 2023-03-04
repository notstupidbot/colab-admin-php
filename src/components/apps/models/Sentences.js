import React from "react"
import axios from "axios"
import {makeDelay,terbilang,fixTttsText,timeout,sleep} from "../../../helper";
import {v4} from "uuid"

const apiEndpoint = `http://localhost`;
const ttsApiEndpoint = `http://localhost:7000`;
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
				return item;
			});
		}catch(e){
			// console.log(e);
		}
	}
	setItemsRefValue(){
		this.items.map(item=>{
			item.ref.current.value = item.text;
			item.ttf_ref.current.value = item.ttf;
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
			const ttfTextList = await this.convertTtfRemote(text);
	
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
	
	buildItems(){
		console.log('HERE')
		const content = this.content;
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
					tmpSentences.push({text:fixTttsText(text), type,ttf:'', ref: React.createRef(null), ttf_ref: React.createRef(null)})
				}
			}else{
				const text = commaSentence[0].replace(/^\s+/,'');
				tmpSentences.push({text:fixTttsText(text), type:'dot',ttf:'', ref: React.createRef(null), ttf_ref: React.createRef(null)})

			}
		}
		console.log(tmpSentences)
		this.items = tmpSentences;
	}

	rebuild(){

	}

	 
	/*-------------------------------------------*/

	/*rebuildSentences(sentences){
		for(let i in sentences){
			sentences[i].ref = React.createRef(null);
		}
	}*/
	/*async onStateChanges(key){
		if(key === 'sentences'){
			if(this.props.activeTab != 'sentence-editor'){
				console.log('SKIP')
				return;
			}
			delay(async ()=>{
				console.log("rebuilding ttf");
				for(let i = 0 ;i < this.state.sentences.length ;i++){
					if(this.props.activeTab != 'sentence-editor'){
						console.log('tab changed SKIP');
						break;
					}
					const item = this.state.sentences[i];
					const text = item.text.trim();
					if(text){
						console.log(`Processing ${item.text}`);
						await this.updateRemoteItem(item.text, i);
					}
					
				}
			})
		}
	}
	*/
	// loadSample(){
	// 	const text= "Kim Tae-ri (24 April 1990) adalah aktris asal Korea Selatan. Dia terkenal karena membintangi film The Hen maiden (2016), Litel Fores (2018), Spes Swipers (2020) dan drama sejarah Mister Sunshine (2018). Baru-baru ini, Kim mendapatkan pengakuan lebih lanjut untuk peran utamanya dalam drama percintaan remaja di Twenti Faiv Twenti wan (2022), ia memenangkan kategori Penghargaan Aktris Terbaik pada  Baeksang Arts Awards ke 58";
	// }
	
	/*
	fixEmptySentences(){
		console.log(`sentences is empty`)
		const text = this.props.activeSentence.text;
		this.updateSentences(text,async()=>{
			await this.updateRemoteSentence();
			await this.onStateChanges('sentences');	
		});
	}
	*/
	/*
	async loadSentences(){
		for (let i in this.state.sentences){
			const item = this.state.sentences[i];
			
			this.state.sentences[i].ref.current.value = fixTttsText(this.state.sentences[i].text);
		}	
		// await this.onStateChanges('sentences');	
	}*/
	/*
	loadRow(){
		console.log(`STEP 0`);
		const sentence = Sentence.fromRow(this.props.activeSentence);
		let sentences =[]; 
		console.log(`sentence is `,sentence);

		return;
		try{
			sentences = JSON.parse(sentence.sentences); 
			this.rebuildSentences(sentences); 
			console.log(sentences)
		}catch(e){
			console.log(e)
		}
		console.log(`STEP 01`);
		console.log(`sentences is `,sentences);

		if(typeof sentences == 'object'){
			if(typeof sentences.length != 'undefined'){
				this.setState({sentences},async()=>{
						console.log(`STEP 01a`);
						await this.loadSentences();
				})
			}else{
				console.log(`STEP 01b`);
				this.setState({sentences:[]},()=>this.fixEmptySentences())
			}
		}else{
			console.log(`STEP 01c`);
			this.setState({sentences:[]},()=>this.fixEmptySentences())
		}

		// this.setState({sentence},()=>this.fixEmptySentences());

		this.stInputNameRef.current.value = sentence.name;
		this.stInputTextRef.current.value = sentence.text;
		this.stInputTtfRef.current.value = sentence.ttf_text;

		// console.log(this.props.activeSentence)
	}

	*/
	/*
	updateSentences(text, callback){
		const newSentences = this.splitSentences(text);

		this.setState({sentences:newSentences},async()=>{
				for (let i in this.state.sentences){
					const item = this.state.sentences[i];

					// console.log(item.ref.current)
					
					this.state.sentences[i].ref.current.value = fixTttsText(this.state.sentences[i].text);
				}	
				if(typeof callback=='function'){
					callback();
				}	
		})
	}
	*/
	/*
	reloadData(){
		// console.log(this.props.activeProject)
		// console.log(this.props.activeTab)
		// console.log(this.props.socketConnected)
		// console.log(this.props.socketClient)

		const activeProject = this.props.activeProject;
		if(activeProject){
			console.log(activeProject);

			const text = activeProject.text;
			// const sentences = text.split('.');

			this.textInputRef.current.value = text;

			this.updateSentences(text)
		}
		
	}
	*/
	/*
	updateTtfText(){
		delay(()=>{
			const sentences = this.state.sentences;
			const ttfText =[];
			for(let i in sentences){
				const item = sentences[i];
				if(item.text){
					if(item.ttf){
						ttfText.push(item.ttf + (item.type=='dot'?'.':','));
					}
				}
			}
			this.stInputTtfRef.current.value = ttfText.join(" ");
		})
	}
	*/
	/*
	async updateRemoteItem(text, index){
		const sentences = this.state.sentences;
		const output_text = await this.convertTtfRemote(text);
		console.log(output_text);
		const ttfText = [];
		for(let i in output_text){
			ttfText.push(output_text[i].ttf)
		}
		sentences[index].ttf = ttfText.join(" ") 
		this.setState({sentences});
		this.updateTtfText();

	}
	*/
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
			return this.contentTtf.replace(/\s+/g,' ').replace(/^\s+/,'').replace(/\s.$/,'');
		// console.log('B',this.getSentences().getItems())

		const contentTtf = this.getSentences().getItems().map(item =>  {
			const type = item.type == 'comma' ? ',' : '.'
			return item.ttf ? `${item.ttf} ${type}` : ''

		});
		console.log(contentTtf)
		this.contentTtf = contentTtf.join(' ').replace(/\s+/g,' ').replace(/^\s+/,'').replace(/\s.$/,'')
		return this.contentTtf;
	}

	async updateRow(){
		const data = new FormData();
		const {id,name,text,sentences,ttf_text} = this.toRow();

		console.log(sentences)

		data.append('name', name);
		data.append('text', text);
		data.append('sentences', JSON.stringify(sentences));
		data.append('ttf_text', ttf_text);

		const res = axios({
			method: "post",
			url: `${apiEndpoint}/api/tts/sentence?id=${id}`,
			data: data,
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res;
	} 
	runTtsJob(finalTtf){
		if(!finalTtf){
			finalTtf = this.getContentTtf(true);
		}
		const uuid = localStorage.socketUuid;
		const url = `${ttsApiEndpoint}/job?uuid=${uuid}&job_name=tts`;

		const params = new URLSearchParams({  });
		params.append('project_id', this.pk);
		params.append('text',finalTtf);

	

		return axios.post(url, params);
	}
}




export {Sentences, Sentence};