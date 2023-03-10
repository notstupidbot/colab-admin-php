import {createRef, useState, useEffect} from "react"


import SentenceItemText from "./SentenceItemText"
import SentenceItemTtf from "./SentenceItemTtf"
export default function SentenceItemEditor({items, config, pk}){
	const [sentenceItems, setSentenceItems] = useState([])

	
	useEffect(()=>{
		setSentenceItems([]);
		setTimeout(()=>{
			let items_;
			try{
				items_ = JSON.parse(items);
			}catch(e){
				items_ = []
			}
			setSentenceItems(items_)	

		},250)

	},[items])

	
	return(<>
		{
		sentenceItems.map((item,index)=>{
			
			return(
				<div className="columns-2 my-1"  key={index}>
				<SentenceItemText  config={config} type="text" index={index} item={item} items={sentenceItems}/>
				<SentenceItemTtf pk={pk} config={config} type="ttf" index={index} item={item} items={sentenceItems}/>
				</div>
			)
		})
	}
	</>)
}