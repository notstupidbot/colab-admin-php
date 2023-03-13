import React ,{useEffect,useState,useRef}from "react";
import { useBetween } from "use-between";
import axios from "axios"


import app_config from "../../../app.config" 
import Pager from "./Pager"

let dontRunTwice = true
export default function ProjectTab({setActiveProject,setActiveTab,activeTab}){

	const [projectList,setProjectList] = useState([
		
	]);
	const [grid,setGrid] = useState({
			records : [],
			limit : 5,
			page : 1,
			total_pages : 0,
			total_records : 0,
			order_by:'create_date',
			order_dir:'desc'
		});
 

	const updateProjectList = async(page_number)=>{
		page_number = page_number || 1;
		grid.page = page_number;
		grid.records = [];
		setGrid(Object.assign({},grid))
		const res = await axios(`${app_config.getApiEndpoint()}/api/tts/project?page=${grid.page}&limit=${grid.limit}`);
		setGrid(res.data)
		
	}
	const viewInEditor = (project)=>{
		// console.log(project);
		setActiveProject(project);
		setActiveTab('project-editor');

	}
	useEffect(()=>{
		if(activeTab == 'project'){
			updateProjectList();
		// 	dontRunTwice = false
		}
	},[activeTab]);

	const pageNumber=(index)=>{
		const p = (parseInt(index) + 1);
		const gp = parseInt(grid.page)-1;
		const lim =   parseInt(grid.limit||10)

		index = p + (gp * lim)
		return index
	}
	// const editProject=(project)=>{
	// 	console.log(project)
	// }

	return(<>
<div className="border mb-2 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">		
<div className="flex flex-col">
  <div className="-m-1.5 overflow-x-auto">
    <div className="p-1.5 min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th scope="col"  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
              <th scope="col"  className="w-3/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
          {
          	grid.records.length == 0 ?
          		Array(parseInt(grid.limit)).fill(1).map((a,r)=>{return(
          		<tr className="animate-pulse" key={r}>
          			<td className=""><span className="my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-3/4 "><span className="my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className=""><span className=" my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			
          		</tr>
          	)})
          	:""
          }
          {
          	grid.records.map((item,index)=>{
          		return(
          			<tr key={index} className="odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700">
		              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
		              	{ pageNumber(index)}
		              </td>
		              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</td>

		              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		                <button className="text-blue-500 hover:text-blue-700" onClick={evt=>viewInEditor(item)}><i className="bi bi-pencil-square"></i></button>
		              </td>
		            </tr>
          		)
          	})
          }
            

           
          </tbody>
        </table>
      </div>
      <div className="mt-3">
      <Pager page={grid.page} total_pages={grid.total_pages} limit={grid.limit} gotoPage={(page_number)=>updateProjectList(page_number)}/>
      </div>
    </div>
  </div>
</div>		
</div>		
	</>)
}