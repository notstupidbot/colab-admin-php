
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import User from "../models/User.js"

router.get('/users', async (req, res) => {
    // Route logic for handling GET '/user'

    try {
        const users =  await AppDataSource.manager.find(User)
        const list = users
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

    }
});

router.get('/user/:id',async (req, res) => {
    // Route logic for handling GET '/user/:id'
    let id = req.params.id
    
    try{
      const user = await AppDataSource.manager.findOne(User, {where:{id}})

      res.send({data : user})
    }catch(e){
      console.error(e)
    }
});

router.post('/user/create',async (req, res) => {
    // Route logic for handling POST '/user/create'
    let {username, password, first_name} = req.body
    const user = new User()
    user.username = username
		user.password = password
		user.first_name = first_name

    let success = false
    let data =  user
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

router.post('/user/update/:id?',async (req, res) => {
    // Route logic for handling POST '/user/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {username, password, first_name} = req.body
    const updatedData = {username, password, first_name}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const user = await AppDataSource.manager.findOne(User, {where:{id}})
      if(user){
        AppDataSource.manager.merge(User, user, updatedData)
        const updated_user = await AppDataSource.manager.save(user )
        success = true
        message = "Updated"
        data = updated_user
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/user/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/user/delete'
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
      const user = await AppDataSource.manager.findOne(User, {where:{id}})
      if(user){
        const deleted_user = await AppDataSource.manager.remove(user)
        success = true
        message = "Deleted"
        data = deleted_user
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    