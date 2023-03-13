import {createRef} from "react"

export default function ContentTtfEditor(){
	const contentTtfInputRef = createRef(null)
	const cls = "my-3 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
	const onChangeContentTtf = evt => {
		console.log(evt.target.value)

		const contentTtf = evt.target.value;
		delay(async(e)=>{
		  this.model.setContentTtf(contentTtf);
		  await this.model.updateRow();
		})
	}
	return(<>
		<div>
			<div className="grow-wrap">
				<textarea ref={contentTtfInputRef} 
						  onChange={ evt => onChangeContentTtf(evt)} 
						  className={cls} 
						  placeholder="Content Ttf text">
				</textarea>	
			</div>
		</div>
	</>)
}