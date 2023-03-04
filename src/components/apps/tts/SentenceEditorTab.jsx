import React from "react";
import axios from "axios";
import {v4} from "uuid";
import {makeDelay,terbilang,fixTttsText,timeout,sleep} from "../../../helper";
import {Sentence, Sentences} from "../models/Sentences";

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

	model = null; 

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
 	componentDidMount(){

		if(dontRunTwice){
				this.loadSocketCallback();
				dontRunTwice=false;
		}

		this.hideSideBar()
		
	}
	hideSideBar(){
		try{
		console.log(this.props.mainContent.props.sideBar.current.setState({hidden:true}))

		}catch(e){}
		// $('#docs-sidebar').hide()
	}
	loadSocketCallback(){
			this.props.onSocketConnect((socket)=>{
				console.log(`${socket.id} connected on SentenceEditorTab`)
			});
			this.props.onSocketLog((message, data)=>{
				console.log(`log ${message} arrived in SentenceEditorTab`)
				console.log(data);

			});
	}
	loadRow(){
		console.log(`STEP 0`);
		const row = this.props.activeSentence;

		if(!row){
			return;
		}
		console.log(row);
		this.model = Sentence.fromRow(row);
		console.log(this.model);
		
		this.model.setEditor(this);
		this.loadFormData();
		this.loadSentencesFormData(); 

	}
	
	loadFormData(){
		this.stInputNameRef.current.value = this.model.getTitle();
		this.stInputTextRef.current.value = this.model.getContent();
		this.stInputTtfRef.current.value = this.model.getContentTtf(); 
	}

	loadSentencesFormData(){
		const sentences = this.model.getSentences().getItems();
		this.setState({sentences},o=>this.model.getSentences().setItemsRefValue())
	} 

	chContentHandler(evt){
		const content = evt.target.value;
		if(!content){
			return;
		}
		
		delay(async(e)=>{
		  this.model.setContent(content);
		  await this.model.updateRow();


		})

	}
	
	chContentTtfHandler(evt){
		const contentTtf = evt.target.value;
		delay(async(e)=>{
		  this.model.setContentTtf(contentTtf);
		  await this.model.updateRow();
		})
	}

	
	chSentencesItemHandler(evt, index){
		const text = evt.target.value;
		delay(async()=>{
			await this.model.getSentences().updateItem(text, index);
			await this.model.updateRow();
			if(!this.stInputTtfRef.current.value){
		  	console.log(`this.stInputTtfRef.current.value is empty`);
		  	this.stInputTtfRef.current.value = this.model.getContentTtf(true);
		  }
		});
	}

	chTitleHandler(evt){
		// console.log(evt.target.value)
		const title = evt.target.value;
		if(!title){
			return;
		}
		delay(async(e)=>{
		  this.model.setTitle(title);
		  await this.model.updateRow();
		})
	}
	
	render (){
		const socketConnected = this.props.socketConnected; 
	return(<>
			<div className="container">
				<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
			  	<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Title</label>
				  <input onChange={evt=>this.chTitleHandler(evt)} ref={this.stInputNameRef} type="text" id="inline-input-label-with-helper-text" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Sentence name" aria-describedby="hs-inline-input-helper-text"/>
				  <p className="text-sm text-gray-500 mt-2" id="hs-inline-input-helper-text">{/*We'll never share your details.*/}</p>
				</div>
			<div className="relative my-3">
				<textarea  ref={this.stInputTextRef} onChange={evt=>this.chContentHandler(evt)} className={this.state.inputStatus == 0 ? this.inputDefaultCls : (this.state.inputStatus==1?this.inputOkCls : this.inputErrorCls)} rows="3" placeholder="Sentence text"></textarea>	
			
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
							<textarea  ref={this.state.sentences[index].ref} onChange={evt=>this.chSentencesItemHandler(evt,index)} className={cls} rows="3" placeholder="This is a textarea placeholder"></textarea>	
						</div>
					)
				})
			}
			<div>
				<textarea  ref={this.stInputTtfRef} onChange={evt=>chContentTtfHandler(evt)} className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" rows="3" placeholder="Sentence ttf text"></textarea>	
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