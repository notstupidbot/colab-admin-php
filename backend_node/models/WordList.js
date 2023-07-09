import {toSqliteDateTime} from "../routes/fn.js"

class WordList {
    constructor(id, content, user_id, create_date, last_updated){
        this.id = id
		this.content = content
		this.user_id = user_id
		this.create_date = create_date
		this.last_updated = last_updated
    }
}
export class MWordList {
    ds = null
    mWordListTtf = null

    constructor(ds){
        this.ds = ds
    }

    async create(content){
        const {manager} = this.ds

        content = content.toLowerCase() 

        const existing = await this.getByWord(content)

        if(existing){
            return existing
        }
        const wordList = new WordList()
        wordList.content = content
        wordList.create_date = toSqliteDateTime(new Date)
        wordList.last_updated = toSqliteDateTime(new Date)
        
        const record = await manager.save(wordList)
        return record

    }
    async getByWord(content){
        content = content.toLowerCase()
        const {manager} = this.ds
        const record = await manager.findOne(WordList, {where:{content}})

        return record
    }
    setMWordListTtf(mWordListTtf){
        this.mWordListTtf = mWordListTtf
    }
}
export default WordList
    