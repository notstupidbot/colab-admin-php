
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import Job from "../models/Job.js"

router.get('/jobs', async (req, res) => {
    // Route logic for handling GET '/job'

    try {
        const jobs =  await AppDataSource.manager.find(Job)
        const list = jobs
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

    }
});

router.get('/job/:id',async (req, res) => {
    // Route logic for handling GET '/job/:id'
    let id = req.params.id
    
    try{
      const job = await AppDataSource.manager.findOne(Job, {where:{id}})

      res.send({data : job})
    }catch(e){
      console.error(e)
    }
});

router.post('/job/create',async (req, res) => {
    // Route logic for handling POST '/job/create'
    let {name, subscriber_id, params, user_id} = req.body
    const job = new Job()
    job.name = name
		job.subscriber_id = subscriber_id
		job.params = params
		job.user_id = user_id

    let success = false
    let data =  job
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

router.post('/job/update/:id?',async (req, res) => {
    // Route logic for handling POST '/job/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {name, subscriber_id, params, user_id} = req.body
    const updatedData = {name, subscriber_id, params, user_id}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const job = await AppDataSource.manager.findOne(Job, {where:{id}})
      if(job){
        AppDataSource.manager.merge(Job, job, updatedData)
        const updated_job = await AppDataSource.manager.save(job )
        success = true
        message = "Updated"
        data = updated_job
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/job/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/job/delete'
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
      const job = await AppDataSource.manager.findOne(Job, {where:{id}})
      if(job){
        const deleted_job = await AppDataSource.manager.remove(job)
        success = true
        message = "Deleted"
        data = deleted_job
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    