import React from "react"
import Helper from "../../../../../lib/Helper"

export default class Action extends React.Component {
    items = []
    textItemRefs = []
    ttfItemRefs = []
	constructor(props){
		super(props)
        this.state = {
            items : [],
            taskModeExtract : false,
            taskModeConvert : false,
            taskModeSynthesize : false,
            taskConvertConfig : {run : false, index : -1, next : -1, result : -1},
            taskSynthesizeConfig : {run : false, index : -1, next : -1, result : -1},
            taskExtractConfig : {run : false, index : -1, next : -1, result : -1},
        }

        this.buildItems()

	}
    onTaskConvert(evt){
        const activeIndex = 0
        this.setState({
            taskModeConvert : true,
            taskConvertConfig : {
                run : true,
                index : activeIndex,
                next : activeIndex + 1,
                result : -1
            }
        })
        
    }
    onTaskExtract(evt){
        const activeIndex = 0
        this.setState({
            taskModeExtract : true,
            taskConvertConfig : {
                run : true,
                index : activeIndex,
                next : activeIndex + 1,
                result : -1
            }
        })
    }
    onTaskSynthesize(evt){
        const activeIndex = 0

        this.setState({
            taskModeSynthesize : true,
            taskSynthesizeConfig : {
                run : true,
                index : activeIndex,
                next : activeIndex + 1,
                result : -1
            }
        })
    }
    buildItems(){
        let items;
        
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
        
    }
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
    componentDidMount(){
        this.setState({items : this.items})
    }
}