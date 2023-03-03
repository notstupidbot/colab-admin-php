const {m_socket,init_db,m_jobs} = require("./models");

const SocketManager = {
	instances : {},
	server : null,
	login : (uuid, SOCKET_CLIENT_INSTANCE_ID, SOCKET_CLIENT_INSTANCE_IP)=>{
	    m_socket.create(SOCKET_CLIENT_INSTANCE_ID,SOCKET_CLIENT_INSTANCE_IP,uuid);
	},

	logout : (uuid, SOCKET_CLIENT_INSTANCE_ID)=>{

	},

	kick : (uuid)=>{

	},

	job : (job_name, SOCKET_CLIENT_INSTANCE_ID)=>{
		console.log(`${SOCKET_CLIENT_INSTANCE_ID} send a ${job_name} `)
	},

	log : (log)=>{

	},

	getInstanceIds(){
		const ids =  Object.keys(SocketManager.instances);
		console.log(ids)
		return ids;
	},
	chat:(message, SOCKET_CLIENT_INSTANCE_ID) =>{
		SocketManager.emit('chat', `You said ${message}`, SOCKET_CLIENT_INSTANCE_ID)
	},
	emit:async(event_name, message, SOCKET_CLIENT_INSTANCE_ID, uuid, data)=>{
		let emitedSocketLength = 0;
		if(uuid){
			const sockectByUuids = await m_socket.getIdsByUuid(uuid, true);
			
			for(let i in sockectByUuids){
				const id = sockectByUuids[i].id;
				if(typeof SocketManager.instances[id] == 'object'){
					console.log(`socket id ${id} emit ${event_name}`, message, data);
					SocketManager.instances[id].emit(event_name, message, data);
					emitedSocketLength += 1;
				}
			}

		}
		else if(SOCKET_CLIENT_INSTANCE_ID){
			if(typeof SocketManager.instances[SOCKET_CLIENT_INSTANCE_ID] == 'object'){
				console.log(`socket id ${SOCKET_CLIENT_INSTANCE_ID} emit ${event_name}`, message,data);
				SocketManager.instances[SOCKET_CLIENT_INSTANCE_ID].emit(event_name,message, data);
				emitedSocketLength += 1;

			}	

		}
		return emitedSocketLength;
	}
}

function SocketRoute(SOCKET_SERVER){
	// console.log(SOCKET_SERVER);
	init_db();
	SocketManager.server = SOCKET_SERVER;

	SOCKET_SERVER.on("connection", async(SOCKET_CLIENT_INSTANCE) => {
	    const SOCKET_CLIENT_INSTANCE_ID = SOCKET_CLIENT_INSTANCE.id;
	    const SOCKET_CLIENT_INSTANCE_IP = SOCKET_CLIENT_INSTANCE.conn.remoteAddress;

	    SocketManager.instances[SOCKET_CLIENT_INSTANCE_ID] = SOCKET_CLIENT_INSTANCE;

	    SOCKET_CLIENT_INSTANCE.on("chat",message => SocketManager.chat(message, SOCKET_CLIENT_INSTANCE_ID));
	    SOCKET_CLIENT_INSTANCE.on("job",job_name => SocketManager.job(job_name,SOCKET_CLIENT_INSTANCE_ID));
	    SOCKET_CLIENT_INSTANCE.on("login",uuid => SocketManager.login(uuid,SOCKET_CLIENT_INSTANCE_ID,SOCKET_CLIENT_INSTANCE_IP));
	    SOCKET_CLIENT_INSTANCE.on("logout",uuid => SocketManager.logout(uuid, SOCKET_CLIENT_INSTANCE_ID));

	    SOCKET_SERVER.emit("chat", "Hi welcome to chat server can i help you");
	});

	return SocketManager;
	// JobRoute(SocketManager, app);


}

module.exports = SocketRoute;