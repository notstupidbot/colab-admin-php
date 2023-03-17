import React ,{useState,useEffect}from "react"
import axios from "axios"
import "bootstrap-icons/font/bootstrap-icons.css"
import Pager from "./Pager"
import {v4} from "uuid"
import moment from "moment"
import "moment/dist/locale/id";
moment.locale('id');
import AppConfig from "../../lib/AppConfig"
import Helper from "../../lib/Helper"
const delay = Helper.makeDelay(750)
let lastProjectId = null
let lastFetch = null
import { Link, NavLink } from 'react-router-dom';

export default function ProjectItem({project}){
	const [gridLoading,setGridLoading] = useState(false)
	const [grid, setGrid] = useState({
			records : [],
			limit : 5,
			page : 1,
			loading : false,
			total_pages : 0,
			total_records : 0,
			order_by:'create_date',
			order_dir:'desc'
		})

	useEffect(()=>{
		// console.log(grid)
	},[grid])
	useEffect(()=>{
		// delay(async()=>{
			
		// })
		if(project){
			
			
			 updateList();

		}	
		
	},[project])

	const updateListWithOrder = async(order_by)=>{
		const order_dir = grid.order_by == order_by ? (grid.order_dir == 'asc' ? 'desc' : 'asc') : 'asc';
		grid.order_by = order_by;
		grid.order_dir = order_dir;

		setGrid(grid);

		await updateList(grid.page)
	}
	const updateList = async(page_number)=>{
		setGridLoading(true)
		page_number = page_number || 1;
		grid.page = page_number;
		grid.records = [];
		setGrid(Object.assign({},grid))
		const project_id = project.id;
		const res = await axios(`${AppConfig.getInstance().getApiEndpoint()}/api/tts/sentence?page=${page_number}&order_by=${grid.order_by}&order_dir=${grid.order_dir}&project_id=${project_id}`);
		setGrid(res.data)
		setGridLoading(false)

	}
	const addSentenceHandler = async(evt)=>{
		console.log('Add sentence clicked');

		

		var bodyFormData = new FormData();
		bodyFormData.append('content', 'xxxx');
		bodyFormData.append('title', 'Untitled Sentence '+(v4().replace(/\-/g,'')) );
		bodyFormData.append('sentences', '[]');
		bodyFormData.append('content_ttf', '');
		bodyFormData.append('output_file', '-');
		bodyFormData.append('project_id', project.id);

		const res = await axios({
			method: "post",
			url: `${AppConfig.getInstance().getApiEndpoint()}/api/tts/sentence`,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		});

		await updateList(grid.page);

	}


		const dummyRow= [1,2,3,4,5,6,7,8,9]
return(<>
<div className="pager">
<button onClick={evt=>addSentenceHandler(evt)} style={{zIndex:15}} title="Add Sentence"
        className="fixed z-90 bottom-10 right-8 bg-blue-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">
			<i className="bi bi-file-plus"></i>
		</button>
</div>
<h2 className="px-2 py-2 font-extrabold text-2xl text-center">Items</h2>
<div className="border rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">		

<div className="flex flex-col">
  <div className="-m-1.5 overflow-x-auto">
    <div className="p-1.5 min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">No</th>

              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              	<button onClick={evt=>updateListWithOrder('title')}>{grid.order_by=='title' ? (grid.order_dir=='asc'?(<i class="bi bi-sort-alpha-down"></i>):(<i class="bi bi-sort-alpha-up"></i>)):''} Title/Date</button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              <button onClick={evt=>updateListWithOrder('content')}>{grid.order_by=='content' ? (grid.order_dir=='asc'?(<i class="bi bi-sort-alpha-down"></i>):(<i class="bi bi-sort-alpha-up"></i>)):''} Content</button>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
          {
          	gridLoading ?
          		dummyRow.map(r=>{return(
          		<tr className="animate-pulse" key={r}>
          			<td className=""><span className="my-2 h-4 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-1/3 "><span className="my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-2/3 "><span className="my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-1/3"><span className=" my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			
          		</tr>
          	)})
          	:""
          }
          {
          	grid.records.length == 0 && !gridLoading ? (
          		<tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700">
		              <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200"> <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No records</span></td>
		            </tr>
          	):""
          }
          {
          	grid.records.map((item,index)=>{
          		return(
          			<tr key={index} className="odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700">
		              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		              { (parseInt(index) + 1) + ((parseInt(grid.page)-1) * parseInt(grid.limit))}
		              </td>

		              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.title} <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{moment(item.create_date).format('MMMM Do YYYY, h:mm:ss a')}</span>
</td>
		              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{item.content.substr(0,225)}</td>
		              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		                <Link className="text-blue-500 hover:text-blue-700" to={`/tts/sentence-editor/${item.id}`}>View in Editor</Link>
		              </td>
		            </tr>
          		)
          	})
          }
            

           
          </tbody>
        </table>
      </div>
      <div className="mt-3">

      <Pager page={grid.page} total_pages={grid.total_pages} path={`/project-editor/${project.id}`}/>
    </div>
    </div>
  </div>
</div>		
</div>		
	</>)
}