
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import TtsProject from "../models/TtsProject.js"

const calculateOffset = (pageNumber, limit) => {
    const offset = (pageNumber - 1) * limit
    return offset

}

const calculateTotalPages = (recordCount, limit) => {
    return Math.ceil(recordCount / limit)
}

router.get('/tts-projects', async (req, res) => {
    // Route logic for handling GET '/tts-project'
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

router.get('/tts-project/:id',async (req, res) => {
    // Route logic for handling GET '/tts-project/:id'
    let id = req.params.id
    
    try{
      const ttsproject = await AppDataSource.manager.findOne(TtsProject, {where:{id}})

      res.send({data : ttsproject})
    }catch(e){
      console.error(e)
    }
});

router.post('/tts-project/create',async (req, res) => {
    // Route logic for handling POST '/tts-project/create'
    let {user_id} = req.body
    const ttsproject = new TtsProject()
    ttsproject.user_id = user_id

    let success = false
    let data =  ttsproject
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

router.post('/tts-project/update/:id?',async (req, res) => {
    // Route logic for handling POST '/tts-project/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {user_id} = req.body
    const updatedData = {user_id}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const ttsproject = await AppDataSource.manager.findOne(TtsProject, {where:{id}})
      if(ttsproject){
        AppDataSource.manager.merge(TtsProject, ttsproject, updatedData)
        const updated_ttsproject = await AppDataSource.manager.save(ttsproject )
        success = true
        message = "Updated"
        data = updated_ttsproject
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/tts-project/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/tts-project/delete'
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
      const ttsproject = await AppDataSource.manager.findOne(TtsProject, {where:{id}})
      if(ttsproject){
        const deleted_ttsproject = await AppDataSource.manager.remove(ttsproject)
        success = true
        message = "Deleted"
        data = deleted_ttsproject
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    