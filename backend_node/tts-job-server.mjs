import {
    AppDataSource
  } from './ds.js'
  
  // import {Tblpost} from './entities/Post.entities.js'

import Job from "./models/Job.js"
import Messaging from "./models/Messaging.js"
import fetch from 'node-fetch'
import {SocksProxyAgent} from 'socks-proxy-agent'
import fs from 'fs'
import autobahn from "autobahn"

import {getTtsPrefs} from "./routes/fn.js"
import path from 'path'

class ABSessionManager {
  connection = null
  endPoint = 'ws://localhost:7001/ws'
  realm = 'tts.realm'
  retryHandlerSet = false
  reconnectInterval = 5000
  session = null
  getSession(){
    return this.session
  }

  reconnect(){
    this.retryHandlerSet = true
		setTimeout(()=>{
 			this.init();
			this.retryHandlerSet = false
		},this.reconnectInterval)
  }

  // startSubcription(session){
  //   session.subscribe('register', (a,b,c) => {
  //     console.log('-----------------------')
  //     console.log(a,b,c)
  //     console.log('--------------------')
  //   })
  // }
  callbackReady = f => f
  ready(callback){
    this.callbackReady = callback
  }
  init(){
    if(this.connection){
      return
    }
    
    this.connection = new autobahn.Connection({
      realm: this.realm,
      url: this.endPoint 
    })

    this.connection.onopen = (session, details) => {
			console.log('Connected to the server!')

      // this.startSubcription(session)
      this.session = session
      if(this.callbackReady){
        this.callbackReady(this)
      }
		}
		  
		this.connection.onclose = (reason, details) => {
			console.log('Connection closed:', reason)
      // Attempt reconnection
			if(!this.retryHandlerSet)
				this.reconnect()
		  }  
		  
      this.connection.open() 
  }
}

class MZmq {
  ds = null
  aBSessionManager = null
  constructor(ds, aBSessionManager){
    this.ds = ds
    this.aBSessionManager = aBSessionManager
  }
  send_log(subscriberId, message, result){
    this.aBSessionManager.getSession().publish(subscriberId,[],{subscriberId, message, result})
    this.aBSessionManager.getSession().publish('log',[],{subscriberId, message, result})
  }
}
class MJob{
  ds = null
  constructor(ds){
    this.ds = ds
  }
  async update(id, updatedData){
    const {manager} = this.ds
    let job = manager.findOne(Job, {id})

    if(job){
      AppDataSource.manager.merge(Job, job, updatedData)
      job = await AppDataSource.manager.save(job)
      return job
    }

    return null
  }
}

class CI {
  m_zmq = null
  m_job = null
  constructor(m_job, m_zmq){
    this.m_job = m_job
    this.m_zmq = m_zmq
  }
}

function getOutputFile(sentenceId, indexNumber) {
  const outputDir = path.join("./public", "tts-output")
  const outputUrl = "public/tts-output"
  let outputFileName = `${sentenceId}.wav`
  let chunkMode = false

  if (indexNumber > -1) {
    outputFileName = `${sentenceId}-${indexNumber}.wav`
    chunkMode = true
  }

  const outputFile = path.join(outputDir, outputFileName)
  const outputUrlPath = path.join(outputUrl, outputFileName)

  return [chunkMode, outputFile, outputUrlPath]
}

async function fetchTtsServer(ci, job, url, outputFilePath, proxy = '', errors, warnings, chunkMode, indexNumber, sentenceId) {

  const options = {
    timeout: 60 * 60 * 60, // 1 hour
    agent: proxy ? new SocksProxyAgent(proxy) : undefined,
  }

  if (job) {
    const jobId = job.id
    zmqLog(ci, job, 'init_process', `job ${jobId} running`, [], chunkMode, indexNumber, sentenceId, true)
  }

  let response
  try {
    response = await fetch(url, options)
  } catch (error) {
    errors.push(`curl_error_code_${error.code}`)
  }


  if (response) {
    const responseBuffer = await response.buffer()
    await fs.writeFileSync(outputFilePath, responseBuffer)


    return {
      output_file: path.basename(outputFilePath),
    }
  }

  return false
}
async function zmqLogSuccess(ci, job, outputFilePath, chunkMode, indexNumber, sentenceId, origResult, errors, warnings) {
  if (job) {
    const subscriberId = job.subscriber_id
    const jobId = job.id

    const message = `job id ${jobId} success`
    const data = { ps_output: JSON.stringify(origResult) }
    
    ci.m_job.update(jobId, data)

    delete job.params

    const result = {
      at: 'run_process',
      job: job,
      chunkMode: chunkMode,
      index: indexNumber,
      sentence_id: sentenceId,
      success: true,
    }
    Object.assign(result, origResult)

    ci.m_zmq.send_log(subscriberId, message, result)
    return result
  } else {
    warnings.push(`unexistent job_id ${jobId}`)
  }

  return result
}

