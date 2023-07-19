// import Contact from "./themes/preline/templates/draft/react/Contact"
// import BlogArticle from "./themes/preline/templates/draft/react/BlogArticle"

import componentDraftList  from "./themes/preline/templates/draft/react/components.json"
import {useState, useEffect, createRef, Component, createElement} from "react"
const components = {}


Object.keys(componentDraftList.availables).map((componentName, index)=>{
    const modulePath = `./themes/preline/templates/draft/react/${componentName}`
    import(modulePath).then(component=>{
        const item = componentDraftList.availables[componentName]
        if(item.type){
            if(item.type == "app"){
                return
            }
        }else{
            // return
        }
        // console.log(components)
        components[componentName] = component.default

        const event = new CustomEvent('component-list-updated', {
            detail: { message: 'Custom event triggered' },
          });
    
        // Dispatch the custom event
        window.dispatchEvent(event);
    })
})
export default function Public(){
    const [componentList, setComponentList] = useState(null)
    const componentListRefs = createRef(components)
    useEffect(()=>{
        const handleEvent = (event) => {
            if (event.detail && event.detail.message) {
                setComponentList(Object.assign({},components))
            }
        }
    
        window.addEventListener('component-list-updated', handleEvent)
    
        return () => {
            window.removeEventListener('component-list-updated', handleEvent)
        }
    },[components])
    return componentList ? <>
    {
        Object.keys(componentList).map((componentName, index)=>{
            const component = componentList[componentName]
            // console.log(component)
            return  createElement(component,{key:index})
        })
    }
    </>:""
}