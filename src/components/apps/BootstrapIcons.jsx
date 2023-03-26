import {useState, useEffect} from "react"
import bootstrapIcons from "bootstrap-icons/font/bootstrap-icons.json"
import {useLoaderData} from "react-router-dom"
import Helper from "../lib/Helper"
import Pager from "./tts/Pager"
class ArrayPager {
	source = null
	limit = 5
	page = 1
	totalRecords = 0
	totalRecordsFiltered = 0

	totalPages = 0
	totalPagesFiltered = 0

	constructor(source, limit){
		console.log('ArrayPager.constructor()')
		this.source = source
		this.limit = limit

		this.calculate()
		console.log(this.totalRecords)
		console.log(this.totalPages)
	}

	fetch(page, filter){
		// console.log(offset,this.limit)
		let res;
		let sourceCopy = Object.assign([],this.source)
		if(typeof filter == 'string'){
			const qRegex = new RegExp(`${filter}`)
			sourceCopy = sourceCopy.filter(icon => icon.match(qRegex))
			this.calculate(filter, sourceCopy)

			if(page > this.totalPagesFiltered){
				page = this.totalPagesFiltered
			}
		}
		// else {
		const offset = (page-1) * this.limit

		res = sourceCopy.splice(offset,this.limit)
		// }// console.log(res)
		return res
	}

	calculate(filter, sourceCopy){
		if(typeof filter == 'string'){
			this.totalRecordsFiltered = sourceCopy.length
			this.totalPagesFiltered = Math.ceil(this.totalRecordsFiltered/this.limit)
			return this
		}
		this.totalRecords = this.source.length
		this.totalPages = Math.ceil(this.totalRecords/this.limit)
		return this
	}

	getTotalPages(filter){
		if(typeof filter == 'string'){
			return this.totalPagesFiltered
		}
		return this.totalPages
	}


}

const delay = Helper.makeDelay(1000)

export async function loader({ params }) {
  const pageNumber = parseInt(params.pageNumber) || 1;
  return { pageNumber };
}

let firstTimer = true
const BootstrapIcons = ({}) => {
	const {pageNumber} = useLoaderData()
	const hideSidebar = false
	const cls = "dark:text-white"
	const [icons,setIcons] = useState([])
	const [filter,setFilter] = useState([])
	const [bootstrapIconsArr,setBootstrapIconsArr] = useState(null)
	const [page,setPage] = useState([1])
	// const rowCount = Math.ceil(icons.length/100)
	// let bootstrapIconsArr = new ArrayPager(['test'],1)

	useEffect(()=>{
		Helper.delay(()=>{
			if(bootstrapIconsArr == null){
				console.log('A')
				setBootstrapIconsArr(new ArrayPager(Object.keys(bootstrapIcons),192))
			}
			setPage(1)
		document.body.style['overflow-x'] = "hidden"
		})
	},[])

	useEffect(()=>{
		if(!bootstrapIconsArr){
			return
		} 
		HSClipboard.collection = []
		setIcons(bootstrapIconsArr.fetch(page, filter))
		setTimeout(()=>{
			HSClipboard.init('.js-clipboard')
		},1000)
	},[page, bootstrapIconsArr, filter])

	useEffect(()=>{
		setPage(pageNumber)
	},[pageNumber])

	const onCopy = async(evt) => {
		await Helper.timeout(3000)
		evt.preventDefault()
	}
	const onFilter = async(evt) =>{
		delay(()=>{
			let query = evt.target.value
			if(query.length == 0)
				query = false
			setFilter(query)
			console.log(query)
			HSClipboard.collection = []
			setIcons(bootstrapIconsArr.fetch(page, query)) 
			setTimeout(()=>{
				HSClipboard.init('.js-clipboard')
			},3000)
		})
	}
	return(<>
		<div id="main-content"  className={cls +" pl-4 "+ (hideSidebar?"":"lg:pl-72")}>
		<div className={"search-container py-3 mb-4"}>
		<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
		  <label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Filter</label>
		  <input autoComplete="off" onChange={e=>onFilter(e)} type="text" id="inline-input-label-with-helper-text" className="py-3 px-4 block w-4/5 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="boostrap" aria-describedby="hs-inline-input-helper-text"/>
		  <p className="text-sm text-gray-500 mt-2" id="hs-inline-input-helper-text">Enter search here</p>
		</div>
		</div>
			<div className={`w-full columns-1 overflow-x-hidden`}>
				{ icons ?
					icons.map((icon,index)=>{
						const origIcon = icon
						const iconNumMatch = icon.match(/^\d+-(.*)-\d+$/)
						if(iconNumMatch){
							icon = iconNumMatch[1]
						}
						const iconNumMatch2 = icon.match(/^([a-z]*-)(.*)-\d+$/)
						if(iconNumMatch2){
							icon = iconNumMatch2[1]+iconNumMatch2[2]
						}
						return(<div className="gap-1 hs-tooltip inline-block  [--trigger:click] [--placement:right]" key={index}>
								  <a className="hs-tooltip-toggle block text-center" href={`#/bootstrap-icons/${icon}`} onClick={e=>e.preventDefault()}>
								    <span className="tooltip">
								      <i className={`bi bi-${icon}`}></i>
								    </span>
								    <div id={`bootstrap-icon-${icon}`} className="tooltip-content  hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible" role="tooltip">
								      <code>{`<i className="bi bi-${icon}"/>`}</code>

								      <a onClick={e=>onCopy(e)} className="ml-2 js-clipboard js-clipboard-item group"  
								      data-hs-clipboard-options={`{
								          "contentTarget": "#bootstrap-icon-${icon} code",
								          "successText": "Copied"
								      }`}>
								      <svg className="js-clipboard-default w-3 h-3 group-hover:rotate-6 transition" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
								        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
								      </svg>

								      <svg className="js-clipboard-success hidden w-3 h-3 text-blue-600 rotate-6" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
								      </svg>
								      <span className="js-clipboard-success-text">Copy</span>
								    </a>
								    </div>
								  </a>

						</div>)
					}):""
				}	
			</div>
			<div className="pager-container">
				{bootstrapIconsArr && icons ?(<Pager page={page} total_pages={bootstrapIconsArr.getTotalPages(filter)} path={`/bootstrap-icons`}/>):""
				}

			</div>
		</div>
	</>)
}

export default BootstrapIcons;