import {
    AppDataSource
} from './ds.js'  
import Job, {MJob} from "./models/Job.js"
import {getTtsPrefs, getElapsedTime} from "./routes/fn.js"

import ABSessionManager from "./ABSessionManager.js"
import MZmq from "./tts-server-job/MZmq.js"
import CI from "./tts-server-job/CI.js"
import {getOutputFile, zmqLog, zmqLogSuccess, fetchTtsServer, entryPoint} from "./tts-server-job/fn.js"



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
    
    const aBSessionManager = new ABSessionManager('tts.realm', 'ws://localhost:7001/ws')
    aBSessionManager.ready(async(abm)=>{

      const m_zmq = new MZmq(AppDataSource, abm)
      const m_job = new MJob(AppDataSource)
      const ci = new CI(m_job, m_zmq)

      const errors = []
      const warnings = []
      let result = false, jobId = job_id,sentenceId = 0,text = '', speakerId = 'wibowo',indexNumber = -1, chunkMode = false

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
      result = await entryPoint(ci, job, text, speakerId, chunkMode, indexNumber, sentenceId, errors, warnings,ttsServerEndPoint,ttsServerProxy,ttsEnableProxy)

      //------------------------------------------
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
          if (errors[i] === 'curl_error_code_0') {
            errors[i] = `${ttsServerEndPoint} is not accessible`;
            if (ttsEnableProxy) {
              errors[i] += ` with proxy ${ttsServerProxy}`;
            }
            errors[i] += ' please make sure TTS Server is running, or you can change in the Preferences --> Tts Server';
          }
        }
        
        if (job) {
          await zmqLog(ci, job, 'run_process', `job ${job_id} fails`, errors, chunkMode, indexNumber, sentenceId, false);
        }
      }

      process.exit(0)
      //-----------------------------------------

    })

    aBSessionManager.init()
    
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