const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

const {m_jobs} = require("./models")
 function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
 async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}


class TtsJob{
	pid = 0;
	text = "";
	project_id = "";
	socketManager = null;
	uuid = null;
	job = null;
	constructor(project_id, text, socketManager, uuid){
		this.project_id = project_id;
		this.text = text;
		this.socketManager = socketManager;
		this.uuid = uuid;
	}
	async get_pid_by_filter(filter_a, filter_b, filter_c){
		try{
			const result = await execPromise(`ps aux | grep ${filter_c}`)
	        let lines = result.stdout.split("\n");

	        const regexFilter = new RegExp(`grep ${filter_b}`);
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
	        if(filter_c){
	            lines = lines.filter(pi=>{
	                return pi.argv[0] == filter_a;
	            })
	        }
	        const data = {
	            counts : lines.length,
	            items : lines
	        }

	        return data;
		}catch(e){
			console.log(e);
		}
		return {
			counts : 0,
			items:[]
		}
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
	async report_process_running(status){
		const uuid = this.uuid;
		const project_id = this.project_id;
		const job_id = this.job.id;
		const log_message = `JOB_ID:${job_id} , project_id:${project_id} `+(status?'Success':'Fails');

		console.log(log_message);
		const log_data = {
			job_name : 'tts',
			at : 'run_process',
			uuid,project_id,job_id,
			success: status
		}
		this.socketManager.emit('log',log_message,null,uuid, log_data);
		m_jobs.updateTtsJobStatus(this.job.id,status);


	}
	async run(cmdline){
		const run_status = await execPromise(cmdline);
		return run_status;
	}
 
	async check_running_pid(pid){
		const project_id = this.project_id;
		let try_count = 5;
		let ps_status;
		while(try_count){
			console.log(`checking the real pid ${try_count}`)
			ps_status = await this.get_pid_by_filter('bash','tts_job.sh',project_id);
			if(ps_status.counts){
				break;
			}
			try_count -= 1;
			await timeout(1000);
		}
		return ps_status;

	}
	async start(){

		const params = this.job.params;
		const cmdline = this.job.cmdline;
		const pid = parseInt(params.pid);
		let pid_is_running = false;
		let ps_status;
		if(pid > 0){
			
			console.log(`pid  ${pid}  indicate job running`)
			console.log(`tryng to check pid still running for old process`)

			ps_status = await this.check_running_pid();
			console.log(ps_status);

			if(ps_status.counts > 0){
				ps_status = ps_status.items[0];
				if(pid == ps_status.pid){
					pid_is_running = true;
				}
			}

		}
		
		if(!pid_is_running){
			console.log(`NO PID running`);
			console.log(`Tryng to execute cmdline`)

			const run_status = this.run(cmdline);
			run_status.then(output=>{
				if(output.stdout.length > 0){
					console.log(`process success with ${output.stdout}`)
					this.report_process_running(1);
				}
				if(output.stderr.length > 0){
					console.log(`process error with ${output.stderr}`)
					this.report_process_running(-1);


				}
			}).catch(err=>{
				console.log(`process error with ${err}`)
				this.report_process_running(-1);


			})
			console.log(`tryng to check pid running for new`)
			ps_status = await this.check_running_pid();
			if(ps_status.counts > 0){
				ps_status = ps_status.items[0];
			}
			console.log(ps_status)

		}

		if(ps_status){
			// updating job params pid
			console.log(`updating job pid`)
			const newParams = params;
			newParams.pid = ps_status.pid;

			m_jobs.updateTtsJobParams(this.job.id, JSON.stringify(newParams));

			this.job.params = newParams;
		}
	}
	async create(uuid){
		console.log(`JobRoute.create`)
		const www_dir = '/container/dist/www/html';
		const job_name = "tts";
		const cmdline = `bash ${www_dir}/addon/tts-job.sh ${this.project_id} "${this.text}"`;
		const project_id = this.project_id;
		let job = await m_jobs.getTtsJob(project_id);

		let params;

		if(job){
			job.cmdline = cmdline;
			console.log(`There is existing job record for:`)
			console.log(`project_id: ${job.params.project_id}`)
			console.log(`uuid: ${job.params.uuid}`)
			params = job.params;
			// console.log(job)

		}else{
			console.log(`Creating new jobs record`);
			const pid = -1;
			params = JSON.stringify({project_id,uuid,pid})
			job = await m_jobs.create(job_name,cmdline,params);
			job = job[0];
		}

		// After creating or reading job_records
		console.log(job);
		this.job = job;
		await this.start();
		return this.job;
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
					// console.log(text,project_id);
					const ttsJob = new TtsJob(project_id,text,socketManager, uuid);
					const job = await ttsJob.create(uuid); 
					const create_job_messages = `Job created with id ${job.id}`;
					const create_job_data = {
						job_name : 'tts',
						at : 'create_job',
						uuid,project_id,job_id:job.id,
						success: true
					};
					const emitedSocketLength = await socketManager.emit('log', create_job_messages, socket_id, uuid, create_job_data);
					if(emitedSocketLength){
						return res.status(200).send({job,status:true,emitedSocketLength, message: create_job_messages});
					}else{
						return res.status(200).send({job,status:false,emitedSocketLength, message: 'no socket emited by current uuid or socket_id'});
					}
				break;
			}
		}

		
		res.status(200).send({status:false, message:'Invalid parameter specified.'});
	});
}

module.exports = JobRoute;