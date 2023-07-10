class Job {
    constructor(id, subscriber_id, params, name, cmdline, ps_output, pid, create_data, last_updated ){
        this.id = id
        this.subscriber_id = subscriber_id
        this.params = params
        this.name = name
        this.cmdline = cmdline
        this.ps_output = ps_output
        this.pid = pid
        this.create_data = create_data
        this.last_updated = last_updated
    }
}
export class MJob{
    ds = null
    constructor(ds){
      this.ds = ds
    }
    async update(id, updatedData){
      const {manager} = this.ds
      let job = manager.findOne(Job, {id})
  
      if(job){
        manager.merge(Job, job, updatedData)
        job = await manager.save(job)
        return job
      }
  
      return null
    }
  }
export default Job