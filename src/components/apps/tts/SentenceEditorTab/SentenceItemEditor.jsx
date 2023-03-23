import {createRef, useState, useEffect} from "react"

import Helper from "../../../lib/Helper"

import SentenceItemText from "./SentenceItemText"
import SentenceItemTtf from "./SentenceItemTtf"
export default function SentenceItemEditor({items, config, ws, pk, 
											sentenceItems, setSentenceItems, speakerId,
										    hideToast, doToast, jobCheckerAdd,sentenceItemRefs, setSentenceItemRefs}){

	
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
			updateSentenceItemRefs(items_)
			setSentenceItems(items_)	

		},250)
		
	},[items])

	const updateSentenceItemRefs = (sentenceItems_) => {
		const sentenceItemRefs_tmp = [];
		for(let index in sentenceItems_){
			const item = sentenceItems_[index];
			sentenceItemRefs_tmp.push({
				loading : false,
				loadingTtf : false
			})
		}
		setSentenceItemRefs(sentenceItemRefs_tmp)
	}
	useEffect(()=>{
		// console.log(sentenceItemRefs)
	},[sentenceItemRefs])

	const onResizeItemArea = evt => {
		// console.log(`resizing`)
		const $target = $(evt.target)
		let $anchestor = null
		const $parent = $target.closest('.sentence-item-editor')
		if( $target.hasClass('sentence-item-ttf') ){
			// console.log('A')
			$anchestor = $parent.find('.sentence-item-text')
		}else{
			$anchestor = $parent.find('.sentence-item-ttf')
		}

		Helper.delay(()=>{
			$anchestor.height($target.height())
		})
	}
	return(<>
		{
		sentenceItems.map((item,index)=>{
			if(item.text.trim().length == 0){
				return ""
			}
			return(
				<div className="sentence-item-editor columns-2 my-1"  key={index}>
				<SentenceItemText config={config} ws={ws} pk={pk} setSentenceItems={setSentenceItems}  index={index} item={item} items={sentenceItems} sentenceItemRefs={sentenceItemRefs} 
				   setSentenceItemRefs={setSentenceItemRefs}
				   onResizeItemArea={onResizeItemArea}/>
				<SentenceItemTtf hideToast={hideToast}
				   doToast={doToast}
				   jobCheckerAdd={jobCheckerAdd} config={config} ws={ws} pk={pk} speakerId={speakerId} setSentenceItems={setSentenceItems} index={index} item={item} items={sentenceItems} sentenceItemRefs={sentenceItemRefs} 
				   setSentenceItemRefs={setSentenceItemRefs}
				   onResizeItemArea={onResizeItemArea}/>
				</div>
			)
		})
	}
	</>)
}