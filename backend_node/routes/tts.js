
import express from "express"
import fetch from 'node-fetch'
import {SocksProxyAgent} from 'socks-proxy-agent'

import {calculateOffset, calculateTotalPages, toSqliteDateTime} from "./fn.js"

// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'
import multer from 'multer'
import TtsProject from "../models/TtsProject.js"
import TtsSentence from "../models/TtsSentence.js"
import Preference from "../models/Preference.js"
import WordList from "../models/WordList.js"
import WordListTtf from "../models/WordListTtf.js"
// Configure Multer for handling multipart/form-data
const upload = multer()

const getTtsPrefs = async(manager)=>{
    let ttsServerEndPoint, ttsServerProxy, ttsServerUseProxy

    const group = 'tts_server' 
    const prefs = await manager.find(Preference, {group})

    if(prefs){
        if(prefs.length){
            for(let i in prefs){
                const pref = prefs[i]
                try{
                    if(pref.key == 'tts_server.endpoint'){
                        ttsServerEndPoint = JSON.parse(pref.val).url
                    }
                    if(pref.key == 'tts_server.proxy'){
                        ttsServerProxy = JSON.parse(pref.val).url
                    }
                    if(pref.key == 'tts_server.enable_proxy'){
                        ttsServerUseProxy = JSON.parse(pref.val).value
                    }
                }catch(e){
                    console.error(e)
                }
            }
        }
    }

    return [ttsServerEndPoint, ttsServerProxy, ttsServerUseProxy]
}

class MWordList {
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
class MWordListTtf {
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
  



router.get('/convert', async (req, res) => {
    const {text} = req.query
    const textSplit = text.split(' ')
    let outputText = []
    
    const mWordList = new MWordList(AppDataSource)
    const mWordListTtf = new MWordListTtf(AppDataSource, mWordList)
    mWordList.setMWordListTtf(mWordListTtf)

    for(let i in textSplit){
        const word = textSplit[i].replace(/[^a-z]/,'')
        if(word.length > 0){
            const ttf = await mWordListTtf.convert(word)
            const ttfItem = {
                text : word,
                ttf 
            }
            outputText.push(ttfItem)
        }
    }
    res.send(outputText)

})

router.post('/sentence',upload.any(), async (req, res) => {
    // Route logic for handling POST '/tts-sentence/create'
    let {project_id, content_ttf, content, title, sentences, output_file} = req.body
    const {id} = req.query

    if(id){
    const updatedData = {content_ttf, content, title, sentences}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const ttssentence = await AppDataSource.manager.findOne(TtsSentence, {where:{id}})
      if(ttssentence){
        AppDataSource.manager.merge(TtsSentence, ttssentence, updatedData)
        const updated_ttssentence = await AppDataSource.manager.save(ttssentence )
        success = true
        message = "Updated"
        data = updated_ttssentence
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
        return
    }

    const ttssentence = new TtsSentence()
    ttssentence.project_id = project_id
    ttssentence.content = content
    ttssentence.title = title
    ttssentence.content_ttf = content_ttf
    ttssentence.sentences = sentences
    ttssentence.output_file = output_file
    ttssentence.create_date = toSqliteDateTime(new Date)
    ttssentence.last_updated = toSqliteDateTime(new Date)
    let success = false
    let data =  ttssentence
    let message = ""

    try{
        success = true
        message = "Created"

        data = await AppDataSource.manager.save(data)
    }catch(err){
        console.log(err)
        message = "Create failed"

    }
    res.send({success, data, message})

})
router.get('/sentence', async (req, res) => {
    // Route logic for handling GET '/tts-sentence'
    let {page,limit,order_by,order_dir,project_id, id} = req.query

    if(id){
        try{
            const ttssentence = await AppDataSource.manager.findOne(TtsSentence, {where:{id}})
      
            res.send(ttssentence)
          }catch(e){
            console.error(e)
          }
        return
    }
    /*
    records : [],
			limit : 5,
			page : 1,
			total_pages : 0,
			total_records : 0,
			order_by:'key',
			order_dir:'asc'
    
    */
    if(!limit){
        limit = 5
    }
    
    if(!page){
        page = 1
    }

    const queryOption = {
        where : {project_id}
    }  
    try {
        const total_records =  await AppDataSource.manager.count(TtsSentence,queryOption)
    
        const total_pages = calculateTotalPages(total_records, limit) 
        const offset = calculateOffset(page, limit)
        
        let option = {
            skip : offset,
            take : limit
        }

        const ttssentences =  await AppDataSource.manager.find(TtsSentence, {...option,...queryOption})
        const records = ttssentences
        
        res.send({ page, limit, order_by, order_dir, records, total_pages, total_records})

    }catch(e){
        console.error(e)
        res.send(e)

    }
})
router.get('/project', async (req, res) => {
    // Route logic for handling GET '/tts-project'
    let {page,limit,order_by,order_dir, id} = req.query
    if(id){

        try{
        const ttsproject = await AppDataSource.manager.findOne(TtsProject, {where:{id}})

        res.send(ttsproject)
        }catch(e){
        console.error(e)
        }

        return
    }
    /*
    records : [],
			limit : 5,
			page : 1,
			total_pages : 0,
			total_records : 0,
			order_by:'key',
			order_dir:'asc'
    
    */
    if(!limit){
        limit = 5
    }
    
    if(!page){
        page = 1
    }

      
    try {
        const total_records =  await AppDataSource.manager.count(TtsProject)
    
        const total_pages = calculateTotalPages(total_records, limit) 
        const offset = calculateOffset(page, limit)
        
        let option = {
            skip : offset,
            take : limit
        }

        const ttsprojects =  await AppDataSource.manager.find(TtsProject, option)
        const records = ttsprojects
        
        res.send({ page, limit, order_by, order_dir, records, total_pages, total_records})

    }catch(e){
        console.error(e)
        res.send(e)

    }
});
router.post('/preference',upload.any(),async (req, res) => {
    // Route logic for handling POST '/preference/update'
    let {key} = req.query
    
   
    const {val} = req.body
    const last_updated = toSqliteDateTime(new Date)
    const updatedData = {val, last_updated}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const preference = await AppDataSource.manager.findOne(Preference, {where:{key}})
     
      if(preference){
        AppDataSource.manager.merge(Preference, preference, updatedData)
        const updated_preference = await AppDataSource.manager.save(preference )
        success = true
        message = "Updated"
        data = updated_preference
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});
router.get('/preferences', async (req, res) => {
    // Route logic for handling GET '/preference'
    let {page,limit,order_by,order_dir} = req.query
    /*
    records : [],
			limit : 5,
			page : 1,
			total_pages : 0,
			total_records : 0,
			order_by:'key',
			order_dir:'asc'
    
    */
    if(!limit){
        limit = 5
    }
    
    if(!page){
        page = 1
    }

    const queryOption = {
        where : {group:'tts_server'}
    }  
    try {
        const total_records =  await AppDataSource.manager.count(Preference, {...queryOption})
    
        const total_pages = calculateTotalPages(total_records, limit) 
        const offset = calculateOffset(page, limit)
        
        let option = {
            skip : offset,
            take : limit
        }

        const preferences =  await AppDataSource.manager.find(Preference, {...option,...queryOption})
        const records = preferences
        
        res.send({ page, limit, order_by, order_dir, records, total_pages, total_records})

    }catch(e){
        console.error(e)
        res.send(e)

    }
});

export  {router}