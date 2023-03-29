import Action from "./Action";
import TextItem from "./TextItem";
import TtfItem from "./TtfItem";
export default class SentenceItemEditor extends Action{
    parent = null
    tqtRef = null
    constructor(props){
        super(props)
        this.parent = props.parent
        this.tqtRef = props.tqtRef
    }
    componentDidUpdate(){
        console.log('SentenceItemEditor.componentDidUpdate()')
        if(this.tqtRef.current){
            const state = this.state
            state.itemCount = this.state.items.length
            this.tqtRef.current.applyState(this.state)
        }

    }
    
    async onItemChange(ref){
        console.log(ref.type)
        const items = this.state.items
        items[ref.index][ref.type] = ref.content

        this.setState({items})
		
        await this.props.store.updateSentenceField('sentences', JSON.stringify(items), this.props.pk)

    }
    getItems(stringify){
        if(stringify){
            return JSON.stringify(this.state.items)
        }
        return this.state.items
    }
    
    render(){
        const items = this.state.items
        if(!items)
            return ""
        return(<><div className="sentence-item-editor my-2 rounded-md border-gray-200 text-sm  dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
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