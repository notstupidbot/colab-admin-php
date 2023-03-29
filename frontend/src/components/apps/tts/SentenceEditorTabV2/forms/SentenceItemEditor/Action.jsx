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
    applyTexItemRefState(srcState, index){
        try {
            this.textItemRefs[index].current.setState(srcState)
        } catch (error) {
            console.log(error)
        }
    }
    applyTtfItemRefState(srcState, index){
        try {
            this.ttfItemRefs[index].current.setState(srcState)
        } catch (error) {
            console.log(error)
        }
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
    async onTaskExtract(evt){
        let confirmed = true
        if(this.items.length > 0){
            confirmed = confirm("sei.items is not empty, whould you like to proceed?")
        }
        console.log(confirmed)
        if(!confirmed){
            console.log(`SentenceItemEditor.onExtract() : canceled caused of false confirmed`)
            return
        }
        const row =  this.parent.getRow()
        const content = row.content   

        /*============================================================================== */
		this.items = [];
		const dotSentences = content.split('.');
		let sourceIndex = 0;
        this.setState({taskModeExtract : true})
		for(let i in dotSentences){
			const commaSentence = dotSentences[i].split(',');

			if(commaSentence.length > 1){
				const lastIndex = commaSentence.length - 1;
				for(let j in commaSentence){
					const text = commaSentence[j].replace(/^\s+/,'');
					const type = j == lastIndex ? 'dot':'comma';
					if(text.length){
						const si = {
							text : Helper.fixTttsText(text), 
							type,
							ttf:''
						}
						if(si.text != ''){
                            this.items.push(si)
                        }
						sourceIndex += 1;
					}
					
				}
			}else{
				const text = commaSentence[0].replace(/^\s+/,'');
				if(text.length){
					const si = {
						text : Helper.fixTttsText(text), 
						type : 'dot',
						ttf : '',
					}
					if(si.text != ''){
                        this.items.push(si)
                    }
                    
                    sourceIndex += 1;
				}
			}
            this.setState({items : this.items})
            await Helper.timeout(150)
		}
        // console.log(this.items)
        this.setState({taskModeExtract : false})
        this.initSentenceItemRefs()
        /*==============================================================================*/
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