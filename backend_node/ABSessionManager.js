import autobahn from 'autobahn'

class ABSessionManager {
    connection = null
    endPoint = null
    realm = null
    retryHandlerSet = false
    reconnectInterval = 5000
    constructor(realm, endPoint){
      this.realm = realm
      this.endPoint = endPoint
    }
    reconnect(){
      this.retryHandlerSet = true
          setTimeout(()=>{
               this.init();
              this.retryHandlerSet = false
          },this.reconnectInterval)
    }
    session = null
    getSession(){
      return this.session
    }
    callbackReady = f => f
    ready(callback){
      this.callbackReady = callback
    }
    startSubcription = f => f
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
              this.session = session
        if(this.callbackReady){
          this.callbackReady(this)
        }
        this.startSubcription(session)
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

  export default ABSessionManager