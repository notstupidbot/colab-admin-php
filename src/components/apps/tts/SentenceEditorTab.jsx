import React from "react";
import axios from "axios";
import {v4} from "uuid";
import {makeDelay,terbilang,fixTttsText,timeout,sleep} from "../../../helper";
let lastText = localStorage.lastText || "";

var delay = makeDelay(1000);
let dontRunTwice = true;
export default class SentenceEditorTab extends React.Component{
	state = {
		sentences : [],
		ttfText : "",
		project : null,
		onProcess : false,
		inputStatus: 0,
		sentence : null
	}

	stInputTextRef = null
	stInputTtfRef = null
	runBtnRef = null
	stInputNameRef = null

	inputErrorCls = "py-3 px-4 block w-full border-red-500 rounded-md text-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	inputOkCls = "py-3 px-4 block w-full border-green-500 rounded-md text-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	inputDefaultCls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
	
	constructor(){
		super()
		this.stInputNameRef = React.createRef(null)
		this.stInputTtfRef = React.createRef(null)
		this.runBtnRef = React.createRef(null)
		this.stInputTextRef = React.createRef(null)
	}
 
	splitSentences(text){
		let tmpSentences = [];
		const dotSentences = text.split('.');

		for(let i in dotSentences){
			const commaSentence = dotSentences[i].split(',');

			if(commaSentence.length > 1){
				const lastIndex = commaSentence.length - 1;
				for(let j in commaSentence){
					const item = commaSentence[j].replace(/^\s+/,'');
					const type = j == lastIndex ? 'dot':'comma';
					tmpSentences.push({text:item, type,ttf:'', ref: React.createRef(null)})
				}
			}else{
					tmpSentences.push({text:commaSentence[0].replace(/^\s+/,''), type:'dot',ttf:'', ref: React.createRef(null)})

			}
		}
		console.log(tmpSentences)
		return tmpSentences;

	}
	loadSample(){
		const text= "Kim Tae-ri (24 April 1990) adalah aktris asal Korea Selatan. Dia terkenal karena membintangi film The Hen maiden (2016), Litel Fores (2018), Spes Swipers (2020) dan drama sejarah Mister Sunshine (2018). Baru-baru ini, Kim mendapatkan pengakuan lebih lanjut untuk peran utamanya dalam drama percintaan remaja di Twenti Faiv Twenti wan (2022), ia memenangkan kategori Penghargaan Aktris Terbaik pada  Baeksang Arts Awards ke 58";
	}
	componentDidMount(){
		if(lastText){
			this.updateSentences(lastText)
		}
		if(dontRunTwice){
				this.props.onSocketConnect((socket)=>{
					console.log(`${socket.id} connected on SentenceEditorTab`)
				});
				this.props.onSocketLog((message, data)=>{
					console.log(`log ${message} arrived in SentenceEditorTab`)
					console.log(data);

				});
				dontRunTwice=false;
		}
		
	}
	rebuildSentences(sentences){
		for(let i in sentences){
			sentences[i].ref = React.createRef(null);
		}
	}
	fixEmptySentences(){
		const text = this.props.activeSentence.text;
		this.updateSentences(text,async()=>{
			await this.updateRemoteSentence();
			await this.onStateChanges('sentences');	
		});
	}
	async loadSentences(){
		for (let i in this.state.sentences){
			const item = this.state.sentences[i];
			
			this.state.sentences[i].ref.current.value = fixTttsText(this.state.sentences[i].text);
		}	
		await this.onStateChanges('sentences');	
	}
	loadSentence(){
		const sentence = Object.assign({},this.props.activeSentence);
		let sentences =[]; 

		try{
			sentences = JSON.parse(sentence.sentences); 
			this.rebuildSentences(sentences); 
			console.log(sentences)
		}catch(e){
			console.log(e)
		}
		if(typeof sentences == 'object'){
			if(typeof sentences.length != 'undefined'){
				this.setState({sentences},async()=>{
						await this.loadSentences();
				})
			}else{
				this.setState({sentences:[]},()=>this.fixEmptySentences())
			}
		}else{
			this.setState({sentences:[]},()=>this.fixEmptySentences())
		}

		this.setState({sentence},()=>this.fixEmptySentences());

		this.stInputNameRef.current.value = sentence.name;
		this.stInputTextRef.current.value = sentence.text;
		this.stInputTtfRef.current.value = sentence.ttf_text;

		// console.log(this.props.activeSentence)
	}
	async onStateChanges(key){
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
	async runTttsJob(){
		const uuid = localStorage.socketUuid;
		const url = `http://localhost:7000/job?uuid=${uuid}&job_name=tts`;

		const params = new URLSearchParams({  });
		params.append('project_id', v4());
		params.append('text',this.ttfTextInputRef.current.value);

	

		return axios.post(url, params);
	}

	async runHandler(evt){
		if(this.textInputRef.current.value.length < 20){
			this.setState({
				inputStatus:2
			})
			return;
		}
		// const runBtnCls = this.runBtnRef.current.className.split(' ');

		// if(!runBtnCls.includes('disabled')){
		// 	runBtnCls.push('disabled');
		// 	this.runBtnRef.current.className = runBtnCls.join(' ');

		// }
		this.setState({onProcess:true},async ()=>{
			this.ttfTextInputRef.current.value = ""
			for(let i in this.state.sentences){
				const item = this.state.sentences[i];
				const type = item.type;
				const text =  item.ref.current.value;
				console.log(`Processing ${text}`)
				// await setTimeout(()=>{console.log('HTTP ok')},1000);
				const result = await this.createTtsProject(text);
				const data = result.data;
				const project = data.project;
				const ttfText = project.word_list_ttf_str;
				const lastTtfText = this.ttfTextInputRef.current.value;
				this.ttfTextInputRef.current.value = lastTtfText + ' ' + (type=='dot'?'. ':', ') + ttfText;
				// console.log(r)
				// break;
			}
			const jobs = await this.runTttsJob();
			console.log(jobs);
			this.setState({onProcess:false})

		});
		// console.log(runBtnCls)
	}	

	async createTtsProject(text){
		var bodyFormData = new FormData();
		bodyFormData.append('text', text);

		return axios({
			method: "post",
			url: `http://localhost/api/tts/project`,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
	}
	runHandlerProxy(itemText, index){
		var bodyFormData = new FormData();
		bodyFormData.append('text', itemText);

		axios({
			method: "post",
			url: `http://localhost/api/tts/project`,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
		.then(function (response) {
 
			console.log(response);
			const ttfText = response.data.project.word_list_ttf_str;
			this.ttfTextInputRef.current.value = ttfText;

			// runTttsJob(ttfText)
		})
		.catch(function (response) {
			//handle error
			console.log(response);
		});
	}

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

	sentenceInputChangeHandler(evt){
		// console.log(evt.target.value)
	}
	textInputChangeHandler(evt){
		const text = evt.target.value;
		if(!text){
			return;
		}
		
		delay(async(e)=>{
			const sentence = this.state.sentence;
			sentence.text = text;
			this.setState({inputStatus:0, sentence});
			this.updateSentences(text,async()=>{
				await this.updateRemoteSentence();
				await this.onStateChanges('sentences');	
			});

		  
		})

	}
	ttfTextInputChangeHandler(evt){
		console.log(evt.target.value)

	}

	async convertTtfRemote(text){
		const res = await axios(`http://localhost/api/tts/convert?text=${encodeURI(text)}`);

		return res.data;
	}
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
	stSentenceItemChangeHandler(evt, index){
		const text = evt.target.value;
		delay(async()=>{
			const sentences = this.state.sentences;
			const item = sentences[index];
			item.text = text;
			await this.updateRemoteItem(text, index);
			await this.updateRemoteSentence();

		});
	}
	stInputNameChangeHandler(evt){
		// console.log(evt.target.value)
		const name = evt.target.value;
		if(!name){
			return;
		}
		delay(async(e)=>{
		  // console.log('Time elapsed!', evt.target.value);
		  const sentence = this.state.sentence;
		  sentence.name = evt.target.value;
		  this.setState({sentence});

		  await this.updateRemoteSentence();
		})
	}
	async updateRemoteSentence(){
		var bodyFormData = new FormData();
		const {id,name,text,ttf_text} = this.state.sentence;
		const sentences = []; 
		for(let i in this.state.sentences){
			const item = this.state.sentences[i];
			sentences.push({
				text : item.text,
				type : item.type,
				ttf : item.ttf
			})
		}
		bodyFormData.append('name', name);
		bodyFormData.append('text', text);
		bodyFormData.append('sentences', JSON.stringify(sentences));
		bodyFormData.append('ttf_text', ttf_text);

		return axios({
			method: "post",
			url: `http://localhost/api/tts/sentence?id=${id}`,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
	}
	render (){
		const socketConnected = this.props.socketConnected; 
	return(<>
			<div className="container">
				<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
			  	<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Name</label>
				  <input onChange={evt=>this.stInputNameChangeHandler(evt)} ref={this.stInputNameRef} type="text" id="inline-input-label-with-helper-text" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Sentence name" aria-describedby="hs-inline-input-helper-text"/>
				  <p className="text-sm text-gray-500 mt-2" id="hs-inline-input-helper-text">{/*We'll never share your details.*/}</p>
				</div>
			<div className="relative my-3">
				<textarea  ref={this.stInputTextRef} onChange={evt=>this.textInputChangeHandler(evt)} className={this.state.inputStatus == 0 ? this.inputDefaultCls : (this.state.inputStatus==1?this.inputOkCls : this.inputErrorCls)} rows="3" placeholder="Sentence text"></textarea>	
			
			{this.state.inputStatus==2?(<div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
      
      
      <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
      </svg>
    </div>):""}
			{this.state.inputStatus==1?(<div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
      </svg>
    </div>):""}
			</div>

			{
				this.state.sentences.map((sentence,index)=>{
					let cls = "h-12 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
					
					cls += sentence.type == 'dot' ? " " : " bg-gray-100"
					
					return(
						<div className={"sentence my-1"} key={index}>
							<textarea  ref={this.state.sentences[index].ref} onChange={evt=>this.stSentenceItemChangeHandler(evt,index)} className={cls} rows="3" placeholder="This is a textarea placeholder"></textarea>	
						</div>
					)
				})
			}
			<div>
				<textarea  ref={this.stInputTtfRef} onChange={evt=>ttfTextInputChangeHandler(evt)} className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" rows="3" placeholder="Sentence ttf text"></textarea>	
			</div>
			<div className="columns-2 my-3">
				<div>
				<div className="bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-md p-4" role="alert">
{
	socketConnected? (
		<span className="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-blue-600 text-white">
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
  </svg>
</span>
	):(
<span className="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
  </svg>
</span>
	)
	}



  </div>
				</div>

				<div className="text-right">
					<button disabled={this.state.onProcess} ref={this.runBtnRef} onClick={evt=>this.runHandler(evt)} className="py-3 px-4 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
				  {this.state.onProcess?(
				  	<span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
				    	<span className="sr-only">Loading...</span>
				  	</span>):""	}
				  Run
				  {!this.state.onProcess?(<svg className="w-2.5 h-auto" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				    <path fillRule="evenodd" clipRule="evenodd" d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z" fill="currentColor"/>
				  </svg>):""	}
				</button>
				</div>
			</div>
		</div>	
	</>)
}
}