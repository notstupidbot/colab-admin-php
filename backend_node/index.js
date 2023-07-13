import express from 'express'
import  bodyParser from 'body-parser'
import path from 'path'
import serveIndex from 'serve-index'
import 'reflect-metadata'
import {
  AppDataSource
} from './data-source.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDirPath = dirname(currentFilePath);


import {router as jobRoute}  from  "./routes/job.js"
import {router as messagingRoute}  from  "./routes/messaging.js"
import {router as preferenceRoute}  from  "./routes/preference.js"
import {router as socketSessionRoute}  from  "./routes/socket-session.js"
import {router as ttsProjectRoute}  from  "./routes/tts-project.js"
import {router as ttsSentenceRoute}  from  "./routes/tts-sentence.js"
import {router as userRoute}  from  "./routes/user.js"
import {router as wordListRoute}  from  "./routes/word-list.js"
import {router as wordListTtfRoute}  from  "./routes/word-list-ttf.js"
import {router as ttsRoute}  from  "./routes/tts.js"

import cors from "cors"
import "dotenv/config"
const {

  API_HOST,
  API_PORT,

  DEV_HOST,
  DEV_PORT,

  // PUSH_HOST,
  // PUSH_PORT,
} = process.env
const app = express()

app.use(
  cors({
    origin: `http://${DEV_HOST}:${DEV_PORT}`, // Allow requests from a specific origin
    methods: ['GET', 'POST','OPTION'], // Allow only specific HTTP methods
  })
)
const staticPath = path.join(currentDirPath, '/public')
app.use('/public', express.static(staticPath)); // Serve static files
app.use('/public', serveIndex(staticPath, { 'icons': true }))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use("/api",jobRoute)
app.use("/api",messagingRoute)
app.use("/api",preferenceRoute)
app.use("/api",socketSessionRoute)
app.use("/api",ttsProjectRoute)
app.use("/api",ttsSentenceRoute)
app.use("/api",userRoute)
app.use("/api",wordListRoute)
app.use("/api",wordListTtfRoute)
app.use("/api/tts",ttsRoute)




AppDataSource.initialize().then(() => {
  console.log("Database initialized. ")

})
.catch((error) => console.log(error))
const API_ENDPOINT = `${API_HOST}:${API_PORT}`
app.listen(API_PORT,f=>console.log(`API Server running ${API_ENDPOINT}`))