function zmqLog(ci, job, at, message, data = [], chunkMode = '', index = '', sentenceId = '', success = false) {
  if (job) {
    const subscriberId = job.subscriber_id

    delete job.params

    const result = {
      at: at,
      job: job,
      chunkMode: chunkMode,
      index: index,
      sentence_id: sentenceId,
      success: success,
      elapsed_time: 0,
    }

    if (!success) {
      result.errors = data
    }

    ci.m_zmq.send_log(subscriberId, message, result)
  }
}
async function entryPoint(ci, job, text, speakerId, chunkMode, indexNumber, sentenceId, errors, warnings, ttsServerEndpoint, ttsServerProxy, ttsEnableProxy) {
  if (!job) {
    errors.push('Empty job records')
    return false
  }

  if (ttsServerEndpoint === '') {
    errors.push('tts_server_endpoint not configured')
    return false
  }

  const url = `${ttsServerEndpoint}/api/tts?text=${text}&speaker_id=${encodeURIComponent(speakerId)}&style_wav=&language_id=`
  const [updatedChunkMode, outputFilePath, outputUrl] = getOutputFile(sentenceId, indexNumber)

  // console.log(url)
  // return
  const result = await fetchTtsServer(ci, job, url, outputFilePath, ttsServerProxy, errors, warnings, updatedChunkMode, indexNumber, sentenceId)

  if (typeof result === 'object') {
    result.url = url
    result.output_url = outputUrl
    result.tts_server_endpoint = ttsServerEndpoint
    result.tts_server_proxy = ttsServerProxy

    return zmqLogSuccess(ci, job, outputFilePath, updatedChunkMode, indexNumber, sentenceId, result, errors, warnings)
  }

  return result
}
/*
const errors = []
const warnings = []
let result = false
let job = null
let jobId = 0
let sentenceId = 0
let text = ''
let speakerId = 'wibowo'
let indexNumber = -1
let chunkMode = false

// Accessing instance and models is specific to the PHP framework used,
// and this part needs to be adapted to your JavaScript project structure.

if (process.argv[2]) {
  jobId = process.argv[2]

  // Load the job and other required data using the appropriate methods

  const argvArr = JSON.parse(job.params)

  // Assign values from argvArr to the respective variables

  result = entryPoint(
    ci,
    job,
    text,
    speakerId,
    chunkMode,
    indexNumber,
    sentenceId,
    errors,
    warnings,
    ttsServerEndpoint,
    ttsServerProxy,
    ttsEnableProxy
  )
} else {
  errors.push('Invalid arguments')
}

if (errors.length > 0) {
  // Log errors and warnings using appropriate methods

  console.error(JSON.stringify({ errors, success: false }, null, 2))
  process.exit(1)
}

console.log(JSON.stringify({ errors, warnings, success: true, result }, null, 2))
process.exit(0)

*/
const argv = process.argv

const parseCmd = () => {

    return argv.length >= 3 ? argv[2] : null 
}

const processCmd = async (cmd) => { 
    await AppDataSource.initialize()
    .then(() => {
      console.log("Berhasil inilize ")
    })
    .catch((error) => console.log(error))
    
    argv.splice(0,2)

    const [job_id] = argv 

    console.log(`job_id is ${job_id}`)
    let id = job_id
    let job 
    
    try{
      job = await AppDataSource.manager.findOne(Job, {where:{id}})
    }catch(e){console.error(e)}
    
    const aBSessionManager = new ABSessionManager()
    aBSessionManager.ready(async(abm)=>{

      const m_zmq = new MZmq(AppDataSource, abm)
      const m_job = new MJob(AppDataSource)
      const ci = new CI(m_job, m_zmq)

      const errors = []
      const warnings = []
      let result = false
      let jobId = job_id
      let sentenceId = 0
      let text = ''
      let speakerId = 'wibowo'
      let indexNumber = -1
      let chunkMode = false

      let [ttsServerEndPoint, ttsServerProxy, ttsEnableProxy] = await getTtsPrefs(AppDataSource.manager)
      // console.log(ttsServerEndPoint, ttsServerProxy,ttsEnableProxy)
      // return
      if(job){
        // console.log(job.params)
        try{
          const params = JSON.parse(job.params)
          sentenceId = params.sentence_id
          text = params.text
          speakerId = params.speaker_id
          indexNumber = params.index
          chunkMode = params.chunkMode
        }catch(e){
          console.error(e)
        }
      }
      result = await entryPoint(
        ci,
        job,
        text,
        speakerId,
        chunkMode,
        indexNumber,
        sentenceId,
        errors,
        warnings,
        ttsServerEndPoint,
        ttsServerProxy,
        ttsEnableProxy
      )

      // console.log(abm)

      console.log(result)
      process.exit(0)

    })

    aBSessionManager.init()

    // console.log(job)  
    
}

const main = async () => {
    const cmd = parseCmd()

    if(cmd){
        await processCmd(cmd)
    }else{
        showHelp()
    }

    // process.exit(0)
}

main()