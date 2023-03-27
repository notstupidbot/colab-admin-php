import React from "react"
import axios from "axios"
import AppConfig from "../../lib/AppConfig"
import Helper from "../../lib/Helper"
import Pager from "./Pager"
import {v4} from "uuid"
import moment from "moment"
import "moment/dist/locale/id";
moment.locale('id');

export default class SentenceTab extends React.Component{
	state = {
		grid :{
			records : [],
			limit : 10,
			page : 1,
			total_pages : 0,
			total_records : 0,
			order_by:'create_date',
			order_dir:'desc'
		}
		
	}
	// const updateProjectList = async()=>{
		
	// }
	viewInEditor(sentence){
		this.props.setActiveTab('sentence-editor');
		this.props.setActiveSentence(sentence);
		
	}
	async componentDidMount(){
		// await this.updateList()
	}
	async updateListWithOrder(order_by){
		const order_dir = this.state.grid.order_by == order_by ? (this.state.grid.order_dir == 'asc' ? 'desc' : 'asc') : 'asc';
		const grid = this.state.grid;
		grid.order_by = order_by;
		grid.order_dir = order_dir;

		this.setState({grid});

		await this.updateList(this.state.grid.page)
	}
	async updateList(page_number){
		page_number = page_number || 1;
		let grid = this.state.grid;
		grid.records =[]
		this.setState({grid})
		// await timeout(2000)
		const {config} = this.props
		const res = await axios(`${config.getApiEndpoint()}/api/tts/sentence?page=${page_number}&order_by=${grid.order_by}&order_dir=${grid.order_dir}`);
		 grid = Object.assign(grid,res.data);
		this.setState({grid})
		return grid;
	}
	async addSentenceHandler(evt){
		console.log('Add sentence clicked');

		

		var bodyFormData = new FormData();
		bodyFormData.append('content', 'xxxx');
		bodyFormData.append('title', 'Untitled Sentence '+(v4().replace(/\-/g,'')) );
		bodyFormData.append('sentences', '[]');
		bodyFormData.append('content_ttf', '');
		bodyFormData.append('output_file', '-');
		const {config} = this.props

		const res = await axios({
			method: "post",
			url: `${config.getApiEndpoint()}/api/tts/sentence`,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		});

		await this.updateList(this.state.grid.page);

	}

	render(){
		const dummyRow= [1,2,3,4,5,6,7,8,9]
return(<>
<div className="pager">
<button onClick={evt=>this.addSentenceHandler(evt)} style={{zIndex:15}} title="Add Sentence"
        className="fixed z-90 bottom-10 right-8 bg-blue-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">
			<i className="bi bi-file-plus"></i>
		</button>
</div>
<div className="flex flex-col">
  <div className="-m-1.5 overflow-x-auto">
    <div className="p-1.5 min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">No</th>

              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              	<button onClick={evt=>this.updateListWithOrder('title')}>{this.state.grid.order_by=='title' ? (this.state.grid.order_dir=='asc'?(<i class="bi bi-sort-alpha-down"></i>):(<i class="bi bi-sort-alpha-up"></i>)):''} Title/Date</button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              <button onClick={evt=>this.updateListWithOrder('content')}>{this.state.grid.order_by=='content' ? (this.state.grid.order_dir=='asc'?(<i class="bi bi-sort-alpha-down"></i>):(<i class="bi bi-sort-alpha-up"></i>)):''} Content</button>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
          {
          	this.state.grid.records.length == 0 ?
          		dummyRow.map(r=>{return(
          		<tr className="animate-pulse" key={r}>
          			<td className="w-1/3 "><span className="my-2 h-4 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-1/3 "><span className="my-2 h-4 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-2/3 "><span className="my-2 h-4 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-1/3"><span className=" my-2 h-4 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			
          		</tr>
          	)})
          	:""
          }
          {
          	this.state.grid.records.map((item,index)=>{
          		return(
          			<tr key={index} className="odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700">
		              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		              { (parseInt(index) + 1) + ((parseInt(this.state.grid.page)-1) * parseInt(this.state.grid.limit))}
		              </td>

		              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.title} <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{moment(item.create_date).format('MMMM Do YYYY, h:mm:ss a')}</span>
</td>
		              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{item.content}</td>
		              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		                <button className="text-blue-500 hover:text-blue-700" onClick={evt=>this.viewInEditor(item)}>View in Editor</button>
		              </td>
		            </tr>
          		)
          	})
          }
            

           
          </tbody>
        </table>
      </div>
      <Pager page={this.state.grid.page} total_pages={this.state.grid.total_pages} limit={this.state.grid.limit} gotoPage={(page_number)=>this.updateList(page_number)}/>
    </div>
  </div>
</div>		
	</>)
	}
}