import fetch from 'node-fetch'
import {SocksProxyAgent} from 'socks-proxy-agent'
import fs from 'fs'
import path from 'path'
import {getElapsedTime} from "../routes/fn.js"
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
      let code = 0
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
      // bla
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
  export {getOutputFile, zmqLog, zmqLogSuccess, fetchTtsServer, entryPoint}