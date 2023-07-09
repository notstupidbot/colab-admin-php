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

import {getTtsPrefs, getElapsedTime} from "./routes/fn.js"
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
  async send_log(subscriberId, message, result){

    console.log('(------------------------send log--------------------------------------)')
    console.log(subscriberId, message, result)
    //session.publish(payload.subscriber_id,[],{msg:'hello'})
    await this.aBSessionManager.getSession().publish(subscriberId,[],{subscriberId, message, result, type : 'log'})
    // this.aBSessionManager.getSession().publish('register',[],{subscriberId, message, result})
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
  let sdt,edt
  if (job) {
    const jobId = job.id
    await zmqLog(ci, job, 'init_process', `job ${jobId} running`, [], chunkMode, indexNumber, sentenceId, true)
  }
  sdt = new Date

  let response
  try {
    response = await fetch(url, options)
  } catch (error) {
    // console.log(error.message)
    let code = 404
    if(error.code){
      code = error.code
    }
    errors.push(`curl_error_code_${code}`)
    errors.push(error.message.split(',').pop())
  }


  if (response) {
    const responseBuffer = await response.buffer()
    await fs.writeFileSync(outputFilePath, responseBuffer)

    edt = new Date
    
    return {
      output_file: path.basename(outputFilePath),
      elapsed_time : getElapsedTime(sdt,edt,'seconds')
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

    await ci.m_zmq.send_log(subscriberId, message, result)
    return result
  } else {
    warnings.push(`unexistent job_id ${jobId}`)
  }

  return result
}

async function zmqLog(ci, job, at, message, data = [], chunkMode = '', index = '', sentenceId = '', success = false) {
  if (job) {
    const subscriberId = job.subscriber_id

    delete job.params

    const result = {
      at,
      job,
      chunkMode: chunkMode,
      index: index,
      sentence_id: sentenceId,
      success,
      elapsed_time: 0,
    }

    if (!success) {
      result.errors = data
    }

    await ci.m_zmq.send_log(subscriberId, message, result)
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
    // console.log('hrere')
    return zmqLogSuccess(ci, job, outputFilePath, updatedChunkMode, indexNumber, sentenceId, result, errors, warnings)
  }

  return result
}

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

      // console.log(result)
      // process.exit(0)

      //------------------------------------------
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
          if (errors[i] === 'curl_error_code_0') {
            errors[i] = `${tts_server_endpoint} is not accessible`;
            if (tts_enable_proxy) {
              errors[i] += ` with proxy ${tts_server_proxy}`;
            }
            errors[i] += ' please make sure TTS Server is running, or you can change in the Preferences --> Tts Server';
          }
        }
        
        if (job) {
          //await setTimeout(()=>{
              await zmqLog(ci, job, 'run_process', `job ${job_id} fails`, errors, chunkMode, indexNumber, sentenceId, false);

          //},1000)
        }
      
        // console.log(JSON.stringify({ errors: errors, success: false }, null, 2));
        // process.exit(1);
      }
      
      // console.log(JSON.stringify({ errors: errors, warnings: warnings, success: true, result: result }, null, 2));
      // process.exit(0);
      // setTimeout(()=>{
        process.exit(0)
      // },1000)
      
      //-----------------------------------------

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