import React ,{useEffect,useState,useRef}from "react";
import axios from "axios"
import { Link, useLoaderData } from 'react-router-dom';
import {PrefEditorBoolean,
	PrefEditorInteger,
	PrefEditorObject,
	PrefEditorString} from "./PreferenceEditor";

import Pager from "../tts/Pager"
import AppConfig from "../../lib/AppConfig"
import Helper from "../../lib/Helper"
import Store from "./Store"
import Grid from "../../lib/grid/Grid"

export async function loader({ params }) {
  const page = parseInt(params.pageNumber) || 1;
  return { page };
}

let dontRunTwice = true
const delay = Helper.makeDelay(512)

export default function TtsServerPrefTab({config}){
	const {page} = useLoaderData()
	const store = new Store(config)
	const [projectList,setProjectList] = useState([]);
	const editorFactoryRefs = []
	
	const [grid,setGrid] = useState({
			records : [],
			limit : 5,
			page : 1,
			total_pages : 0,
			total_records : 0,
			order_by:'key',
			order_dir:'asc'
		});
 

	const updateList = async(page_number)=>{
		let newGrid = Object.assign({},grid)
		setGrid(null)
		page_number = page_number || 1;
		newGrid.page = page_number;
		newGrid.limit = grid.limit||5
		newGrid.records = [];
		
		setGrid(null)

		const data = await store.getTtsPreferenceList(page_number, grid.limit, grid.order_by, grid.order_dir)
		if(data){
			newGrid = Object.assign(newGrid,data)
			setGrid(newGrid)
		}
	}

	useEffect(()=>{
		updateList(page);		
	},[page]);

	// useEffect(()=>{
	// 	updateList(1)
	// },[])
	
	const onRefresh = async(e,setLoading)=>{
		setLoading(true)	
		await updateList(grid.page);
		setLoading(false)
	}
	const editorFactory = (item, index) => {
		if(!editorFactoryRefs[index]){
			editorFactoryRefs[index] = React.createRef(null)
		}
		const ref = editorFactoryRefs[index]
		const components = {
			boolean : <PrefEditorBoolean item={item} ref={ref}/>,
			string : <PrefEditorString item={item} ref={ref}/>,
			object : <PrefEditorObject item={item} ref={ref}/>,
			integer : <PrefEditorInteger item={item} ref={ref}/>
		}
		// setEditorFactoryRefs(editorFactoryRefs)
		const component = components[item.editor];
		return component
	}
 	const onCancelRow = async(item, index, options, linkCls, gridAction) => {
 		const editor = editorFactoryRefs[index].current
 		
 		 editor.setGridAction(gridAction)
 		 editor.cancelRow(true)
 	}
 	const onEditRow = async(item, index, options, linkCls, gridAction) => {
 		const editor = editorFactoryRefs[index].current
 		const editMode = gridAction.state.editMode
 		editor.setGridAction(gridAction)
 		if(!editMode){
 			editor.editRow()
 			// console.log(editor)

 		}else{
 			editor.saveRow()

 		}
 		// gridAction.setState({editMode: !editMode})
 	}
 	const getLinkButton = ()=>{
		return <button className={''} onClick={evt => onEditRow()}>
    		<i className="bi bi-pencil-square"></i> Ubah</button>
  }
	const gridOptions = {
		numberWidthCls : '',
		actionWidthCls : '',
		widthCls : ['3/8','5/8'],
		headers : ['Setting', 'Value'],
		fields : ['key','value'],
		enableEdit : true,
		editUrl : (item) =>{ return `/preferences/tts-server/${item.key}`},
		remoteUrl : (item) => `${config.getApiEndpoint()}/api/tts/preference?key=${item.key}`,
		callbackFields : {
			key : (field, value ,item) => {
				return item.desc.length == 0 ? Helper.titleCase(value) : item.desc
			}, 
			value : (field, value, item, index) => {
				return editorFactory(item, index)
			}
		},

		callbackActions : {
			edit : (item, index, options, linkCls, gridAction) => {
				return(<> <button className={linkCls} onClick={evt => onEditRow(item, index, options, linkCls, gridAction)}>
					            	<i className="bi bi-pencil-square"></i> {gridAction.state.editMode ? 'Save' : 'Edit'}
					               </button>
					               {gridAction.state.editMode ? (<>
					               	<button className={"ml-2 "+linkCls} onClick={evt => onCancelRow(item, index, options, linkCls, gridAction)}>
					            	<i className="bi bi-x-circle"></i> Cancel 
					               </button>
					               </>) : ''}</>)
	   
			}
		}
	}
	const containerCls = "border mb-2 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700"
	if(!grid){
		return 'no data'
	}
	return(<div className={containerCls}>		
				<div className="flex flex-col">
	  				<div className="-m-1.5 overflow-x-auto">
	    				<div className="p-1.5 min-w-full inline-block align-middle">
	      					<div className="overflow-hidden">
	        					<Grid options={gridOptions} records={grid.records} page={grid.page} limit={grid.limit} />
	      					</div>
	      					<div className="pager-container mt-3">
	      						<Pager path="/preferences/tts-server" 
	      							   page={grid.page} 
	      							   total_pages={grid.total_pages} 
	      							   limit={grid.limit}
	      							   onRefresh={onRefresh}/>

	      					</div>
	    				</div>
	  				</div>
				</div>		
			</div>)
}