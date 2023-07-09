import fetch from 'node-fetch'
import {SocksProxyAgent} from 'socks-proxy-agent'
import {toSqliteDateTime, getTtsPrefs} from "../routes/fn.js"


export class MWordListTtf {
    ds = null
    mWordList = null
    convertPrefs = null
    constructor(ds, mWordList){
        this.ds = ds
        this.mWordList = mWordList
    }
    async getByWord(text){
        text = text.toLowerCase()
        const word = await this.mWordList.create(text)
        // console.log(word)
        const record = await this.getByWordId(word.id)

        return record
    }
    async getByWordId(word_id){
        const {manager} = this.ds
        const record = await manager.findOne(WordListTtf, {where:{word_id}})
        
        return record
    }
    async create(text, content){
        const {manager} = this.ds

        text = text.toLowerCase()

        let existingRecByContentCheck = await this.getByContent(content)
        if(existingRecByContentCheck){
            return existingRecByContentCheck
        }

        let word = await this.mWordList.getByWord(text)
        const wordListTtf = new WordListTtf()
        wordListTtf.content = content
        wordListTtf.path = ""
        wordListTtf.word_id = word.id
        wordListTtf.create_date = toSqliteDateTime(new Date)
        wordListTtf.last_updated = toSqliteDateTime(new Date)
        const record = await manager.save(wordListTtf)
        return record

    }
    async convertTtfServer(text){
        let ttsServerEndPoint, ttsServerProxy, ttsServerUseProxy 
        const {manager} = this.ds

        if(!this.convertPrefs){
            
            this.convertPrefs = await getTtsPrefs(manager)
            
        }
        [ttsServerEndPoint, ttsServerProxy, ttsServerUseProxy] = this.convertPrefs
        
        let requestOptions = {}

        if(ttsServerUseProxy){
            requestOptions.agent = new SocksProxyAgent(ttsServerProxy) 
        }
        const url = `${ttsServerEndPoint}/api/convert?text=${encodeURI(text)}`
        console.log(url)
        const result = await fetch(url, requestOptions)
                            .then(response => response.text())
                            .then(data => {
                                return data
                            })
                            .catch(error => {
                                console.error('Error:', error)

                                return ''
                            })
        console.log(result)
        
        return result

    }
    async getByContent(content){
        const {manager} = this.ds
        const record = await manager.findOne(WordListTtf, {where:{content}})

        return record
    }
    async convert(text){
        text = text.toLowerCase()
        let wordTtf = await this.getByWord(text)

        let result = ''
        if(!wordTtf){
            let content = await this.convertTtfServer(text)
            if(content){
                if(content.length > 0){
                    wordTtf = await this.create(text, content.trim())
                    result = wordTtf.content
                }
            }else{
                console.log(`convertTtfServer return blank words`)
            }
        }else{
            result = wordTtf.content
        }

        return result
    }

}
class WordListTtf {
    constructor(id, content, word_id, user_id, create_date, last_updated){
        this.id = id
		this.content = content
		this.word_id = word_id
		this.user_id = user_id
		this.create_date = create_date
		this.last_updated = last_updated
    }
}

export default WordListTtf
    