
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import Messaging from "../models/Messaging.js"

const calculateOffset = (pageNumber, limit) => {
    const offset = (pageNumber - 1) * limit
    return offset

}

const calculateTotalPages = (recordCount, limit) => {
    return Math.ceil(recordCount / limit)
}

router.get('/messagings', async (req, res) => {
    // Route logic for handling GET '/messaging'
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
        const total_records =  await AppDataSource.manager.count(Messaging)
    
        const total_pages = calculateTotalPages(total_records, limit) 
        const offset = calculateOffset(page, limit)
        
        let option = {
            skip : offset,
            take : limit
        }

        const messagings =  await AppDataSource.manager.find(Messaging, option)
        const records = messagings
        
        res.send({ page, limit, order_by, order_dir, records, total_pages, total_records})

    }catch(e){
        console.error(e)
        res.send(e)

    }
});

router.get('/messaging/:id',async (req, res) => {
    // Route logic for handling GET '/messaging/:id'
    let id = req.params.id
    
    try{
      const messaging = await AppDataSource.manager.findOne(Messaging, {where:{id}})

      res.send({data : messaging})
    }catch(e){
      console.error(e)
    }
});

router.post('/messaging/create',async (req, res) => {
    // Route logic for handling POST '/messaging/create'
    let {subscriber_id, ip_addr} = req.body
    const messaging = new Messaging()
    messaging.subscriber_id = subscriber_id
		messaging.ip_addr = ip_addr

    let success = false
    let data =  messaging
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

router.post('/messaging/update/:id?',async (req, res) => {
    // Route logic for handling POST '/messaging/update'
    let id 
    if(request.body.id){
        id = request.body.id
    }
    if(!id){
        id = req.params.id
    }
    
    const {subscriber_id, ip_addr} = req.body
    const updatedData = {subscriber_id, ip_addr}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const messaging = await AppDataSource.manager.findOne(Messaging, {where:{id}})
      if(messaging){
        AppDataSource.manager.merge(Messaging, messaging, updatedData)
        const updated_messaging = await AppDataSource.manager.save(messaging )
        success = true
        message = "Updated"
        data = updated_messaging
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/messaging/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/messaging/delete'
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
      const messaging = await AppDataSource.manager.findOne(Messaging, {where:{id}})
      if(messaging){
        const deleted_messaging = await AppDataSource.manager.remove(messaging)
        success = true
        message = "Deleted"
        data = deleted_messaging
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    