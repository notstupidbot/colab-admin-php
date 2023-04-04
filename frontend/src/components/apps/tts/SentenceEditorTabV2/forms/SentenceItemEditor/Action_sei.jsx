import React from "react"
import Helper from "../../../../../lib/Helper"
import Task_sei from "./Task_sei"
/**
 * Action_sei
 * @component
 * @augments Task_sei
 * */
class Action_sei extends Task_sei {
    items = []
    textItemRefs = []
    ttfItemRefs = []
    store = null
     parent = null
	constructor(props){
		super(props)
        this.store = props.store
        this.parent = props.parent

        this.state = {
            items : [],
            sentences : '[]',
            taskModeExtract : false,
            taskModeConvert : false,
            taskModeSynthesize : false,
            taskConvertConfig : {run : false, index : -1, next : -1, result : -1},
            taskSynthesizeConfig : {run : false, index : -1, next : -1, result : -1},
            taskExtractConfig : {run : false, index : -1, next : -1, result : -1},
        }

        

	}
    getStore(){
        return this.store
    }
    getParent(){
        return this.parent
    }
    getUi(){
        return this.parent
    }
    /**
     * 
     * @example 
     * applyTexItemRefState({},0)
     * */
    applyTexItemRefState(srcState, index){
        try {
            this.textItemRefs[index].current.applyState(srcState)
        } catch (error) {
            console.log(error)
        }
    }
    /**
     * 
     * @example 
     * applyTtfItemRefState({},1)
     * */
    applyTtfItemRefState(srcState, index){
        try {
            this.ttfItemRefs[index].current.applyState(srcState)
        } catch (error) {
            console.log(error)
        }
    }
    /**
     * 
     * @example 
     * applyTexItemRefStateBatch({})
     * */
    applyTexItemRefStateBatch(srcState){
        this.textItemRefs.map((ref, index)=>{
            ref.current.applyState(srcState)
            // console.log(ref)

        })
    }
    /**
     * 
     * @example 
     * applyTtfItemRefStateBatch({})
     * */
    applyTtfItemRefStateBatch(srcState){
        this.ttfItemRefs.map((ref, index)=>{
            ref.current.applyState(srcState)
            
            // console.log(ref)
            
        })
    }
    
    
    /**
     * Build items from props.sentences
     * 
     * */
    buildItems(setState){
        let items;
        this.setState({sentences:this.props.sentences})
        try {
            items = JSON.parse(this.props.sentences)
        } catch (error) {
            items = []
        }
        const itemCounts = items.length
        // let iter = itemCounts - 1
        if(itemCounts > 0){
            items = items.filter(item => {
                let passed = 0
                if(item.text){
                    passed += 1
                }

                if(item.ttf){
                    passed += 1
                }
                const ok = passed != 0
                
                return ok
            })
        }
        // console.log(items)
        this.items = items
        this.initSentenceItemRefs()

        if(setState)
            this.triggerUpdateItems()
    }
    /**
     * init refs
     * 
     * */
    initSentenceItemRefs(){
        this.textItemRefs = []
        this.ttfItemRefs = []

        this.items.map((item, index)=>{
            const ref = React.createRef(null)
            const ttfRef = React.createRef(null)

            this.textItemRefs.push(ref)
            this.ttfItemRefs.push(ttfRef)
        })
    }
    /**
     * trigger update items state

     * */
    triggerUpdateItems(){
        this.setState({items:[]})
        setTimeout(()=>{
            this.setState({items : Object.assign([],this.items)})

        },1000)

    }
    /**
     * componentDidMount
     * 
     * */
    componentDidMount(){
        this.triggerUpdateItems()


    }
}

export default Action_sei