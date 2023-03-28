import SentenceItem from "./SentenceItem";
export default class TextItem extends SentenceItem{

    constructor(props){
        super(props)
        this.setType('text', props)
    }
    
    
    
}