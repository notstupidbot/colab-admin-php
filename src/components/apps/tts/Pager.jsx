// import {v4} from "uuid"
export default function Pager({limit,total_pages,page, gotoPage}){
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
		  {hasPrev(page)?(<button key={`${name}-min-1`} className="text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md" onClick={evt=>gotoPage(page-1)}>
		    <span aria-hidden="true">«</span>
		    <span>Sebelum</span>
		  </button>):""}
		  {forPages().map((page_number,index)=>{
		  	const isActive = (page_number == page);
		  	return isActive ? (<button key={`${name}-num-${index}`} 
		  		className="w-10 h-10 bg-blue-500 text-white p-4 inline-flex items-center text-sm font-medium rounded-full"  
		  		aria-current="page" aria-current="page"  
		  		onClick={total_pages > 1? evt=>gotoPage(page_number):null}>{page_number}</button>):(<button key={`${name}-num-${index}`} onClick={evt=>gotoPage(page_number)}className="w-10 h-10 text-gray-500 hover:text-blue-600 p-4 inline-flex items-center text-sm font-medium rounded-full">{page_number}</button>
		  )
		  })

		  }
		  {hasNext(page)?(<button key={`${name}-plus-1`} className="text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md"  onClick={evt=>gotoPage(page+1)}>
		    <span>Selanjutnya</span>
		    <span aria-hidden="true">»</span>
		  </button>):""}
		  
		</nav>)
}