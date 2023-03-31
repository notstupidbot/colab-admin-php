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
	const [projectList,setProjectList] = useState([
		
	]);
	const editorFactoryRefs = []
	const [grid,setGrid] = useState({
			records : [],
			limit : 5,
			page : 1,
			total_pages : 0,
			total_records : 0,
			order_by:'create_date',
			order_dir:'desc'
		});
 

	const updateList = async(page_number)=>{
		page_number = page_number || 1;
		grid.page = page_number;
		grid.records = [];
		setGrid(Object.assign({},grid))

		const data = await store.getTtsPreferenceList(page_number, grid.limit)
		if(data)
			setGrid(data)
		
	}

	useEffect(()=>{
			updateList(page);		
	},[page]);

	
	const editorFactory = (item, index) => {
		if(!editorFactoryRefs[index]){
			editorFactoryRefs[index] = useRef(null)
		}
		const ref = editorFactoryRefs[index]
		const components = {
			boolean : <PrefEditorBoolean item={item} ref={ref}/>,
			string : <PrefEditorString item={item} ref={ref}/>,
			object : <PrefEditorObject item={item} ref={ref}/>,
			integer : <PrefEditorInteger item={item} ref={ref}/>
		}

		const component = components[item.editor];
		return component
	}
 	const onEditRow = async(item, index, options, linkCls) => {
 		const editor = editorFactoryRefs[index].current
 		console.log(editor)
 		editor.editRow()
 	}
	const gridOptions = {
		numberWidthCls : '',
		actionWidthCls : '',
		widthCls : ['3/8','5/8'],
		headers : ['Setting', 'Value'],
		fields : ['key','value'],
		enableEdit : true,
		editUrl : (item) =>{ return `/preferences/tts-server/${item.key}`},
		callbackFields : {
			key : (field, value ,item) => {
				return item.desc.length == 0 ? Helper.titleCase(value) : item.desc
			}, 
			value : (field, value, item, index) => {
				return editorFactory(item, index)
			}
		},

		callbackActions : {
			edit : (item, index, options, linkCls) => {
				/*
					return <Link className={linkCls} to={typeof options.editUrl == 'function' ? options.editUrl(item) : options.editUrl}>
					<i className="bi bi-pencil-square"></i> Ubah
					</Link>
				*/
				return <button className={linkCls} onClick={evt => onEditRow(item, index, options, linkCls)}>
	            	<i className="bi bi-pencil-square"></i> Ubah
	               </button>
			}
		}
	}
	const containerCls = "border mb-2 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700"
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
	      							   limit={grid.limit}/>
	      					</div>
	    				</div>
	  				</div>
				</div>		
			</div>)
}