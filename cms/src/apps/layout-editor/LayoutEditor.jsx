import ContextMenu from "./ContextMenu"
import Canvas from "./Canvas"

import "./style.css"

const LayoutEditor = ({}) => {
    return (<><div className="layouteditor">
        
        <Canvas/>
        <ContextMenu />
    </div></>)
}

export default LayoutEditor
    