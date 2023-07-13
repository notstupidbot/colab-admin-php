import WampServer from 'wamp-server'
import ABSessionManager from "./ABSessionManager.js"

import "dotenv/config"
const {

  API_HOST,
  API_PORT,

  DEV_HOST,
  DEV_PORT,

  PUSH_HOST,
  PUSH_PORT,

  PUSH_REALM,
} = process.env
// const host = 'localhost'
// const realm = 'tts.realm'
// const port = 7001

const SERVER = new WampServer({
  port:PUSH_PORT,
  realms: [PUSH_REALM], 
});



const abm = new ABSessionManager(PUSH_REALM, `ws://${PUSH_HOST}:${PUSH_PORT}/ws`)

abm.startSubcription = (session)=>{
  session.subscribe('register', (a,payload,c) => {
    console.log('--------------------')
    console.log(payload)
    console.log('--------------------')

    if(payload.subscriber_id){
      session.publish(payload.subscriber_id,[],{msg:'hello'})
    }
  })
}

abm.init()