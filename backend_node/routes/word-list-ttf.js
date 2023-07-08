
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import WordListTtf from "../models/WordListTtf.js"

router.get('/word-list-ttfs', async (req, res) => {
    // Route logic for handling GET '/word-list-ttf'

    try {
        const wordlistttfs =  await AppDataSource.manager.find(WordListTtf)
        const list = wordlistttfs
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

    }
});

router.get('/word-list-ttf/:id',async (req, res) => {
    // Route logic for handling GET '/word-list-ttf/:id'
    let id = req.params.id
    
    try{
      const wordlistttf = await AppDataSource.manager.findOne(WordListTtf, {where:{id}})

      res.send({data : wordlistttf})
    }catch(e){
      console.error(e)
    }
});

router.post('/word-list-ttf/create',async (req, res) => {
    // Route logic for handling POST '/word-list-ttf/create'
    let {content, word_id} = req.body
    const wordlistttf = new WordListTtf()
    wordlistttf.content = content
		wordlistttf.word_id = word_id

    let success = false
    let data =  wordlistttf
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

router.post('/word-list-ttf/update/:id?',async (req, res) => {
    // Route logic for handling POST '/word-list-ttf/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {content, word_id} = req.body
    const updatedData = {content, word_id}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const wordlistttf = await AppDataSource.manager.findOne(WordListTtf, {where:{id}})
      if(wordlistttf){
        AppDataSource.manager.merge(WordListTtf, wordlistttf, updatedData)
        const updated_wordlistttf = await AppDataSource.manager.save(wordlistttf )
        success = true
        message = "Updated"
        data = updated_wordlistttf
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/word-list-ttf/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/word-list-ttf/delete'
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
      const wordlistttf = await AppDataSource.manager.findOne(WordListTtf, {where:{id}})
      if(wordlistttf){
        const deleted_wordlistttf = await AppDataSource.manager.remove(wordlistttf)
        success = true
        message = "Deleted"
        data = deleted_wordlistttf
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    