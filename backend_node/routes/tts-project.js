
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import TtsProject from "../models/TtsProject.js"

router.get('/tts-projects', async (req, res) => {
    // Route logic for handling GET '/tts-project'

    try {
        const ttsprojects =  await AppDataSource.manager.find(TtsProject)
        const list = ttsprojects
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

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
    