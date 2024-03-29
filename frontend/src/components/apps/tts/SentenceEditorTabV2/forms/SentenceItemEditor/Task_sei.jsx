import React from "react"
import Helper from "../../../../../lib/Helper"
/**
 * Task_sei
 * @component
 * */
class Task_sei extends React.Component {
    /**
     * 
     *onTaskConvert 
     * 
     * */
    async onTaskConvert(evt){
        this.applyTexItemRefStateBatch({inTaskMode : true})
        this.setState({taskModeConvert : true})

        for(let index in this.textItemRefs){
            const ref = this.textItemRefs[index]
            ref.current.applyToolbarState({loadingConvert : true})
            const inputText = ref.current.getInputText()

            const ttf = await this.parent.store.convertTtf(inputText)
            // await Helper.timeout(1000)
            const refTtf = this.ttfItemRefs[index]
            refTtf.current.setContent(ttf)
            this.items[index].ttf = ttf
            // console.log(ttf)
            ref.current.applyToolbarState({loadingConvert : false})

        }

        const sentences = this.getItems(true)
        this.parent.store.updateSentenceField('sentences', sentences, this.parent.pk)
        this.setState({taskModeConvert : false})
        this.applyTexItemRefStateBatch({inTaskMode : false})

        
    }

    /**
     * Build items from parent.row.content
     * 
     * */
    async onTaskExtract(evt){
        let confirmed = true
        if(this.items.length > 0){
            confirmed = confirm("sei.items is not empty, whould you like to proceed?")
        }
        // console.log(confirmed)
        if(!confirmed){
            console.log(`SentenceItemEditor.onExtract() : canceled caused of false confirmed`)
            return
        }
        this.setState({items:[]})
        await Helper.timeout(150)

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
        }
        // console.log(this.items)
        this.setState({taskModeExtract : false})
        this.initSentenceItemRefs()
        /*==============================================================================*/
    }
     /**
     * onTaskSynthesize 
     * 
     * */
    async onTaskSynthesize(evt){
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
}

export default Task_sei