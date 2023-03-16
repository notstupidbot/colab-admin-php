// import {v4} from "uuid"
import { Link } from 'react-router-dom';

export default function Pager({limit,total_pages,page, gotoPage, path=""}){
	const name = 'pager' 
	page = parseInt(page)
	total_pages = parseInt(total_pages)
	limit = parseInt(limit)
	const hasPrev = (page_number)=>{
		return page_number > 1;
	}
	const hasNext = (page_number)=>{
		return page_number < total_pages;
	}
	const forPages = ()=>{
		const pages = [];
		for(let i =0;i<total_pages; i++ ){
			pages.push(i+1)
		}
		return pages;
	}
	return(
		<nav className="flex items-center place-content-center space-x-2" key={name}>
		  {hasPrev(page)?(<Link key={`${name}-min-1`} className="text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md"
		  to={`${path}/page/${page-1}`}>
		    <span aria-hidden="true">«</span>
		    <span>Sebelum</span>
		  </Link>):""}
		  {forPages().map((page_number,index)=>{
		  	const isActive = (page_number == page);
		  	return isActive ? (<Link key={`${name}-num-${index}`} 
		  		className="w-10 h-10 bg-blue-500 text-white p-4 inline-flex items-center text-sm font-medium rounded-full"  
		  		aria-current="page"
		  		to={`${path}/page/${page_number}`}
		  		onClick={total_pages > 1? evt=>gotoPage(page_number):null}>{page_number}</Link>):(<Link key={`${name}-num-${index}`} 
		  		to={`${path}/page/${page_number}`}
		  		className="w-10 h-10 text-gray-500 hover:text-blue-600 p-4 inline-flex items-center text-sm font-medium rounded-full">{page_number}</Link>
		  )
		  })

		  }
		  {hasNext(page)?(<Link key={`${name}-plus-1`} className="text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md"  
		  	to={`${path}/page/${page+1}`}>
		    <span>Selanjutnya</span>
		    <span aria-hidden="true">»</span>
		  </Link>):""}
		  
		</nav>)
}