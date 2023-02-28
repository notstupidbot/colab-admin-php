const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

const {m_jobs} = require("./models")
class TtsJob{
	pid = 0;
	text = "";
	project_id = "";
	socketManager = null;
	uuid = null;
	constructor(project_id, text, socketManager, uuid){
		this.project_id = project_id;
		this.text = text;
		this.socketManager = socketManager;
		this.uuid = uuid;
	}
	
	async checkPid(){
		let data = {
            counts : 0,
            items : []
        }
		const filter = this.project_id;
		const t = "tts-job.sh"
		const tt = "bash";
	    try {
	        const result = await execPromise(`ps aux | grep ${filter}`)
	        let lines = result.stdout.split("\n");

	        const regexFilter = new RegExp(`grep ${t}`);
	        lines = lines.filter(line=>{
	            if(line){
	                if(line.match(regexFilter)){
	                    return false;
	                }
	                return true;
	            }
	            return false;
	        });
	        lines = lines.map(l=>{
	            l = l.split(/\s+/g);
	            const pi = {
	                user: l[0],
	                pid : parseInt(l[1]),
	                argv : l.filter((r,i)=>{
	                    if(i>=10){
	                        return r
	                    }
	                })
	            }

	            pi.cmdline = pi.argv.join(" ")
	            return pi;
	        })
	        if(filter){
	            lines = lines.filter(pi=>{
	                return pi.argv[0] == tt;
	            })
	        }
	        data = {
	            counts : lines.length,
	            items : lines
	        }

	        return data;
	    } catch (err) {
	        // return null
	    } 
	    
	    return data;

	}

	async run(cmdline){
		// const self = this;
		execPromise(cmdline).then(r=>{
			// UPDATE ON EXIT
			if(r.stdout){
				// console.log(r.stdout);
				console.log(`${cmdline} SUCCESS`);
				m_jobs.updateTtsJobStatus(this.project_id,1);
				this.socketManager.emit('log',`tts job success ${this.project_id}`,null,this.uuid);
			}else if(r.stderr){
				console.log(`${cmdline} FAILS`);
				m_jobs.updateTtsJobStatus(this.project_id,-1);
				this.socketManager.emit('log',`tts job failed ${this.project_id}`,null,this.uuid);


			}
			console.log(r);
		}).catch(e=>{
			m_jobs.updateTtsJobStatus(this.project_id,-1);
			this.socketManager.emit('log',`tts job failed ${this.project_id}`,null,this.uuid);

		});
	}

	stop(){

	}

	async create(socket_id){
		const www_dir = '/var/www/html';
		const job_name = "tts";
		const cmdline = `bash ${www_dir}/addon/tts-job.sh ${this.project_id} "${this.text}"`;
		const project_id = this.project_id;
		const existingJob = await m_jobs.getTtsJob(project_id);
		let data;
		if(existingJob){
			console.log(existingJob);
			console.log(`there is existing job id ${existingJob.id}`);
			console.log(`checking pid`);
			data = await this.checkPid();
			if(!data.counts){
				this.run(cmdline);
			}else{

			}
			setTimeout(async ()=>{
				data = await this.checkPid();

				console.log(`GOT ${data.items[0].pid}`);
				console.log(data.items);
			},2000);
			
			return existingJob;
		}else{
			const uuid = this.uuid;
			const params = JSON.stringify({project_id,uuid,socket_id});
			this.run(cmdline);
				
			console.log(`checking pid`);
			setTimeout(async ()=>{
				data = await this.checkPid();

				console.log(`GOT ${data.items[0].pid}`);
				console.log(data.items);
			},2000);
			return m_jobs.create(job_name,cmdline,params);
		}

		
	}
}

function JobRoute(socketManager, app){
	app.post('/job', async(req, res, next)=>{
		const uuid = req.query.uuid;
		const socket_id = req.query.socket_id;
		const job_name = req.query.job_name; 
		
		if(uuid && job_name){
			switch(job_name){
				case 'tts':
					const {text,project_id} = req.body;
					console.log(text,project_id);
					const ttsJob = new TtsJob(project_id,text,socketManager, uuid);
					const create_job_status = await ttsJob.create(socket_id);

					const job_id = 1;
					const create_job_messages = `Job ${job_name} created with id ${job_id}`;
					const emitedSocketLength = await socketManager.emit('log', create_job_messages, socket_id, uuid);
					// emitedSocketLength.then(r=>{console.log(r)})
					if(emitedSocketLength){
						return res.status(200).send({create_job_status,status:true,emitedSocketLength, message: create_job_messages});
					}else{
						return res.status(200).send({create_job_status,status:false,emitedSocketLength, message: 'no socket emited by current uuid or socket_id'});
					}
				break;
			}
		}

		
		res.status(200).send({status:false, message:'Invalid parameter specified.'});
	});
}

module.exports = JobRoute;