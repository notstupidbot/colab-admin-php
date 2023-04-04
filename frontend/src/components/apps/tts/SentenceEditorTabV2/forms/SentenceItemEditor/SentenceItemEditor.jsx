import Action_sei from "./Action_sei";
import TextItem from "./TextItem";
import TtfItem from "./TtfItem";
/**
 * SentenceItemEditor
 * @component
 * @augments Action_sei
 * @augments Task_sei
 * @example
 * 
 * <SentenceItemEditor parent={} tqtRef={} store={}>
 * */
class SentenceItemEditor extends Action_sei{
   
    
    tqtRef = null
    constructor(props){
        super(props)
        this.tqtRef = props.tqtRef
    }
    /**
     * componentDidUpdate
     * */
    componentDidUpdate(){
        // console.log('SentenceItemEditor.componentDidUpdate()')
        if(this.tqtRef.current){
            const state = this.state
            state.itemCount = this.state.items.length
            this.tqtRef.current.applyState(this.state)
        }

    }
    /**
     * onItemChange
     * */
    async onItemChange(ref){
        console.log(ref.type)
        const items = this.state.items
        items[ref.index][ref.type] = ref.content

        this.setState({items})
		const sentences = JSON.stringify(items)
        await this.getStore().updateSentenceField('sentences', sentences, this.props.pk)
        this.getParent().updateRow('sentences', sentences)
    }
    /**
     * getItems
     * @param {boolean} stringify should return as string or list 
     * */
    getItems(stringify){
        if(stringify){
            return JSON.stringify(this.state.items)
        }
        return this.state.items
    }
    /**
     * componentDidMount
     * */
    componentDidMount(){
        // this.buildItems(true)
        // this.triggerUpdateItems()
    }
    render(){
        const items = this.state.items
        if(!items)
            return ""
        return(<><div className="sentence-item-editor my-2 rounded-md border-gray-200 text-sm  dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
            {/* <code>{this.state.sentences}</code> */}
            {

                items.map((item, index)=>{
                    const itemProps = {item, index, parent: this}
                    return(<div className="sentence-item-row flex my-0 py-3 px-4"  key={index}>
                    <div className="w-1/2 pr-1 relative"><TextItem {...itemProps} ref={this.textItemRefs[index]}/></div>
                    <div className="w-1/2 relative"><TtfItem {...itemProps} ref={this.ttfItemRefs[index]}/></div>
                    </div>)
                })
            }
        </div></>)
    }
}

export default SentenceItemEditor