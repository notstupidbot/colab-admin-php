import express from 'express'
import  bodyParser from 'body-parser';
import 'reflect-metadata'
import {
  AppDataSource
} from './data-source.js'

// import {Tblpost} from './entities/Post.entities.js';
import Category from "./models/Category.js"
import Post from "./models/Post.js"

import {router as jobRoute}  from  "./routes/job.js"
import {router as messagingRoute}  from  "./routes/messaging.js"
import {router as preferenceRoute}  from  "./routes/preference.js"
import {router as socketSessionRoute}  from  "./routes/socket-session.js"
import {router as ttsProjectRoute}  from  "./routes/tts-project.js"
import {router as ttsSentenceRoute}  from  "./routes/tts-sentence.js"
import {router as userRoute}  from  "./routes/user.js"
import {router as wordListRoute}  from  "./routes/word-list.js"
import {router as wordListTtfRoute}  from  "./routes/word-list-ttf.js"


const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use("/api",jobRoute)
app.use("/api",messagingRoute)
app.use("/api",preferenceRoute)
app.use("/api",socketSessionRoute)
app.use("/api",ttsProjectRoute)
app.use("/api",ttsSentenceRoute)
app.use("/api",userRoute)
app.use("/api",wordListRoute)
app.use("/api",wordListTtfRoute)

const port=8000
app.listen(port,()=>console.log("server run :"+port))