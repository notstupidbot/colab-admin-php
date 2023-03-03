class Tts{
	static async runTttsJob(){
		const uuid = localStorage.socketUuid;
		const url = `http://localhost:7000/job?uuid=${uuid}&job_name=tts`;

		const params = new URLSearchParams({  });
		params.append('project_id', v4());
		params.append('text',this.ttfTextInputRef.current.value);

	

		return axios.post(url, params);
	}
	static async createTtsProject(text){
		var bodyFormData = new FormData();
		bodyFormData.append('text', text);

		return axios({
			method: "post",
			url: `http://localhost/api/tts/project`,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
	}	
	static runHandlerProxy(itemText, index){
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

	static async runHandler(evt){
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
}

export default Tts;