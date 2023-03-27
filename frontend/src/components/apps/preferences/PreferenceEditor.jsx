import {useState} from "react"
const PrefEditorBoolean = function({item}){
	if(typeof item == 'undefined'){
		return
	}
	const {key,type,editor,group,prop} = item
	const [obj, setObj] = useState(JSON.parse(item.val))
	const [isChecked,setChecked] = useState(obj[prop])
	return(<>
		{isChecked?"Yes":"No"}
	</>)
}

const PrefEditorString = function({item}){
	const {key,type,editor,group,prop} = item
	const [obj, setObj] = useState(JSON.parse(item.val))

	return(<>
		{obj[prop]}
	</>)
} 

const PrefEditorObject = function(){
	return(<>
		Object
	</>)
}

const PrefEditorInteger = function(){
	return(<>
		Integer
	</>)
}

export {
	PrefEditorBoolean,
	PrefEditorInteger,
	PrefEditorObject,
	PrefEditorString
}