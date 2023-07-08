
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import WordList from "../models/WordList.js"

router.get('/word-lists', async (req, res) => {
    // Route logic for handling GET '/word-list'

    try {
        const wordlists =  await AppDataSource.manager.find(WordList)
        const list = wordlists
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

    }
});

router.get('/word-list/:id',async (req, res) => {
    // Route logic for handling GET '/word-list/:id'
    let id = req.params.id
    
    try{
      const wordlist = await AppDataSource.manager.findOne(WordList, {where:{id}})

      res.send({data : wordlist})
    }catch(e){
      console.error(e)
    }
});

router.post('/word-list/create',async (req, res) => {
    // Route logic for handling POST '/word-list/create'
    let {content} = req.body
    const wordlist = new WordList()
    wordlist.content = content

    let success = false
    let data =  wordlist
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

router.post('/word-list/update/:id?',async (req, res) => {
    // Route logic for handling POST '/word-list/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {content} = req.body
    const updatedData = {content}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const wordlist = await AppDataSource.manager.findOne(WordList, {where:{id}})
      if(wordlist){
        AppDataSource.manager.merge(WordList, wordlist, updatedData)
        const updated_wordlist = await AppDataSource.manager.save(wordlist )
        success = true
        message = "Updated"
        data = updated_wordlist
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/word-list/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/word-list/delete'
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
      const wordlist = await AppDataSource.manager.findOne(WordList, {where:{id}})
      if(wordlist){
        const deleted_wordlist = await AppDataSource.manager.remove(wordlist)
        success = true
        message = "Deleted"
        data = deleted_wordlist
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    