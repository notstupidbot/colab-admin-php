import React from "react"
import axios from "axios"
export default class SentenceTab extends React.Component{
	state = {
		sentenceList : []
	}
	// const updateProjectList = async()=>{
		
	// }
	viewInEditor(sentence){
		this.props.setActiveTab('sentence-editor');
		this.props.setActiveSentence(sentence);
		
	}
	async componentDidMount(){
		await this.updateList()
	}
	async updateList(){
		const res = await axios(`http://localhost/api/tts/sentence`);
		const sentenceList = res.data;
		this.setState({sentenceList})
	}
	render(){
return(<>
<div className="flex flex-col">
  <div className="-m-1.5 overflow-x-auto">
    <div className="p-1.5 min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Text</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
          {
          	this.state.sentenceList.map((item,index)=>{
          		return(
          			<tr key={index} className="odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700">
		              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</td>
		              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{item.text}</td>
		              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		                <button className="text-blue-500 hover:text-blue-700" onClick={evt=>this.viewInEditor(item)}>View in Editor</button>
		              </td>
		            </tr>
          		)
          	})
          }
            

           
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>		
	</>)
	}
}