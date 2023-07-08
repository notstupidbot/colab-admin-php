import express from 'express'
import  bodyParser from 'body-parser';
import 'reflect-metadata'
import {
  AppDataSource
} from './data-source.js'

// import {Tblpost} from './entities/Post.entities.js';
import Category from "./models/Category.js"
import Post from "./models/Post.js"

const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.get("/",(req,res)=>{
  res.send("run success")
})
app.post("/category/add",async(req,res)=>{
      let {name} = req.body
      const category = new Category()
      category.name = name
      try{
        await AppDataSource.manager.save(category)
        res.send({"status":"tersimpan","data":category})
      }catch(err){
        console.log(err)
      }
})
const port=8000
app.listen(port,()=>console.log("server run :"+port))