import express from "express"
import {calculateOffset, calculateTotalPages, toSqliteDateTime, runCommand, getTtsPrefs} from "./fn.js"

// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'
import multer from 'multer'
import TtsProject from "../models/TtsProject.js"
import Job from "../models/Job.js"
import Messaging from "../models/Messaging.js"
import TtsSentence from "../models/TtsSentence.js"
import Preference from "../models/Preference.js"
import WordList, {MWordList} from "../models/WordList.js"
import WordListTtf, {MWordListTtf} from "../models/WordListTtf.js"

// Configure Multer for handling multipart/form-data

const upload = multer()

router.post('/job', upload.any(), async(req, res)=>{
   let {subscriber_id, chunkMode, index, speaker_id} = req.query
   let {sentence_id, text} = req.body

   const script = 'tts-job-server.mjs'

   if(!speaker_id){
    speaker_id =  'SU-03712'
   }
   if(!chunkMode){
    chunkMode = false
   }

   index = parseInt(index) >= 0 ? index : -1

   // Creating new job 
   
   let job = new Job()
   
   job.name = 'tts'
   job.subscriber_id = subscriber_id
   job.params = "[]"
   job.user_id = 1
   job.create_date = toSqliteDateTime(new Date)    
   job.last_updated = toSqliteDateTime(new Date)    
   job = await AppDataSource.manager.save(job)
   // End create new job

   // Update job
   const shell_cmd = `node ${script} ${job.id}`

   const params  = {job_id:job.id, sentence_id, text, speaker_id, index, chunkMode}
   let updatedData = {
       params : JSON.stringify(params),
       last_updated : toSqliteDateTime(new Date)   ,
       cmdline : shell_cmd 
   }
   
   AppDataSource.manager.merge(Job, job, updatedData)
   job = await AppDataSource.manager.save(job)


   console.log(`running ${shell_cmd}`)

   runCommand(shell_cmd) 
 
   // call sub process
   // get pid
   /*
   updatedData = {
        cmdline : shell_cmd 
   }
   AppDataSource.manager.merge(Job, job, updatedData)
   job = await AppDataSource.manager.save(job)
   */
   // Save job
   let success = true
   const env = []
   const result = {job, chunkMode, index, sentence_id, success, at : 'create_job', shell_cmd, env}
   res.send(result)
})

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