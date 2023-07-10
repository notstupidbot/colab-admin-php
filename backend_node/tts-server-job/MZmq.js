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
export default MZmq  