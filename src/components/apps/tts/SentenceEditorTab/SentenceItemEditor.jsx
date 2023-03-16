import {createRef, useState, useEffect} from "react"


import SentenceItemText from "./SentenceItemText"
import SentenceItemTtf from "./SentenceItemTtf"
export default function SentenceItemEditor({items, config, pk, sentenceItems, setSentenceItems}){

	
	useEffect(()=>{
		setSentenceItems([]);
		setTimeout(()=>{
			let items_;
			if(typeof items == 'string'){
				try{
					items_ = JSON.parse(items);
				}catch(e){
					items_ = []
				}

			}else{
				items_ = items
			}
			setSentenceItems(items_)	

		},250)
		
	},[items])

	useEffect(()=>{
		// console.log(sentenceItems)
	},[sentenceItems])


	return(<>
		{
		sentenceItems.map((item,index)=>{
			
			return(
				<div className="columns-2 my-1"  key={index}>
				<SentenceItemText pk={pk} setSentenceItems={setSentenceItems}  index={index} item={item} items={sentenceItems}/>
				<SentenceItemTtf pk={pk}  setSentenceItems={setSentenceItems} index={index} item={item} items={sentenceItems}/>
				</div>
			)
		})
	}
	</>)
}