import React from "react"
import Helper from "../Helper"
import {Link} from "react-router-dom"
import {v4} from "uuid"
const GridItemEmpty = ({spanCls, limit}) => {
	const dummyRecords =Array(limit).fill(0)
	return(<>
		{
			dummyRecords.map((value,index)=>{
				return (<tr className="animate-pulse" key={index}>
		          			<td><span className={spanCls}></span></td>
		          			<td><span className={spanCls}></span></td>
		          			<td><span className={spanCls}></span></td>
		          			<td><span className={spanCls}></span></td>
		          		</tr>)
			})
		}
	</>)
}

const GridItemLoading = ({}) => {
	
}
const GridActions = ({options, item, index, linkCls}) => {
	if(options.enableEdit){
		if(options.callbackActions){
			if(options.callbackActions.edit){
				return options.callbackActions.edit(item, index, options, linkCls)
			}
		}
		return (<Link className={linkCls} to={typeof options.editUrl == 'function' ? options.editUrl(item) : options.editUrl}>
            	<i className="bi bi-pencil-square"></i> Edit
               </Link>)
	}

}
const GridItems = ({empty, records, page, limit, options}) => {
	const spanCls = "my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"
	const tdCls  = "px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200"
	const tdCls2 = "px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
	const trCls = "odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700"
	const linkCls = "text-blue-500 hover:text-blue-700"

	const recordNumber=(index)=>{
		const p = (parseInt(index) + 1);
		const gp = parseInt(page)-1;
		const lim =   parseInt(limit||5)

		index = p + (gp * lim)
		return index
	}

	const editorFactory = () => {
		console.log(`dummy editorFactory`)
	}

	const parseCustomAction = item => {
		if(options.actions){
			if(options.actions.edit){
				return options.actions.edit(item)
			}
		}
	}


	return (<>
	{
		empty ? (<GridItemEmpty spanCls={spanCls} limit={limit}/>) : records.map((item,index)=>{
      		return(
      			<tr key={index} className={trCls}>
	              <td className={tdCls}>
	              	{ recordNumber(index) }
	              </td>
	              {
	              	options.fields.map((field, field_index)=>{
	              		const value = item[field]
	              		let field_text = value
	              		if(options.callbackFields){
	              			if(options.callbackFields[field]){
	              				field_text = options.callbackFields[field](field, value ,item)
	              			}
	              		}
	              		return (<td key={field_index} className={tdCls}>{field_text}</td>)
	              	})
	              }
	              

	              <td className={tdCls2}>
	                <GridActions options={options} index={index} item={item} linkCls={linkCls}/>
	              </td>
	            </tr>
      		)
      	})
    }</>)  	
}

const GridHeaders = ({options}) => {
	const tableCls = "min-w-full divide-y divide-gray-200 dark:divide-gray-700"
	const tableHeaderCls = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
	const numberWidthCls = options.numberWidthCls || ''
	const actionWidthCls = options.actionWidthCls || ''
	return (<tr>
      <th scope="col" className={`${numberWidthCls} ${tableHeaderCls}`}>No</th>
      {
      	options.headers.map((caption, index) =>{
      		const tableHeaderWidthCls = options.widthCls[index] || ''
      		return (<th key={index} scope="col" className={`${tableHeaderWidthCls} ${tableHeaderCls}`}>{caption}</th>)
      	})
      }
      <th scope="col" className={`${actionWidthCls} ${tableHeaderCls}`}>Action</th>
    </tr>)
}
const GridTable = ({records, page, limit, options}) => {
	const tableCls = "min-w-full divide-y divide-gray-200 dark:divide-gray-700"
	
	const emptyRecords = records ? (records.length > 0 ? false : true) : true
	return (<table className={tableCls}>
          <thead>
            <GridHeaders options={options}/>
          </thead>
          <tbody>
          	<GridItems empty={emptyRecords} 
          			   records={records} 
          			   page={page} 
          			   limit={limit}
          			   options={options}/>
          </tbody>
        </table>)
}
class Grid extends React.Component{

	constructor(props){
		super(props)
		// this.state = {
		// 	records : []
		// }
	}
	render(){
		// const {records, page, limit} = this.props
		return (<GridTable {...this.props}/>)
	}
}

export default Grid