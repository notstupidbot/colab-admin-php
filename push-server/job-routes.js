const {m_jobs} = require("./models")
class TtsJob{
	pid = 0;
	text = "";
	project_id = "";
	
	constructor(project_id, text){
		this.project_id = project_id;
		this.text = text;
	}
	
	checkPid(){

	}

	run(){

	}

	stop(){

	}

	async create(){
		const job_name = "tts";
		const cmdline = `tts-job.sh ${this.project_id} "${this.text}"`;
		const project_id = this.project_id;
		const existingJob = await m_jobs.getTtsJob(project_id);

		if(existingJob){
			console.log(existingJob);
			console.log(`there is existing job id ${existingJob.id}`)
			return existingJob;
		}else{
			const params = JSON.stringify({project_id});
			return m_jobs.create(job_name,cmdline,params)
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
					const ttsJob = new TtsJob(project_id,text);
					const create_job_status = await ttsJob.create();

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