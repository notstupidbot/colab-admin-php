import WampServer from 'wamp-server'
import ABSessionManager from "./ABSessionManager.js"
const host = 'localhost'
const realm = 'tts.realm'
const port = 7001

const SERVER = new WampServer({
  port,
  realms: [realm], 
});



const abm = new ABSessionManager(realm, `ws://${host}:${port}/ws`)

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