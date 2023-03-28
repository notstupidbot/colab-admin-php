import SentenceItem from "./SentenceItem";
export default class TtfItem extends SentenceItem{

    constructor(props){
        super(props)
        this.setType('ttf', props)
    }
    
}