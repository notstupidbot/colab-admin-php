import { Outlet , Link } from "react-router-dom"
import React from "react"
// import PropTypes from "react"
const btnCls="py-[.688rem] px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-blue-500"
import "./book/star.css"
const Star = ({ selected=false, onClick=f=>f }) =>
	<div className={(selected) ? "star selected" : "star"}
	onClick={onClick}>
	</div>
// Star.propTypes = {
// 	selected: PropTypes.bool,
// 	onClick: PropTypes.func
// }

const AddColorForm = ({onNewColor=f=>f}) => {
	let _title, _color
	const submit = e => {
		e.preventDefault()
		onNewColor(_title.value, _color.value)
		_title.value = ''
		_color.value = '#000000'
		_title.focus()
	}
	return (<form onSubmit={submit}>
		<input ref={input => _title = input}
			   type="text"
			   placeholder="color title..." 
			   required/>
		<input ref={input => _color = input}
			type="color" 
			required/>
		<button className="btn btn-gray">ADD</button>
	</form>)
}
export default function Book(){
	const hideSidebar = false
	const cls = "dark:text-white"
	return(<>
		<div id="main-content" className={cls +" "+ (hideSidebar?"":"lg:pl-72")}>
			<h2>This is AsyncJs</h2>
			<span className="text-primary">Importante</span>
			<span className="text-red leading-tight">Importante</span>
			<span className="text-lg md:text-xl hover:text-red md:hover:text-blue">
				Importante
			</span>
			<div className="book-item-container">
				<div className="container">
					<input type="text" className="tw-input"/>
					<AddColorForm/>
					<Star selected={false} onClick={f=>f}/>
				</div>
				<Outlet/>
			</div>
		</div>
	</>)
}