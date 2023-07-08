
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import TtsSentence from "../models/TtsSentence.js"

const calculateOffset = (pageNumber, limit) => {
    const offset = (pageNumber - 1) * limit
    return offset

}

const calculateTotalPages = (recordCount, limit) => {
    return Math.ceil(recordCount / limit)
}

router.get('/tts-sentences', async (req, res) => {
    // Route logic for handling GET '/tts-sentence'
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

      
    try {
        const total_records =  await AppDataSource.manager.count(TtsSentence)
    
        const total_pages = calculateTotalPages(total_records, limit) 
        const offset = calculateOffset(page, limit)
        
        let option = {
            skip : offset,
            take : limit
        }

        const ttssentences =  await AppDataSource.manager.find(TtsSentence, option)
        const records = ttssentences
        
        res.send({ page, limit, order_by, order_dir, records, total_pages, total_records})

    }catch(e){
        console.error(e)
        res.send(e)

    }
});

router.get('/tts-sentence/:id',async (req, res) => {
    // Route logic for handling GET '/tts-sentence/:id'
    let id = req.params.id
    
    try{
      const ttssentence = await AppDataSource.manager.findOne(TtsSentence, {where:{id}})

      res.send({data : ttssentence})
    }catch(e){
      console.error(e)
    }
});

router.post('/tts-sentence/create',async (req, res) => {
    // Route logic for handling POST '/tts-sentence/create'
    let {project_id} = req.body
    const ttssentence = new TtsSentence()
    ttssentence.project_id = project_id

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

});

router.post('/tts-sentence/update/:id?',async (req, res) => {
    // Route logic for handling POST '/tts-sentence/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {project_id} = req.body
    const updatedData = {project_id}
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

});

router.post('/tts-sentence/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/tts-sentence/delete'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    console.log(id)
    
    let success = false
    let data = null
    let message = ""
    try{
      const ttssentence = await AppDataSource.manager.findOne(TtsSentence, {where:{id}})
      if(ttssentence){
        const deleted_ttssentence = await AppDataSource.manager.remove(ttssentence)
        success = true
        message = "Deleted"
        data = deleted_ttssentence
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    