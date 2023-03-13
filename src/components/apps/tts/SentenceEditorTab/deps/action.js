export default class Action{
	constructor(){
		super()
		this.stInputNameRef = React.createRef(null)
		this.stInputTtfRef = React.createRef(null)
		this.runBtnRef = React.createRef(null)
		this.stInputTextRef = React.createRef(null)
		this.audioRef = React.createRef(null)
		this.jobCheckerRef = React.createRef(null)
	}
 	componentDidMount(){

		if(dontRunTwice){
				this.loadSocketCallback();
				this.loadRow();
				dontRunTwice=false;
		}

		
		this.loadGrowWrap();

		this.hideSideBar()
		
	}
	loadGrowWrap(){

		const growers = document.querySelectorAll(".grow-wrap");
		// console.log(growers)
		growers.forEach((grower) => {
		  const textarea = grower.querySelector("textarea");
				if(!$(textarea).hasClass('growed-up')){
					textarea.addEventListener("input", () => {
					    grower.dataset.replicatedValue = textarea.value;
					  });
		  			$(textarea).addClass('growed-up')

				}
		  
		});

		setTimeout(()=>{
			$('.grow-wrap textarea').each((i,el)=>{
				// console.log(i,el)
				
					el.dispatchEvent(new Event("input"));

			});
		},1000)
	}
	hideSideBar(){
		try{
		console.log(this.props.mainContent.props.sideBar.current.setState({hidden:true}))

		}catch(e){}
		// $('#docs-sidebar').hide()
	}
	processSocketLog(message, data){
		console.log('processSocketLog',data)
		if(typeof data.job == 'object'){
			this.jobCheckerRemove(data.job);

			if(data.job.name == 'tts'){
			let success = data.success;
			success == true ? true : (success == -1 ? false : (success== 1? true : false))
			const chunkMode = data.chunkMode;

			try{
				message += ` done in ${data.job.ps_output.info.processing_time} seconds`

			}catch(e){}

			this.doToast(message, success)
			
			if(data.at == 'run_process'){
				if(chunkMode){
					const index = data.index;
					const audio_source = `${app_config.getApiEndpoint()}/public/tts-output/${data.sentence_id}-${index}.wav?uuid=${v4()}`;
					setTimeout(()=>{

						const sentences = this.state.sentences;
						sentences[index].audio_source = audio_source;
						sentences[index].loading_ttf = false;
						
						this.setState({sentences},()=>{
								this.state.sentences[index].audio_ref.current.load();
								setTimeout(()=>{
									this.state.sentences[index].audio_ref.current.play();
								},250)
						});

					},250);
				}else{
					const audioOutput = `${app_config.getApiEndpoint()}/public/tts-output/${data.sentence_id}.wav?uuid=${v4()}`;
					this.setState({onProcess:false,audioOutput},()=>{
							this.audioRef.current.load();
							setTimeout(()=>{
								this.audioRef.current.play();
							},250)
					});
				}
			}
			if(data.at == 'create_job'){
				
			}
			
		}
		}
		
	}
	loadSocketCallback(){
		const self = this;
		this.props.onSocketConnect((socket)=>{
			console.log(`${socket.id} connected on SentenceEditorTab`)
		});
		this.props.onSocketLog((message, data)=>{
			console.log(`${message} arived SentenceEditorTab`)

			self.processSocketLog(message, data)

		});
	}

	async savePreference(){
		const url = `${app_config.getApiEndpoint()}/api/tts/preference?key=SentenceEditorTab`;
		const data = new FormData();
		data.append('val', JSON.stringify(this.model.toRow()));

		const res = axios({
			method: "post",
			url,
			data: data,
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data;
	}
	async loadPreference(){
		const url = `${app_config.getApiEndpoint()}/api/tts/preference?key=SentenceEditorTab`;
		const pref = await axios(url);
		return pref;
	}
	async loadRow(){
		console.log(`STEP 0`);
		let row = this.props.activeSentence;
		let loadedFromPreference = false;
		
		if(!row){
			const pref = await this.loadPreference();
			try{
				loadedFromPreference = true;
				row = pref.data.val;				
			}catch(e){
				loadedFromPreference =false;
			}
		}
		if(!row){
			return
		}

		console.log(row);
		const self = this;
		this.setState({audioOutput:`${app_config.getApiEndpoint()}/public/tts-output/${row.id}.wav?uuid=${v4()}`},()=>{
			self.audioRef.current.load();

						setTimeout(()=>{
							// self.audioRef.current.play();
						},250)
		})
		this.model = Sentence.fromRow(row);
		// console.log(this.model);
		if(!loadedFromPreference){
			this.savePreference();
		}

		
		this.model.setEditor(this);
		this.loadFormData();
		this.loadSentencesFormData(); 

	}
	
	loadFormData(){
		this.stInputNameRef.current.value = this.model.getTitle();
		this.stInputTextRef.current.value = this.model.getContent();
		this.stInputTtfRef.current.value = this.model.getContentTtf(); 


		this.setState({cm_text: this.model.getContent(), ttfText: this.model.getContentTtf()},()=>{
			setTimeout(()=>{
					this.loadGrowWrap()
			},1000)
		})
	}

	loadSentencesFormData(){
		const sentences = this.model.getSentences().getItems();
		this.setState({sentences},o=>{
			this.model.getSentences().setItemsRefValue()
			setTimeout(()=>{
					this.model.getSentences().loadItemRefAudioSource();
					this.loadGrowWrap()
			},1000)
		})
	} 

 
 
	
	chSentencesItemHandler(evt, index){
		const text = evt.target.value;
		console.log(text)
		/*
		delay(async()=>{
			await this.model.getSentences().updateItem(text, index);
		  await this.model.updateRow();
		  this.loadSentencesFormData()
			if(!this.stInputTtfRef.current.value){
		  	console.log(`this.stInputTtfRef.current.value is empty`);
		  	this.stInputTtfRef.current.value = this.model.getContentTtf(true);
		  }
			
		});
		*/
	}

 
	
 
 
	async queueTaskSentenceItemHandler(evt){
		for(let index in this.state.sentences){
			const node = this.state.sentences[index].ref.current;
			const text = node.value;
			await this.model.getSentences().updateItem(text, index, true);
		  await this.model.updateRow(true);
		  // this.loadSentencesFormData()
		  const ttfText = this.model.getContentTtf(true);
		 	this.stInputTtfRef.current.value = ttfText;
		 	this.setState({ttfText})	
		}
	}
 
	jobCheckerAdd(job){
		const jobChecker = this.jobCheckerRef.current;
		const jobList = jobChecker.state.jobList;
		const job_id = job.id;
		jobList[job_id] = job;
		jobChecker.setState({jobList});
	}
	jobCheckerRemove(job){
		const jobChecker = this.jobCheckerRef.current;
		const jobList = jobChecker.state.jobList;
		const job_id = job.id;
		delete jobList[job_id];
		jobChecker.setState({jobList});
	}


}