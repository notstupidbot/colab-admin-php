
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import Preference from "../models/Preference.js"

const calculateOffset = (pageNumber, limit) => {
    const offset = (pageNumber - 1) * limit
    return offset

}

const calculateTotalPages = (recordCount, limit) => {
    return Math.ceil(recordCount / limit)
}

router.get('/preferences', async (req, res) => {
    // Route logic for handling GET '/preference'
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
        const total_records =  await AppDataSource.manager.count(Preference)
    
        const total_pages = calculateTotalPages(total_records, limit) 
        const offset = calculateOffset(page, limit)
        
        let option = {
            skip : offset,
            take : limit
        }

        const preferences =  await AppDataSource.manager.find(Preference, option)
        const records = preferences
        
        res.send({ page, limit, order_by, order_dir, records, total_pages, total_records})

    }catch(e){
        console.error(e)
        res.send(e)

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
    