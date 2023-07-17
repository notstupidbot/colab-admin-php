import express from 'express'

import {datasource} from "./data-source/index.js"
import routers from "./routes/routers.js"

const app = express()

datasource.initialize().then(f=>{
  routers.attach(app, datasource)
}).catch(e=>{
  console.log(e)
})



export const handler = app