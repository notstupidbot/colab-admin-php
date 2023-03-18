import React ,{useEffect,useState,useRef}from "react";
import axios from "axios"

import { Link, useLoaderData } from 'react-router-dom';

 
import Pager from "../tts/Pager"
import AppConfig from "../../lib/AppConfig"
import Helper from "../../lib/Helper"

export async function loader({ params }) {
  const page = parseInt(params.pageNumber) || 1;
  return { page };
}

let dontRunTwice = true
const delay = Helper.makeDelay(512)

export default function TtsServerPrefTab(){
	const {page} = useLoaderData()
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
		const res = await axios(`${AppConfig.getInstance().getApiEndpoint()}/api/tts/preferences?page=${page}&limit=${grid.limit}&group=tts_server`);
		setGrid(res.data)
		
	}
	const viewInEditor = (project)=>{
		// console.log(project);
		setActiveProject(project);
		setActiveTab('project-editor');

	}
	useEffect(()=>{
		// if(activeTab == 'project'){
			// updateProjectList();
		// 	dontRunTwice = false
		// }
		delay(()=>{
			console.log(page)
			updateProjectList();
		})
		
	},[page]);

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
              <th scope="col"  className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
              <th scope="col"  className="w-3/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
          {
          	grid.records.length == 0 ?
          		Array(parseInt(grid.limit)).fill(1).map((a,r)=>{return(
          		<tr className="animate-pulse" key={r}>
          			<td className=""><span className="my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
          			<td className="w-1/4 "><span className="my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"></span></td>
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
		              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.key}</td>
		              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.val}</td>

		              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		                <Link className="text-blue-500 hover:text-blue-700" to={`/preferences/tts-server/${item.id}`}><i className="bi bi-pencil-square"></i></Link>
		              </td>
		            </tr>
          		)
          	})
          }
            

           
          </tbody>
        </table>
      </div>
      <div className="mt-3">
      <Pager path="/preferences/tts-server" page={grid.page} total_pages={grid.total_pages} limit={grid.limit}/>
      </div>
    </div>
  </div>
</div>		
</div>		
	</>)
}