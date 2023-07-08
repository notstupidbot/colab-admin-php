
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import SocketSession from "../models/SocketSession.js"

router.get('/socket-sessions', async (req, res) => {
    // Route logic for handling GET '/socket-session'

    try {
        const socketsessions =  await AppDataSource.manager.find(SocketSession)
        const list = socketsessions
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

    }
});

router.get('/socket-session/:id',async (req, res) => {
    // Route logic for handling GET '/socket-session/:id'
    let id = req.params.id
    
    try{
      const socketsession = await AppDataSource.manager.findOne(SocketSession, {where:{id}})

      res.send({data : socketsession})
    }catch(e){
      console.error(e)
    }
});

router.post('/socket-session/create',async (req, res) => {
    // Route logic for handling POST '/socket-session/create'
    let {} = req.body
    const socketsession = new SocketSession()
    
    let success = false
    let data =  socketsession
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

router.post('/socket-session/update/:id?',async (req, res) => {
    // Route logic for handling POST '/socket-session/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {} = req.body
    const updatedData = {}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const socketsession = await AppDataSource.manager.findOne(SocketSession, {where:{id}})
      if(socketsession){
        AppDataSource.manager.merge(SocketSession, socketsession, updatedData)
        const updated_socketsession = await AppDataSource.manager.save(socketsession )
        success = true
        message = "Updated"
        data = updated_socketsession
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/socket-session/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/socket-session/delete'
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
      const socketsession = await AppDataSource.manager.findOne(SocketSession, {where:{id}})
      if(socketsession){
        const deleted_socketsession = await AppDataSource.manager.remove(socketsession)
        success = true
        message = "Deleted"
        data = deleted_socketsession
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    