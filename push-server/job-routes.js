function JobRoute(socketManager, app){
	app.post('/job', async(req, res, next)=>{
		const uuid = req.query.uuid;
		const socket_id = req.query.socket_id;
		const job_name = req.query.job_name; 
		
		if(uuid && job_name){
			switch(job_name){
				case 'tts':
					const job_id = 1;
					const create_job_messages = `Job ${job_name} created with id ${job_id}`;
					const emitedSocketLength = socketManager.emit('log', create_job_messages, socket_id, uuid);
					if(emitedSocketLength){
						return res.status(200).send({status:true,emitedSocketLength, message: create_job_messages});
					}else{
						return res.status(200).send({status:false,emitedSocketLength, message: 'no socket emited by current uuid'});
					}
				break;
			}
		}

		
		res.status(200).send({status:false, message:'Invalid parameter specified.'});
	});
}

module.exports = JobRoute;