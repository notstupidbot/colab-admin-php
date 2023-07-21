import SelectableDiv from "./SelectableDiv"
import SelectableResizableDiv from "./SelectableResizableDiv"
import Split from 'react-split'
import {useState} from "react"
import { BiMinus } from 'react-icons/bi'

export const CollapseButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 inline-flex items-center rounded-full border border-transparent p-1 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      <BiMinus className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
export const Editor3 = () => {
    const [collapsedIndex, setCollapsedIndex] = useState(null)
  
    return (
      <Split direction="vertical" style={{ height: `calc(100vh - 4rem)` }}>
        <Split className="flex" collapsed={collapsedIndex}>
          <Options>
            <CollapseButton onClick={() => setCollapsedIndex(0)} />
          </Options>
          <Options>
            <CollapseButton onClick={() => setCollapsedIndex(1)} />
          </Options>
          <Options>
            <CollapseButton onClick={() => setCollapsedIndex(2)} />
          </Options>
        </Split>
        <div className="bg-gray-mid"></div>
      </Split>
    )
  }
  
  const Options = ({ children }) => {
    return (
      <div className="relative overflow-hidden bg-gray-light">
        <div className="absolute top-2 left-2 flex flex-col space-y-2">
          {children}
        </div>
      </div>
    )
  }  
const Canvas = ({}) => {
    return (<><div className="canvas">
        <Editor3/>
    </div></>)
}

export default Canvas
    