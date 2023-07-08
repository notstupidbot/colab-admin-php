
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import Preference from "../models/Preference.js"

router.get('/preferences', async (req, res) => {
    // Route logic for handling GET '/preference'

    try {
        const preferences =  await AppDataSource.manager.find(Preference)
        const list = preferences
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

    }
});

router.get('/preference/:id',async (req, res) => {
    // Route logic for handling GET '/preference/:id'
    let id = req.params.id
    
    try{
      const preference = await AppDataSource.manager.findOne(Preference, {where:{id}})

      res.send({data : preference})
    }catch(e){
      console.error(e)
    }
});

router.post('/preference/create',async (req, res) => {
    // Route logic for handling POST '/preference/create'
    let {val} = req.body
    const preference = new Preference()
    preference.val = val

    let success = false
    let data =  preference
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

router.post('/preference/update/:id?',async (req, res) => {
    // Route logic for handling POST '/preference/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {val} = req.body
    const updatedData = {val}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const preference = await AppDataSource.manager.findOne(Preference, {where:{id}})
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

router.post('/preference/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/preference/delete'
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
      const preference = await AppDataSource.manager.findOne(Preference, {where:{id}})
      if(preference){
        const deleted_preference = await AppDataSource.manager.remove(preference)
        success = true
        message = "Deleted"
        data = deleted_preference
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    